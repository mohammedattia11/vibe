import { ClerkUserType, TrpcUtils } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleGithubAuth } from "../utils/handle-github-auth";

export const useGetProject = (trpc: TrpcUtils, projectId: string) => {
  const { data } = useQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    }),
  );
  return data;
};

export const usePublishProject = (
  trpc: TrpcUtils,
  handleSucess,
  clerkUser: ClerkUserType,
) => {
  const { mutate, isPending } = useMutation(
    trpc.projects.publishToGithub.mutationOptions({
      onSuccess: handleSucess,

      onError: async (error) => {
        if (
          error.message.includes("not linked") ||
          error.message.includes("UNAUTHORIZED")
        ) {
          if (!clerkUser) return;

          try {
            // Reload the user to get the latest email verification status
            await clerkUser.reload();

            const isVerified =
              clerkUser?.primaryEmailAddress?.verification?.status ===
              "verified";

            if (!isVerified) {
              toast.error("Please verify your email first");
              return;
            }

            toast.info("Connecting your GitHub account...");
            await handleGithubAuth(clerkUser);
          } catch (err) {
            toast.error("Failed to connect GitHub. Try again.");
          }
        } else {
          toast.error(error.message);
        }
      },
    }),
  );

  return { mutate, isPending };
};
