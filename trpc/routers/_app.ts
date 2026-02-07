import { createTRPCRouter } from "../init";
import { projectsRouter } from "@/features/projects/trpc/procedures";

import { messagesRouter } from "@/features/messages/trpc/procedures";
import { usageRouter } from "@/features/usage/trpc/procedures";

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  usage: usageRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
