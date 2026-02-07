import { inngest } from "@/inngest/client";
import { prisma } from "@/lib/db";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";
import { createClerkClient } from "@clerk/nextjs/server";

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

  // Publish To GitHub 
  publishToGithub: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        repoName: z.string(),
        files: z.record(z.string(), z.string()),
        commitMessage: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Clerk OAuth Token
      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      const oauthToken =
        await clerkClient.users.getUserOauthAccessToken(
          ctx.auth.userId,
          "oauth_github"
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
        const { data: user } =
          await octokit.rest.users.getAuthenticated();

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
        for (const [path, content] of Object.entries(input.files)) {
          let sha: string | undefined;

          // Try to get SHA if file exists
          try {
            const { data: existingFile } =
              await octokit.rest.repos.getContent({
                owner,
                repo: repoName,
                path,
              });

            if (!Array.isArray(existingFile)) {
              sha = existingFile.sha;
            }
          } catch {
            sha = undefined;
          }

          // Create or Update file
          await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo: repoName,
            path,
            message:
              input.commitMessage ??
              `🔄 Sync Update - ${new Date().toLocaleString()}`,
            content: Buffer.from(content).toString("base64"),
            sha,
          });
        }

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