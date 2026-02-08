import { ClerkUserType, TrpcUtils } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { handleGithubAuth } from "../utils/handle-github-auth";

export const useGetProject = (trpc:TrpcUtils,projectId:string) => {
  const {data} = useQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    }),
  );
  return data
}

export const usePublishProject = (trpc:TrpcUtils,handleSucess,clerkUser:ClerkUserType) => {
  const {mutate,isPending} = useMutation(
    trpc.projects.publishToGithub.mutationOptions({
      onSuccess: handleSucess,

      onError: (error) => {
        if (
          error.message.includes("not linked") ||
          error.message.includes("UNAUTHORIZED")
        ) {
          toast.info("Connecting your GitHub account...");
          handleGithubAuth(clerkUser);
        } else {
          toast.error(error.message);
        }
      },
    }),
  );
  return {mutate,isPending}
}