"use client";

import { FileExplorer } from "@/components/file-explorer";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserControl } from "@/components/user-control";
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
import type { Fragment } from "./components/Fragment-web";
import { FragmentWeb } from "./components/Fragment-web";
import { MessagesContainer } from "./components/messages-container";
import { ProjectHeader } from "./components/project-header";
import { useTRPC} from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

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

  //Load Project Data From DB

  const projectQuery = useQuery(
  trpc.projects.getOne.queryOptions({
    id: projectId,
  })
);

  
  // GitHub Modal States
  const [isGitHubModalOpen, setGitHubModalOpen] = useState(false);

  const [repoNameInput, setRepoNameInput] = useState(
    `ai-gen-${projectId.slice(0, 8)}`
  );

  const [commitMessageInput, setCommitMessageInput] = useState(
    "🔄 Update from AI Agent"
  );

  const [isExistingRepo, setIsExistingRepo] = useState(false);

  
  //When Project Loads → Fill repoName
  useEffect(() => {
    if (projectQuery.data?.repoName) {
      setRepoNameInput(projectQuery.data.repoName);
      setIsExistingRepo(true);
    }
  }, [projectQuery.data]);

  // GitHub Linked?
  const isGithubLinked =
    !!clerk.user &&
    clerk.user.externalAccounts.some((acc) => acc.provider === "github");

  // GitHub OAuth Connect
  // GitHub OAuth Connect - التعديل هنا
  const handleGithubAuth = async () => {
    try {
      const user = clerk.user;
      if (!user) return;

      const account = await user.createExternalAccount({
        strategy: "oauth_github",
        redirectUrl: window.location.href,
        // إضافة هذا السطر يطلب من GitHub إجبار المستخدم على اختيار حساب
        additionalScopes: ["repo", "user"], 
      });

      const redirectURL = account.verification?.externalVerificationRedirectURL;

      if (redirectURL) {
        // إضافة مطالبات لـ GitHub لإظهار صفحة تسجيل الدخول حتى لو في حساب مفتوح
        const urlWithPrompt = new URL(redirectURL.href);
        urlWithPrompt.searchParams.set("prompt", "select_account"); // هذا يطلب من GitHub إظهار اختيار الحساب
        
        window.location.href = urlWithPrompt.href;
      }
    } catch (err:any) {
      // ... Catch error logic
    }
  };

  // Publish Mutation
  const publishToGithub = useMutation(
    trpc.projects.publishToGithub.mutationOptions({
      onSuccess: (data) => {
        toast.success("Successfully synced with GitHub!");
        window.open(data.url, "_blank");

        //After publish → mark repo as existing
        setIsExistingRepo(true);
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
    })
  );

  // Open Modal
  const openGitHubModal = () => {
    if (!activeFragment) return;

    if (!isGithubLinked) {
      handleGithubAuth();
      return;
    }

    //If repoName already saved → Update Mode
    if (projectQuery.data?.repoName) {
      setIsExistingRepo(true);
    }

    setGitHubModalOpen(true);
  };

  // Publish Button Click
  const onPublishClick = () => {
    if (!activeFragment) return;

    publishToGithub.mutate({
      projectId,
      repoName: repoNameInput,
      files: activeFragment.files as Record<string, string>,
      commitMessage: commitMessageInput,
    });

    setGitHubModalOpen(false);
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
                  className="gap-x-2 h-8"
                  disabled={publishToGithub.isPending}
                  onClick={() => {
                    if (!isGithubLinked) handleGithubAuth();
                    else openGitHubModal();
                  }}
                >
                  {publishToGithub.isPending
                    ? <Loader2Icon className="size-4 animate-spin" />
                    : <GithubIcon className="size-4" />}
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
      
      {isGitHubModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50">
          <div className="bg-white p-6 rounded w-96 text-black">
            <h2 className="font-bold mb-4">
              {isExistingRepo
                ? "Push Update to GitHub"
                : "Create GitHub Repository"}
            </h2>

            {/* Repo Name Only First Time */}
            {!isExistingRepo && (
              <>
                <label>Repository Name</label>
                <input
                  className="w-full border mb-4 px-2 py-1"
                  value={repoNameInput}
                  onChange={(e) => setRepoNameInput(e.target.value)}
                />
              </>
            )}

            <label>Commit Message</label>
            <input
              className="w-full border mb-4 px-2 py-1"
              value={commitMessageInput}
              onChange={(e) => setCommitMessageInput(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setGitHubModalOpen(false)}
              >
                Cancel
              </Button>

              <Button onClick={onPublishClick}>
                {isExistingRepo ? "Update" : "Publish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};