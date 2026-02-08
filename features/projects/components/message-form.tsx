import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { Usage } from "@/features/usage/components/usage";
import { useCreateMessage } from "../hooks/use-create-message";
import { formSchema } from "../constants/form-schema";

export const MessageForm = ({ projectId }: { projectId: string }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });
  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.status.queryOptions());
  const { mutateAsync, isPending: isCreatingMessage } = useCreateMessage(
    trpc,
    projectId,
    form,
  );
  const [isFocused, setIsFocused] = useState(false);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync({
      value: values.value,
      projectId,
    });
  };

  const isButtonDisabled = isCreatingMessage || !form.formState.isValid;
  const showUsage = !!usage;

  return (
    <Form {...form}>
      {showUsage && (
        <Usage
          points={usage.remainingPoints}
          msBeforeNext={usage.msBeforeNext}
        />
      )}
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "realtive bg-sidebar dark:bg-sidebar rounded-xl border p-4 pt-1 transition-all",
          isFocused && "shadow-xs",
          showUsage && "rounded-t-none",
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              disabled={isCreatingMessage}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="font-body w-full resize-none border-none bg-transparent pt-4 outline-none"
              placeholder="What Would You Like To Build?"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex items-end justify-between gap-x-2 pt-2">
          <div className="text-muted-foreground font-mono text-[10px]">
            <kbd className="bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none">
              <span>&#8984</span>Enter
            </kbd>
            &nbsp;to submit
          </div>
          <Button
            disabled={isButtonDisabled}
            className={cn(
              "size-8 rounded-full",
              isButtonDisabled && "bg-muted-foreground border",
            )}
          >
            {isCreatingMessage ? (
              <Loader2Icon className="size-4animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
