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
import { CodeIcon, CrownIcon, EyeIcon, GithubIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { Suspense, useState } from "react";
import type { Fragment } from "./components/Fragment-web";
import { FragmentWeb } from "./components/Fragment-web";
import { MessagesContainer } from "./components/messages-container";
import { ProjectHeader } from "./components/project-header";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
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
  const [tabState, setTabState] = useState<"preview" | "code">("preview");
   

  const isGithubLinked =
  !!clerk.user &&
  clerk.user.externalAccounts.some( //is there atleast one account for github in user`s externalAccounts in clerk
    (acc) => acc.provider === "github" 
  );

  // function =responsible for connecting the user's GitHub account via Clerk OAuth
  const handleGithubAuth = async () => {
    try {
      // Get the currently logged in clerk user
      const user = clerk.user;
      if (!user) return;
      // Clerk returns a redirect URL to GitHub's authorization page
      const account = await user.createExternalAccount({
        strategy: "oauth_github",
        redirectUrl: window.location.href, // Return to the same page after auth
      });
      // Redirect the user to GitHub to approve access
      const redirectURL = account.verification?.externalVerificationRedirectURL;  
      if (redirectURL) {
        window.location.href = redirectURL.href;
      }
    } catch (err: unknown) {
      if (err instanceof Error){
        if (err.message.includes("verification_required")) {
        toast.info("Please confirm your identity in the profile settings.");
      } else {
        toast.error(err.message);
      }
      } else {
        console.error("Unexpected error:", err);
        toast.error("An unexpected error occurred");
      }
    }
  };

  const publishToGithub = useMutation(
    trpc.projects.publishToGithub.mutationOptions({
    onSuccess: (data) => {
      toast.success("Successfully synced with GitHub!");
      window.open(data.url, "_blank");
    },
    onError: (error) => {
      if (error.message.includes("not linked") || error.message.includes("UNAUTHORIZED")) {
        toast.info("Connecting your GitHub account... Please wait.");
        handleGithubAuth();  
      } else {
        toast.error(error.message);
      }
    },
  })
  );

  const onPublishClick = () => {
    // Make sure there are files to publish
    if (!activeFragment) return;
    
    publishToGithub.mutate({
      projectId,
      repoName: `ai-gen-${projectId.slice(0, 8)}`, 
      files: activeFragment.files as Record<string, string>,
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

        {/* RIGHT PANEL: Preview & Code */}
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
            className="h-full gap-y-0"
          >
            <div className="flex w-full items-center gap-x-2 border-b p-2">
              <TabsList className="h-8 rounded-md border p-0">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon className="size-4 mr-1" /> Demo
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon className="size-4 mr-1" /> Code
                </TabsTrigger>
              </TabsList>
              {activeFragment && (
                <Button 
                variant="outline" size="sm" className="gap-x-2 h-8"
                disabled={publishToGithub.isPending}
                onClick={() => {
                  if (!isGithubLinked) {
                    handleGithubAuth(); // not linked =>authorize
                  } else {
                    onPublishClick(); // linked => so publish
                    }
                  }
                }
                >
                  {publishToGithub.isPending ?
                   (<Loader2Icon className="size-4 animate-spin" /> ) :
                    (<GithubIcon className="size-4" />)
                    }
                    {!isGithubLinked?
                     "Connect GitHub":
                      publishToGithub.isPending? 
                      "Updating GitHub...":
                       "Publish to GitHub"}
                       </Button>
                      )}
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="default">
                    <Link href="/pricing"><CrownIcon className="size-4 mr-1" /> Upgrade</Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>
            
            <TabsContent value="preview" className="m-0 h-[calc(100%-49px)]">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            
            <TabsContent value="code" className="m-0 h-[calc(100%-49px)] overflow-hidden">
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as { [path: string]: string }} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};