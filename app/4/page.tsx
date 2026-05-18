"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  BotIcon,
  BoxesIcon,
  Code2Icon,
  EyeIcon,
  GithubIcon,
  HistoryIcon,
  LockKeyholeIcon,
  MessageSquareTextIcon,
  RocketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TerminalSquareIcon,
} from "lucide-react";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";

const headingFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  display: "swap",
});

type Feature = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

const features: Feature[] = [
  {
    icon: MessageSquareTextIcon,
    title: "Prompt-first creation",
    description:
      "Describe the app you want and Vibe turns the request into a real project with a focused starting brief.",
  },
  {
    icon: BotIcon,
    title: "Agentic build loop",
    description:
      "An AI code agent plans, edits, runs commands, checks files, and keeps moving until the application is usable.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure sandbox",
    description:
      "Every generation runs inside an isolated E2B environment, so experiments stay contained while code is built.",
  },
  {
    icon: EyeIcon,
    title: "Live preview",
    description:
      "Generated apps open in an interactive preview panel, making the result visible as soon as the fragment is ready.",
  },
  {
    icon: Code2Icon,
    title: "Code inspection",
    description:
      "Flip from demo to code, browse the generated file tree, and inspect what the agent produced.",
  },
  {
    icon: GithubIcon,
    title: "GitHub publishing",
    description:
      "Connect GitHub, name the repo, write a commit message, and publish the generated files directly.",
  },
];

const workflow = [
  "Submit an idea",
  "Create project record",
  "Run Inngest workflow",
  "Build in E2B sandbox",
  "Save preview and files",
];

