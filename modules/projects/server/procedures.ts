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

  // publish project to github
  publishToGithub: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        repoName: z.string(),
        files: z.record(z.string(), z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
      const oauthToken = await clerkClient.users.getUserOauthAccessToken(ctx.auth.userId, "oauth_github");
      const githubToken = oauthToken.data.find(t => t.provider === "oauth_github")?.token;

      if (!githubToken) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "GitHub account not linked." });
      }

      const { Octokit } = await import("octokit");
      const octokit = new Octokit({ auth: githubToken });

      try {
        const { data: user } = await octokit.rest.users.getAuthenticated();
        const owner = user.login;

        //1:check if repo exist or create a new one
        const repoName = input.repoName;
        try {
        //try to get repo to see if it exists
          await octokit.rest.repos.get({ owner, repo: repoName });
        } catch  {
        //if not exist create
          await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            auto_init: true,
          });
        }
        
          //2:update or create files
        for (const [path, content] of Object.entries(input.files)) {
          let sha: string | undefined;
          
          try {
            //SHA
            const { data: existingFile } = await octokit.rest.repos.getContent({
              owner,
              repo: repoName,
              path,
            });
            if (!Array.isArray(existingFile)) {
              sha = existingFile.sha;
            }
          } catch (e) {
            console.log(e.message)
          }

          //publish 
          await octokit.rest.repos.createOrUpdateFileContents({
            owner,
            repo: repoName,
            path,
            message: `🔄 Sync: Update from AI Agent - ${new Date().toLocaleString()}`,
            content: Buffer.from(content, "utf-8").toString("base64"),
            sha,   
          });
        }
        return { url: `https://github.com/${owner}/${repoName}` };

      } catch (error: any) {
        console.error("GitHub Error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to sync with GitHub",
        });
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