"use client";
import { CopyCheckIcon, CopyIcon, DownloadIcon, CheckIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import JSZip from "jszip";

import { Hint } from "./hint";
import { Button } from "./ui/button";
import { CodeView } from "./code-view";
import { TreeView } from "./tree-view";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb";
import { convertFilesToTreeItems } from "@/lib/utils";

type FileCollection = { [path: string]: string };

interface FileExplorerProps {
  files: FileCollection;
}

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
}

interface FileBreadcrumbProps {
  filePath: string;
}

const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
  const pathSegments = filePath.split("/");
  const maxSegments = 3;

  const renderBreadcrumb = () => {
    if (pathSegments.length <= maxSegments) {
      // show all segements if 4 or less
      return pathSegments.map((segement, index) => {
        const isLast = index === pathSegments.length - 1;
        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage className="font-medium">
                  {segement}
                </BreadcrumbPage>
              ) : (
                <span className="text-muted-foreground">{segement}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegement = pathSegments[0];
      const lastSegement = pathSegments[pathSegments.length - 1];

      return (
        <>
          <BreadcrumbItem className="text-muted-foreground">
            <span>{firstSegement}</span>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">
                {lastSegement}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbItem>
        </>
      );
    }
  };
  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumb()}</BreadcrumbList>
    </Breadcrumb>
  );
};

export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      if (files[filePath]) {
        setSelectedFile(filePath);
      }
    },
    [files],
  );

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [selectedFile, files]);

  const handleDownloadProject = useCallback(async () => {
    const zip = new JSZip();

    // Add all files to the zip
    Object.entries(files).forEach(([filePath, content]) => {
      zip.file(filePath, content);
    });

    // Generate the zip file
    const content = await zip.generateAsync({ type: "blob" });

    // Create download link
    const url = URL.createObjectURL(content);
    const link = document.createElement("a");
    link.href = url;
    link.download = "project.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success state
    setDownloaded(true);
    setTimeout(() => {
      setDownloaded(false);
    }, 2000);
  }, [files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <div className="h-full overflow-y-auto">
          <TreeView
            data={treeData}
            value={selectedFile}
            onSelect={handleFileSelect}
          />
        </div>
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="flex h-full w-full flex-col">
            <div className="bg-sidebar flex items-center justify-between gap-x-2 border-b px-4 py-2">
              <FileBreadcrumb filePath={selectedFile} />
              <div className="flex gap-2">
                <Hint text="Copy to clipboard" side="bottom">
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-auto"
                    onClick={handleCopy}
                    disabled={copied}
                  >
                    {copied ? <CopyCheckIcon /> : <CopyIcon />}
                  </Button>
                </Hint>
                <Hint text="Download project" side="bottom">
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-auto"
                    onClick={handleDownloadProject}
                    disabled={downloaded}
                  >
                    {downloaded ? <CheckIcon /> : <DownloadIcon />}
                  </Button>
                </Hint>
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            Select a file to view it&apos;s content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