const stats = [
  { value: "1", label: "prompt starts a project" },
  { value: "2", label: "panels for preview and code" },
  { value: "0", label: "local setup before trying an idea" },
];

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingFourPage() {
  return (
    <main
      className={cn(
        "bg-background text-foreground relative min-h-screen overflow-x-hidden",
        bodyFont.className,
      )}
    >
      <section className="relative min-h-screen overflow-hidden">
        <GradientField />

        <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Vibe" width={34} height={34} priority />
            <span
              className={cn(
                "text-2xl font-bold tracking-normal",
                headingFont.className,
              )}
            >
              ibe
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn("hidden sm:inline-flex", bodyFont.className)}
            >
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className={cn("rounded-full", bodyFont.className)}
            >
              <Link href="/">
                Start building
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4.625rem)] w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={reveal}
            transition={{ duration: 0.65, ease: "easeOut" }}
            className="max-w-2xl self-center"
          >
            <div className="border-primary/20 bg-primary/10 text-primary mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <SparklesIcon className="size-4" />
              <span className={bodyFont.className}>
                AI website builder for fast product experiments
              </span>
            </div>
            <h1
              className={cn(
                "max-w-3xl text-5xl leading-[0.9] font-semibold text-zinc-900 sm:text-7xl lg:text-8xl dark:text-zinc-100",
                headingFont.className,
              )}
            >
              Build the app while the idea is still warm.
            </h1>
            <p
              className={cn(
                "text-muted-foreground mt-6 max-w-xl text-base leading-7 sm:text-lg",
                bodyFont.className,
              )}
            >
              Vibe turns a plain language prompt into a working Next.js project,
              then gives you the preview, code, history, and publishing path in
              one focused workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className={cn("rounded-full", bodyFont.className)}
              >
                <Link href="/">
                  Try Vibe
                  <RocketIcon className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className={cn(
                  "bg-background/70 rounded-full",
                  bodyFont.className,
                )}
              >
                <Link href="#features">Explore features</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.1, ease: "easeOut" }}
            className="relative self-center"
          >
            <ProductMockup />
          </motion.div>
        </div>
      </section>

      <section className="border-border/70 bg-card/45 relative z-10 border-y py-10 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={reveal}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="border-border bg-background/70 rounded-lg border p-5"
            >
              <div
                className={cn(
                  "text-primary text-5xl font-semibold",
                  headingFont.className,
                )}
              >
                {stat.value}
              </div>
              <p
                className={cn(
                  "text-muted-foreground mt-1 text-sm",
                  bodyFont.className,
                )}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section
        id="features"
        className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6"
      >
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={reveal}
          transition={{ duration: 0.55 }}
          className="max-w-2xl"
        >
          <h2
            className={cn(
              "text-4xl leading-none font-semibold text-zinc-900 sm:text-6xl dark:text-zinc-100",
              headingFont.className,
            )}
          >
            Everything needed to go from idea to repo.
          </h2>
          <p className={cn("text-muted-foreground mt-4", bodyFont.className)}>
            The product surface stays simple, but the workflow underneath covers
            generation, execution, review, persistence, and release.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={reveal}
            transition={{ duration: 0.55 }}
          >
            <div className="bg-secondary text-secondary-foreground mb-4 inline-flex size-11 items-center justify-center rounded-lg">
              <BoxesIcon className="size-5" />
            </div>
            <h2
              className={cn(
                "text-4xl leading-none font-semibold text-zinc-900 sm:text-6xl dark:text-zinc-100",
                headingFont.className,
              )}
            >
              A calm workflow around a busy agent.
            </h2>
            <p className={cn("text-muted-foreground mt-4", bodyFont.className)}>
              Vibe keeps the moving parts behind the curtain: database records,
              background jobs, sandbox commands, generated fragments, and GitHub
              sync all meet in a clean project view.
            </p>
          </motion.div>

          <div className="grid gap-3">
            {workflow.map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="border-border bg-card flex items-center gap-4 rounded-lg border p-4"
              >
                <div
                  className={cn(
                    "bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-md text-2xl font-semibold",
                    headingFont.className,
                  )}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    "text-card-foreground text-base",
                    bodyFont.className,
                  )}
                >
                  {step}
                </span>
                <div className="from-primary/0 via-primary/60 to-primary/0 ml-auto h-px w-12 bg-gradient-to-r" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="border-primary/20 bg-secondary text-secondary-foreground overflow-hidden rounded-lg border p-8 shadow-2xl sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2
                className={cn(
                  "text-4xl leading-none font-semibold sm:text-6xl",
                  headingFont.className,
                )}
              >
                Start with a sentence. Leave with software.
              </h2>
              <p
                className={cn(
                  "text-secondary-foreground/70 mt-4 max-w-2xl text-sm leading-6 sm:text-base",
                  bodyFont.className,
                )}
              >
                Create projects, keep their message history, inspect generated
                files, preview the result, and ship to GitHub when it is ready.
              </p>
            </div>
            <Button
              asChild
              size="lg"
              className={cn(
                "bg-primary text-primary-foreground hover:bg-primary/90 rounded-full",
                bodyFont.className,
              )}
            >
              <Link href="/">
                Open Vibe
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function GradientField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2 [animation:spin_32s_linear_infinite] bg-[conic-gradient(from_110deg_at_50%_50%,var(--background)_0deg,var(--accent)_52deg,var(--primary)_120deg,var(--chart-2)_190deg,var(--chart-3)_255deg,var(--primary)_315deg,var(--background)_360deg)] opacity-40 blur-2xl dark:opacity-35" />
      <div className="absolute inset-y-[-18%] left-[-24%] w-[148%] [animation:moveHorizontal_24s_ease-in-out_infinite] bg-[linear-gradient(115deg,transparent_0%,var(--primary)_24%,var(--chart-2)_42%,var(--accent)_58%,var(--chart-3)_76%,transparent_100%)] opacity-25 blur-3xl dark:opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_34%,var(--background)_86%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background)_0%,transparent_18%,transparent_68%,var(--background)_100%)] opacity-80" />
    </div>
  );
}

