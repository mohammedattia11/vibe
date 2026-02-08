import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../constants/form-schema";

export const useCreateMessage = (
  trpc: ReturnType<typeof useTRPC>,
  projectId: string,
  form: UseFormReturn<z.infer<typeof formSchema>>,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMutation(
    trpc.messages.create.mutationOptions({
      onSuccess: () => {
        form.reset();
        queryClient.invalidateQueries(
          trpc.messages.getMany.queryOptions({ projectId }),
        );
        queryClient.invalidateQueries(trpc.usage.status.queryOptions());
      },
      onError: (error) => {
        toast.error(error.message);
        if (error.data?.code === "TOO_MANY_REQUESTS") {
          router.push("/pricing");
        }
      },
    }),
  );
  return { mutateAsync, isPending };
};
