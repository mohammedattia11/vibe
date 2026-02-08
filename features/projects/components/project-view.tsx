"use client";

import { FileExplorer } from "./file-explorer";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserControl } from "@/components/user-control";
import { useTRPC } from "@/trpc/client";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CodeIcon,
  CrownIcon,
  EyeIcon,
  GithubIcon,
  Loader2Icon,
} from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Fragment } from "./Fragment-web";
import { FragmentWeb } from "./Fragment-web";
import { GitHubPublishModal } from "./github-publish-modal";
import { MessagesContainer } from "./messages-container";
import { ProjectHeader } from "./project-header";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const clerk = useClerk();
  const trpc = useTRPC();

  const hasProAccess = has?.({ plan: "pro" });

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "Code">("preview");

  const projectQuery = useQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    }),
  );
  const [isGitHubModalOpen, setGitHubModalOpen] = useState(false);

  const [repoNameInput, setRepoNameInput] = useState("");

  const [commitMessageInput, setCommitMessageInput] = useState("");

  const [isExistingRepo, setIsExistingRepo] = useState(false);

  useEffect(() => {
    if (projectQuery.data?.repoName) {
      setRepoNameInput(projectQuery.data.repoName);
      setIsExistingRepo(true);
    }
  }, [projectQuery.data]);

  const isGithubLinked =
    !!clerk.user &&
    clerk.user.externalAccounts.some((acc) => acc.provider === "github");

  const handleGithubAuth = async () => {
    try {
      const user = clerk.user;
      if (!user) return;

      const account = await user.createExternalAccount({
        strategy: "oauth_github",
        redirectUrl: window.location.href,
        additionalScopes: ["repo", "user"],
      });

      const redirectURL = account.verification?.externalVerificationRedirectURL;

      if (redirectURL) {
        const urlWithPrompt = new URL(redirectURL.href);
        urlWithPrompt.searchParams.set("prompt", "select_account");

        window.location.href = urlWithPrompt.href;
      }
    } catch (err: any) {
      toast.error("Failed to initiate GitHub authentication");
      console.error(err);
    }
  };

  const publishToGithub = useMutation(
    trpc.projects.publishToGithub.mutationOptions({
      onSuccess: (data) => {
        toast.success("Successfully synced with GitHub!");
        window.open(data.url, "_blank");

        setIsExistingRepo(true);
        setGitHubModalOpen(false); // Close modal on success
      },

      onError: (error) => {
        if (
          error.message.includes("not linked") ||
          error.message.includes("UNAUTHORIZED")
        ) {
          toast.info("Connecting your GitHub account...");
          handleGithubAuth();
        } else {
          toast.error(error.message);
        }
      },
    }),
  );

  const openGitHubModal = () => {
    if (!activeFragment) return;

    if (!isGithubLinked) {
      handleGithubAuth();
      return;
    }

    if (projectQuery.data?.repoName) {
      setIsExistingRepo(true);
    }

    setGitHubModalOpen(true);
  };

  const onPublishClick = () => {
    if (!activeFragment) return;

    publishToGithub.mutate({
      projectId,
      repoName: repoNameInput,
      files: activeFragment.files as Record<string, string>,
      commitMessage: commitMessageInput,
    });
  };

  return (
    <div className="bg-background h-screen">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* LEFT PANEL */}
        <ResizablePanel
          defaultSize={45}
          minSize={20}
          className="bg-muted/30 flex flex-col border-r"
        >
          <Suspense
            fallback={
              <p className="text-muted-foreground p-4 text-sm">
                Loading project...
              </p>
            }
          >
            <ProjectHeader projectId={projectId} />
          </Suspense>

          <Suspense
            fallback={
              <p className="text-muted-foreground p-4 text-sm">
                Loading messages...
              </p>
            }
          >
            <MessagesContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>

        <ResizableHandle className="hover:bg-primary transition-colors" />

        {/* RIGHT PANEL */}
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            value={tabState}
            defaultValue="preview"
            onValueChange={(value) => setTabState(value as "preview" | "Code")}
            className="h-full gap-y-0"
          >
            <div className="flex w-full items-center gap-x-2 border-b p-2">
              <TabsList className="h-8 rounded-md border p-0">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>

              {activeFragment && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-x-2"
                  disabled={publishToGithub.isPending}
                  onClick={() => {
                    if (!isGithubLinked) handleGithubAuth();
                    else openGitHubModal();
                  }}
                >
                  {publishToGithub.isPending ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <GithubIcon className="size-4" />
                  )}
                  {!isGithubLinked
                    ? "Connect GitHub"
                    : publishToGithub.isPending
                      ? "Updating GitHub..."
                      : "Publish to GitHub"}
                </Button>
              )}

              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="default">
                    <Link href="/pricing">
                      <CrownIcon /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/*GitHub Modal */}
      <GitHubPublishModal
        open={isGitHubModalOpen}
        onOpenChange={setGitHubModalOpen}
        repoName={repoNameInput}
        onRepoNameChange={setRepoNameInput}
        commitMessage={commitMessageInput}
        onCommitMessageChange={setCommitMessageInput}
        isExistingRepo={isExistingRepo}
        isPublishing={publishToGithub.isPending}
        onPublish={onPublishClick}
      />
    </div>
  );
};
