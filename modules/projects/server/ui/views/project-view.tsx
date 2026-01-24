"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { MessagesContainer } from "./components/messages-container";
import { Suspense, useState } from "react";
import { ProjectHeader } from "./components/project-header";
import { FragmentWeb } from "./components/Fragment-web";
import type { Fragment } from "./components/Fragment-web";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EyeIcon, CodeIcon, CrownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CodeView } from "./components/Code-view";
import { FileExplorer } from "./components/file-explorer";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "Code">("preview");

  return (
    <div className="h-screen bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* LEFT PANEL */}
        <ResizablePanel
          defaultSize={45}
          minSize={20}
          className="flex flex-col border-r bg-muted/30"
        >
          <Suspense
            fallback={
              <p className="p-4 text-sm text-muted-foreground">
                Loading project...
              </p>
            }
          >
            <ProjectHeader projectId={projectId} />
          </Suspense>

          <Suspense
            fallback={
              <p className="p-4 text-sm text-muted-foreground">
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

        <ResizableHandle withHandle />

        {/* RIGHT PANEL */}
        <ResizablePanel defaultSize={55} minSize={50} className="flex flex-col">
          <Tabs
            value={tabState}
            defaultValue="preview"
            onValueChange={(value) => setTabState(value as "preview" | "Code")}
            className="flex h-full flex-col"
          >
            {/* TABS HEADER */}
            <div className="flex items-center justify-between border-b px-4 py-2">
              <TabsList className="bg-muted p-1">
                <TabsTrigger value="preview" className="gap-2">
                  <EyeIcon className="h-4 w-4" />
                  Demo
                </TabsTrigger>
                <TabsTrigger value="Code" className="gap-2">
                  <CodeIcon className="h-4 w-4" />
                  Code
                </TabsTrigger>
              </TabsList>

              <Button
                variant={"tertiary"}
                asChild
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:opacity-90"
              >
                <Link href="/pricing" className="flex items-center gap-2">
                  <CrownIcon className="h-4 w-4" />
                  Upgrade
                </Link>
              </Button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-hidden p-4">
              <TabsContent
                value="preview"
                className="h-full rounded-lg border bg-background"
              >
                {activeFragment?.files ? (
                  <FragmentWeb data={activeFragment} />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No preview available
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="Code"
                className="h-full rounded-lg border bg-background"
              >
                {activeFragment?.files ? (
                  <FileExplorer
                    files={activeFragment.files as Record<string, string>}
                    onFileSelect={() => {}}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No files available
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
