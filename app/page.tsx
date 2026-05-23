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
  MessageSquareTextIcon,
  RocketIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TerminalSquareIcon,
} from "lucide-react";
import { Manrope } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";

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

const heroStats = [
  { value: "Prompt", label: "plain language brief" },
  { value: "Agent", label: "code, run, revise" },
  { value: "Preview", label: "interactive result" },
];

const buildSteps = [
  { label: "Create project", state: "done" },
  { label: "Spin sandbox", state: "done" },
  { label: "Generate UI", state: "active" },
  { label: "Publish files", state: "queued" },
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
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#010713] text-white">
        <HeroAtmosphere />

        <nav className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Vibe" width={34} height={34} priority />
            <span className={cn("text-2xl font-bold tracking-normal")}>
              ibe
            </span>
          </Link>
          <div className="flex items-center gap-2 text-white">
            <Button
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                "hidden text-white/75 hover:bg-white/10 hover:text-white sm:inline-flex",
              )}
            >
              <Link href="/pricing">Pricing</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className={cn(
                "rounded-full bg-white text-zinc-950 hover:bg-white/90",
              )}
            >
              <Link href="/home">
                Start building
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </nav>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4.625rem)] w-full max-w-6xl flex-1 items-center px-4 py-8 sm:px-6">
          <div className="grid w-full gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={reveal}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="shadow-primary/5 mb-6 inline-flex items-center gap-2 border border-white/10 bg-white/[0.045] px-3 py-1.5 text-sm text-white/70 shadow-2xl backdrop-blur-xl">
                <SparklesIcon className="text-primary size-4" />
                <span className={bodyFont.className}>
                  From prompt to running app in one workspace
                </span>
              </div>
              <h1
                className={cn(
                  "max-w-4xl text-5xl leading-[0.86] font-semibold text-white sm:text-7xl lg:text-[6.5rem]",
                )}
              >
                Describe it.
                <span className="block text-white/45">Watch it become UI.</span>
              </h1>
              <p
                className={cn(
                  "mt-6 max-w-xl text-base leading-7 text-white/58 sm:text-lg",
                  bodyFont.className,
                )}
              >
                Vibe gives your idea a builder: it creates the project, runs the
                agent in a sandbox, streams the result into preview, and keeps
                the code ready for GitHub.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "bg-primary text-primary-foreground shadow-primary/15 hover:bg-primary/90 rounded-full shadow-2xl",
                  )}
                >
                  <Link href="/home">
                    Start a build
                    <RocketIcon className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className={cn(
                    "rounded-full border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white",
                  )}
                >
                  <Link href="#features">See the system</Link>
                </Button>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 border-y border-white/10 py-4">
                {heroStats.map((stat) => (
                  <div key={stat.value} className="pr-4">
                    <div className={cn("text-lg font-semibold text-white")}>
                      {stat.value}
                    </div>
                    <p
                      className={cn(
                        "mt-1 text-xs leading-5 text-white/45",
                        bodyFont.className,
                      )}
                    >
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.75, delay: 0.12, ease: "easeOut" }}
              className="relative"
            >
              <BuildConsole />
            </motion.div>
          </div>
        </div>

        <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t to-transparent" />
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
              <div className={cn("text-primary text-5xl font-semibold")}>
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

function HeroAtmosphere() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,var(--primary)_0%,transparent_24%),radial-gradient(circle_at_82%_28%,#c96342_0%,transparent_18%),radial-gradient(circle_at_58%_88%,var(--primary)_0%,transparent_18%),linear-gradient(135deg,#010713_0%,#04101f_52%,#010713_100%)] opacity-55" />
      <div className="absolute top-1/2 left-1/2 h-[125vmax] w-[125vmax] -translate-x-1/2 -translate-y-1/2 [animation:spin_48s_linear_infinite] bg-[conic-gradient(from_180deg_at_50%_50%,transparent_0deg,var(--primary)_60deg,transparent_132deg,#c96342_205deg,transparent_276deg,var(--primary)_330deg,transparent_360deg)] opacity-16 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.024)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.022)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_70%)] bg-[size:76px_76px]" />
      <div className="absolute inset-x-[-20%] top-[20%] h-36 rotate-[-8deg] [animation:moveHorizontal_26s_ease-in-out_infinite] bg-[linear-gradient(90deg,transparent,var(--primary),#c96342,transparent)] opacity-12 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_38%,#010713_88%)]" />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}

function BuildConsole() {
  return (
    <div className="relative">
      <div className="bg-primary/10 absolute -inset-5 rounded-[2rem] blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#030b16]/[0.88] p-4 shadow-2xl shadow-black/60 backdrop-blur-2xl">
        <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="bg-destructive size-2.5 rounded-full" />
            <span className="size-2.5 rounded-full bg-[#c96342]" />
            <span className="bg-primary size-2.5 rounded-full" />
          </div>
          <div className="flex items-center gap-2 text-xs text-white/45">
            <TerminalSquareIcon className="text-primary size-4" />
            <span className={bodyFont.className}>vibe.run/build</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-white/45">
            <MessageSquareTextIcon className="text-primary size-4" />
            <span className={bodyFont.className}>Prompt</span>
          </div>
          <p className={cn("text-lg leading-7 text-white sm:text-xl")}>
            Build a launch dashboard with auth, usage charts, settings, and a
            clean GitHub publish flow.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Next.js", "Tailwind", "shadcn/ui", "GitHub sync"].map((item) => (
              <span
                key={item}
                className={cn(
                  "rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/65",
                  bodyFont.className,
                )}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[0.82fr_1.18fr]">
          <div className="space-y-2">
            {buildSteps.map((step) => (
              <div
                key={step.label}
                className="flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3"
              >
                <span
                  className={cn(
                    "size-2 rounded-full",
                    step.state === "active" &&
                      "bg-primary shadow-[0_0_18px_var(--primary)]",
                    step.state === "done" && "bg-[#c96342]",
                    step.state === "queued" && "bg-white/25",
                  )}
                />
                <span
                  className={cn("text-sm text-white/72", bodyFont.className)}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-2 text-xs text-white/45">
                <EyeIcon className="text-primary size-4" />
                <span className={bodyFont.className}>Live preview</span>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#c96342] shadow-[0_0_12px_#c96342]" />
            </div>
            <div className="p-4">
              <div className="mb-5 h-24 rounded-lg bg-[linear-gradient(135deg,var(--primary),#c96342)] p-4 opacity-80">
                <div className="h-2 w-20 rounded-full bg-white/55" />
                <div className="mt-7 h-6 w-36 rounded bg-white/70" />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[72, 48, 62].map((width) => (
                  <div
                    key={width}
                    className="rounded-md border border-white/[0.08] bg-black/20 p-3"
                  >
                    <div className="bg-primary/35 mb-3 h-6 w-6 rounded" />
                    <div
                      className="h-2 rounded-full bg-white/35"
                      style={{ width: `${width}%` }}
                    />
                    <div className="mt-2 h-2 w-1/2 rounded-full bg-white/15" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-primary/[0.12] mt-4 flex items-center justify-between gap-4 rounded-xl border border-white/10 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-white/75">
            <BotIcon className="text-primary size-4" />
            <span className={bodyFont.className}>
              Agent is editing app/page.tsx
            </span>
          </div>
          <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-white/10">
            <div className="bg-primary h-full w-2/3 [animation:pulse_1.8s_ease-in-out_infinite] rounded-full" />
          </div>
        </div>
      </div>
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
