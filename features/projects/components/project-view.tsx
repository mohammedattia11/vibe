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
import { GitHubPublishModal } from "../features/github-sync/components/github-publish-modal";
import { MessagesContainer } from "./messages-container";
import { ProjectHeader } from "./project-header";
import { useGetProject, usePublishProject } from "../features/github-sync/hooks/use-github-sync";
import { handleGithubAuth } from "../features/github-sync/utils/handle-github-auth";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const { has } = useAuth();
  const { user:clerkUser} = useClerk();
  const trpc = useTRPC();
  const hasProAccess = has?.({ plan: "pro" });

  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "Code">("preview");
  const [isGitHubModalOpen, setGitHubModalOpen] = useState(false);
  const [repoNameInput, setRepoNameInput] = useState("");
  const [commitMessageInput, setCommitMessageInput] = useState("");
  const [isExistingRepo, setIsExistingRepo] = useState(false);

  const githubProject = useGetProject(trpc, projectId);
  
  const isGithubLinked =
    !!clerkUser &&
    clerkUser.externalAccounts.some((acc) => acc.provider === "github");

  const handleSucess = (data:any) => {
    toast.success("Successfully synced with GitHub!");
    window.open(data.url, "_blank");

    setIsExistingRepo(true);
    setGitHubModalOpen(false); // Close modal on success
  }
  
  const { mutate:publishProject, isPending:isPublishing} = usePublishProject(trpc, handleSucess, clerkUser);

  const openGitHubModal = () => {
    if (!activeFragment) return;

    if (!isGithubLinked) {
      handleGithubAuth(clerkUser);
      return;
    }

    if (githubProject?.repoName) {
      setIsExistingRepo(true);
    }

    setGitHubModalOpen(true);
  };

  const onPublishClick = () => {
    if (!activeFragment) return;

    publishProject({
      projectId,
      repoName: repoNameInput.replaceAll(" ","-"),
      files: activeFragment.files as Record<string, string>,
      commitMessage: commitMessageInput,
    });
  };

  useEffect(() => {
    if (githubProject?.repoName) {
      setRepoNameInput(githubProject.repoName);
      setIsExistingRepo(true);
    }
  }, [githubProject]);

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
                  disabled={isPublishing}
                  onClick={() => {
                    if (!isGithubLinked) handleGithubAuth(clerkUser);
                    else openGitHubModal();
                  }}
                >
                  {isPublishing ? (
                    <Loader2Icon className="size-4 animate-spin" />
                  ) : (
                    <GithubIcon className="size-4" />
                  )}
                  {!isGithubLinked
                    ? "Connect GitHub"
                    :isPublishing 
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
        isPublishing={isPublishing}
        onPublish={onPublishClick}
      />
    </div>
  );
};
