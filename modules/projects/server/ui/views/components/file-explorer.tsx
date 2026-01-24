import { CopyCheck, CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { TreeView } from "./Code-view/tree-view";
import { Hint } from "./hint";
import { CodeView } from "./Code-view";
import { convertFilesToTreeItems } from "./Code-view/tree-view";
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
import { tree } from "next/dist/build/templates/app-page";
import { el } from "date-fns/locale";

type FileCollection = { [Path: string]: string };

function getLanguageFromExtension(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();

  return extension === "ts" || extension === "tsx"
    ? "typescript"
    : "javascript";
}
interface FileBreadcrumbProps {
  filePath: string;
}
const FileBreadcrumb = ({ filePath }: FileBreadcrumbProps) => {
  const pathSegments = filePath.split("/").filter(Boolean);
  const maxItems = 4;
  const renderBreadcrumbItems = () => {
    if (pathSegments.length <= maxItems) {
      return pathSegments.map((segment, index) => {
        const isLast = index === pathSegments.length - 1;

        return (
          <Fragment key={index}>
            <BreadcrumbItem>
              {isLast ? (
                <BreadcrumbPage>{segment}</BreadcrumbPage>
              ) : (
                <span>{segment}</span>
              )}
            </BreadcrumbItem>
            {!isLast && <BreadcrumbSeparator />}
          </Fragment>
        );
      });
    } else {
      const firstSegment = pathSegments[0];
      const lastSegments = pathSegments.slice(-2);
      return (
        <BreadcrumbItem>
          <span>{firstSegment}</span>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{lastSegments[0]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbItem>
      );
    }
  };
  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbItems()}</BreadcrumbList>
    </Breadcrumb>
  );
};

interface FileExplorerProps {
  files: FileCollection;
  onFileSelect: (filePath: string, content: string) => void;
}

export const FileExplorer = ({ files, onFileSelect }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const filekeys = Object.keys(files);
    return filekeys.length > 0 ? filekeys[0] : null;
  });

  const [copied, setCopied] = useState(false);

  const treeData = useMemo(() => {
    return convertFilesToTreeItems(files);
  }, [files]);

  const handleFileSelect = useCallback(
    (filePath: string) => {
      setSelectedFile(filePath);
      onFileSelect(filePath, files[filePath]);
    },
    [files, onFileSelect],
  );

  const handleCopy = useCallback(() => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(files[selectedFile]);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [selectedFile, files]);

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full">
      <ResizablePanel defaultSize={30}>
        <TreeView
          data={treeData}
          value={selectedFile}
          onFileSelect={handleFileSelect}
        />
      </ResizablePanel>

      <ResizableHandle className="hover:bg-blue-500 transition-colors" />

      <ResizablePanel defaultSize={70} className="p-4">
        <div className="h-full w-full flex flex-col">
          <div className="border-b mb-4 pb-2 justify-between flex items-center">
            <FileBreadcrumb filePath={selectedFile || ""} />
            <Hint text="copy to clipboard" side="bottom">
              <Button variant="outline" size="icon" onClick={handleCopy}>
                {copied ? (
                  <CopyCheck className="h-3 w-3 text-green-500" />
                ) : (
                  <CopyIcon className="h-3 w-3" />
                )}
              </Button>
            </Hint>
          </div>

          <div className="flex-1 overflow-auto">
            <CodeView
              code={
                selectedFile && files[selectedFile] ? files[selectedFile] : ""
              }
              language={
                selectedFile
                  ? getLanguageFromExtension(selectedFile)
                  : "javascript"
              }
            />
          </div>

          {selectedFile && files[selectedFile] ? (
            <div className="flex"></div>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">
                Select a file to view its content
              </p>
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
