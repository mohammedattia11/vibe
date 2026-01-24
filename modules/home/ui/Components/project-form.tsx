"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PROJECT_TEMPLATES } from "../../constats";

const formSchema = z.object({
  value: z.string().min(1).max(10_000),
});

export const ProjectForm = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [focused, setFocused] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
  });

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        form.reset();
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions());
        router.push(`/projects/${data.id}`);
      },
      onError: (err) => toast.error(err.message),
    }),
  );
  const onSelect = (value: string) => {
    form.setValue("value", value, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
  };

  const isPending = createProject.isPending;

  return (
    <Form {...form}>
      {/* input box */}
      <form
        onSubmit={form.handleSubmit((v) =>
          createProject.mutate({ value: v.value }),
        )}
        className={cn(
          "relative w-full max-w-3xl rounded-2xl border bg-background px-4 pt-4 pb-3 transition-shadow",
          focused && "shadow-md",
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              {...field}
              minRows={2}
              maxRows={6}
              placeholder="What would you like to build?"
              disabled={isPending}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className="
                w-full resize-none bg-transparent text-sm outline-none
                placeholder:text-muted-foreground
              "
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  form.handleSubmit((v) =>
                    createProject.mutate({ value: v.value }),
                  )();
                }
              }}
            />
          )}
        />

        {/* footer */}
        <div className="mt-3 flex items-center justify-between">
          <div className="text-[11px] text-muted-foreground">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono">
              ⌘ Enter
            </kbd>{" "}
            to submit
          </div>

          <Button
            size="icon"
            disabled={isPending || !form.formState.isValid}
            className="h-8 w-8 rounded-full"
          >
            {isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>

      {/* templates */}
      <div className="mt-4 flex max-w-4xl flex-wrap justify-center gap-2">
        {PROJECT_TEMPLATES.map((t) => (
          <Button
            key={t.title}
            variant="outline"
            size="sm"
            className="rounded-full text-xs"
            onClick={() =>
              onSelect(t.prompt)
            }
          >
            <span className="mr-1">{t.emoji}</span>
            {t.title}
          </Button>
        ))}
      </div>
    </Form>
  );
};
