"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";
import { PROJECT_TEMPLATES } from "../constants/project-templates";
import { useCreateProject } from "../hooks/use-create-porject";

const formSchema = z.object({
  value: z
    .string()
    .min(1, { message: "Message is required" })
    .max(10000, { message: "Message is too long" }),
});

export const ProjectForm = () => {
  const { mutateAsync, isPending: isCreatingProject } = useCreateProject();
  const [isFocused, setIsFocused] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { value: "" },
  });

  const isButtonDisabled = isCreatingProject || !form.formState.isValid;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await mutateAsync({ value: values.value });
  };

  const OnSelect = (value: string) => {
    form.setValue("value", value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <Form {...form}>
      <div className="flex w-full flex-col gap-4">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn(
            "bg-sidebar dark:bg-sidebar relative rounded-xl border p-4 pt-2 transition-all",
            isFocused && "border-primary/40 shadow-sm",
          )}
        >
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                disabled={isCreatingProject}
                minRows={2}
                maxRows={8}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full resize-none bg-transparent pt-4 text-sm outline-none"
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

          <div className="flex items-center justify-between pt-3">
            <div className="text-muted-foreground font-mono text-[10px]">
              <kbd className="bg-muted inline-flex h-5 items-center gap-1 rounded border px-1.5 font-medium">
                <span>⌘</span>Enter
              </kbd>
              &nbsp;to submit
            </div>

            <Button
              type="submit"
              disabled={isButtonDisabled}
              className={cn(
                "size-8 rounded-full transition",
                isButtonDisabled && "bg-muted text-muted-foreground border",
              )}
            >
              {isCreatingProject ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                <ArrowUpIcon className="size-4" />
              )}
            </Button>
          </div>
        </form>

        <div className="hidden max-w-3xl flex-wrap justify-center gap-2 md:flex">
          {PROJECT_TEMPLATES.map((template) => (
            <Button
              key={template.title}
              variant="outline"
              size="sm"
              className="dark:bg-sidebar font-heading bg-white text-base tracking-wide"
              onClick={() => OnSelect(template.prompt)}
            >
              {template.emoji} {template.title}
            </Button>
          ))}
        </div>
      </div>
    </Form>
  );
};