function ProductMockup() {
  return (
    <div className="border-border bg-card/80 relative rounded-lg border p-3 shadow-2xl backdrop-blur-xl">
      <div className="border-border flex items-center gap-2 border-b px-2 pb-3">
        <span className="bg-destructive size-2.5 rounded-full" />
        <span className="bg-chart-3 size-2.5 rounded-full" />
        <span className="bg-chart-2 size-2.5 rounded-full" />
        <div className="bg-muted ml-3 h-7 flex-1 rounded-md" />
      </div>

      <div className="grid min-h-[30rem] gap-3 pt-3 md:grid-cols-[0.9fr_1.1fr]">
        <div className="border-border bg-background flex flex-col rounded-lg border p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" alt="Vibe" width={24} height={24} />
              <span className={cn("text-sm font-semibold", bodyFont.className)}>
                Landing sprint
              </span>
            </div>
            <HistoryIcon className="text-muted-foreground size-4" />
          </div>
          <div className="space-y-3">
            <MessageBubble tone="user">
              Build a SaaS dashboard with auth, charts, and a polished settings
              page.
            </MessageBubble>
            <MessageBubble tone="agent">
              Planning layout, creating components, wiring sample states, and
              checking the app.
            </MessageBubble>
          </div>
          <div className="border-border bg-muted/40 mt-auto rounded-lg border p-3">
            <div className="text-muted-foreground mb-2 flex items-center gap-2 text-xs">
              <TerminalSquareIcon className="size-4" />
              Agent activity
            </div>
            <div className="space-y-2">
              {["app/page.tsx", "components/chart.tsx", "npm run build"].map(
                (item) => (
                  <div key={item} className="bg-primary/20 h-2 rounded-full">
                    <div
                      className={cn(
                        "bg-primary h-full rounded-full",
                        item === "app/page.tsx" && "w-11/12",
                        item === "components/chart.tsx" && "w-3/4",
                        item === "npm run build" && "w-1/2",
                      )}
                    />
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="border-border bg-background rounded-lg border p-3">
          <div className="mb-3 flex items-center justify-between">
            <div className="border-border inline-flex rounded-md border p-1">
              <span
                className={cn(
                  "bg-primary text-primary-foreground rounded-sm px-3 py-1 text-xs",
                  bodyFont.className,
                )}
              >
                Demo
              </span>
              <span
                className={cn(
                  "text-muted-foreground px-3 py-1 text-xs",
                  bodyFont.className,
                )}
              >
                Code
              </span>
            </div>
            <LockKeyholeIcon className="text-primary size-4" />
          </div>
          <div className="border-border overflow-hidden rounded-lg border">
            <div className="bg-secondary text-secondary-foreground p-5">
              <div className="bg-primary h-3 w-24 rounded-full" />
              <div className="bg-secondary-foreground/90 mt-8 h-10 w-3/4 rounded-md" />
              <div className="bg-secondary-foreground/25 mt-3 h-3 w-11/12 rounded-full" />
              <div className="bg-secondary-foreground/25 mt-2 h-3 w-2/3 rounded-full" />
            </div>
            <div className="bg-card grid grid-cols-3 gap-2 p-3">
              {["Auth", "Charts", "Settings"].map((item) => (
                <div
                  key={item}
                  className="border-border bg-background rounded-md border p-3"
                >
                  <div className="bg-primary/15 mb-3 h-6 w-6 rounded" />
                  <div className="bg-foreground/20 h-2 w-14 rounded-full" />
                  <div className="bg-muted mt-2 h-2 w-10 rounded-full" />
                  <span className="sr-only">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  children,
  tone,
}: {
  children: string;
  tone: "user" | "agent";
}) {
  return (
    <div
      className={cn(
        "rounded-lg p-3 text-sm leading-6",
        bodyFont.className,
        tone === "user"
          ? "bg-primary text-primary-foreground ml-8"
          : "border-border bg-card text-card-foreground mr-8 border",
      )}
    >
      {children}
    </div>
  );
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const Icon = feature.icon;

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={reveal}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group border-border bg-card hover:border-primary/40 rounded-lg border p-5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground mb-5 flex size-11 items-center justify-center rounded-lg transition">
        <Icon className="size-5" />
      </div>
      <h3
        className={cn(
          "text-card-foreground text-3xl leading-none font-semibold",
          headingFont.className,
        )}
      >
        {feature.title}
      </h3>
      <p
        className={cn(
          "text-muted-foreground mt-3 text-sm leading-6",
          bodyFont.className,
        )}
      >
        {feature.description}
      </p>
    </motion.article>
  );
}
