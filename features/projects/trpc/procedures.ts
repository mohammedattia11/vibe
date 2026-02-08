import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { consumeCredits } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { createClerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { generateSlug } from "random-word-slugs";
import pLimit from "p-limit";
import z from "zod";
import { fetchRemoteFileSHAs } from "../features/github-sync/utils/fetch-remote-SHA";
import { calculateGitSHA } from "../features/github-sync/utils/calculateGitSHA";

export const projectsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "projectId is required" }),
      }),
    )
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });
      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return existingProject;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return projects;
  }),

  // Publish To GitHub with Smart Sync (Differential Updates)
  publishToGithub: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        repoName: z.string(),
        files: z.record(z.string(), z.string()),
        commitMessage: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Clerk OAuth Token
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      const oauthToken = await clerkClient.users.getUserOauthAccessToken(
        ctx.auth.userId,
        "oauth_github",
      );

      const githubToken = oauthToken.data[0]?.token;

      if (!githubToken) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "GitHub account not linked.",
        });
      }
      const { Octokit } = await import("octokit");
      const octokit = new Octokit({ auth: githubToken });

      try {
        const { data: user } = await octokit.rest.users.getAuthenticated();
        const owner = user.login;
        const repoName = input.repoName;
        try {
          await octokit.rest.repos.get({
            owner,
            repo: repoName,
          });
        } catch {
          await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            auto_init: true,
          });
        }
        // Get the default branch
        const { data: repoData } = await octokit.rest.repos.get({
          owner,
          repo: repoName,
        });
        const defaultBranch = repoData.default_branch;

        // Get the current commit SHA for the default branch
        const { data: refData } = await octokit.rest.git.getRef({
          owner,
          repo: repoName,
          ref: `heads/${defaultBranch}`,
        });
        const currentCommitSha = refData.object.sha;

        // Get the base tree
        const { data: commitData } = await octokit.rest.git.getCommit({
          owner,
          repo: repoName,
          commit_sha: currentCommitSha,
        });
        const baseTreeSha = commitData.tree.sha;

        // SMART SYNC: Fetch remote file hashes to compare
        const remoteFileSHAs = await fetchRemoteFileSHAs(
          octokit,
          owner,
          repoName,
          baseTreeSha,
        );

        // Calculate local file hashes and identify changed files
        const changedFiles: Array<[string, string]> = [];
        for (const [path, content] of Object.entries(input.files)) {
          const localSHA = calculateGitSHA(content);
          const remoteSHA = remoteFileSHAs.get(path);

          // Only include files that are new or have changed
          if (localSHA !== remoteSHA) {
            changedFiles.push([path, content]);
          }
        }

        // If no files changed, skip the commit
        if (changedFiles.length === 0) {
          await prisma.project.update({
            where: {
              id: input.projectId,
            },
            data: {
              repoName: repoName,
              githubUrl: `https://github.com/${owner}/${repoName}`,
            },
          });

          return {
            url: `https://github.com/${owner}/${repoName}`,
          };
        }

        // Create blobs ONLY for changed files with concurrency limit
        const limit = pLimit(5);
        const fileEntries = await Promise.all(
          changedFiles.map(([path, content]) =>
            limit(async () => {
              // OPTIMIZATION: For text files, we can pass content directly to createTree
              // avoiding a separate createBlob API call (N+1 problem).
              // We only use createBlob for binary files or large content.
              const isBinary = /\.(png|jpg|jpeg|gif|ico|webp|pdf)$/i.test(path);
              const isLarge = content.length > 50000; // ~50KB limit for inline content safety

              if (!isBinary && !isLarge) {
                return {
                  path,
                  mode: "100644" as const,
                  type: "blob" as const,
                  content: content, // Pass content directly!
                };
              }

              // Fallback for binaries/large files: Create Blob first
              const { data: blobData } = await octokit.rest.git.createBlob({
                owner,
                repo: repoName,
                content: Buffer.from(content).toString("base64"),
                encoding: "base64",
              });
              return {
                path,
                mode: "100644" as const,
                type: "blob" as const,
                sha: blobData.sha,
              };
            }),
          ),
        );

        // Create a new tree with changed files
        const { data: newTree } = await octokit.rest.git.createTree({
          owner,
          repo: repoName,
          base_tree: baseTreeSha,
          tree: fileEntries,
        });

        // Create a single commit with all changes
        const { data: newCommit } = await octokit.rest.git.createCommit({
          owner,
          repo: repoName,
          message:
            input.commitMessage ??
            `🔄 Sync Update - ${new Date().toLocaleString()}`,
          tree: newTree.sha,
          parents: [currentCommitSha],
        });

        // Update the branch reference to point to the new commit
        await octokit.rest.git.updateRef({
          owner,
          repo: repoName,
          ref: `heads/${defaultBranch}`,
          sha: newCommit.sha,
          force: false,
        });

        await prisma.project.update({
          where: {
            id: input.projectId,
          },
          data: {
            repoName: repoName,
            githubUrl: `https://github.com/${owner}/${repoName}`,
          },
        });

        return {
          url: `https://github.com/${owner}/${repoName}`,
        };
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("GitHub Error:", error.message);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        } else {
          console.error("Unknown GitHub error", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to sync with GitHub",
          });
        }
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "value is required" })
          .max(10000, { message: "valus is too long" }),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await consumeCredits();
      } catch (e) {
        if (e instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong: ",
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You Have Run Out Of Credits",
          });
        }
      }

      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "User",
              type: "RESULT",
            },
          },
        },
      });

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });
      return createdProject;
    }),
});
