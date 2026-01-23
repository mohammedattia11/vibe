import { Fragment } from "@/app/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Hint } from "./hint";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [fragmentkey, setFragmentkey] = useState(0);
  const [copied, setCopied] = useState(false);
  const onRefresh = () => {
    setFragmentkey((prev) => prev + 1);
  };
  const handelCopy = () => {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-4 border-b bg-sidebar-border flex items-center gap-2">
        <Hint
          text={data?.sandboxUrl ? "Refresh" : "No URL available"}
          side="top"
          align="center"
        >
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon className="w-4 h-4 mr-2" />
          </Button>
        </Hint>
        <Hint
          text={data.sandboxUrl ? "click to copy" : "No URL available"}
          side="top"
          align="center"
        >
          <Button
            size="sm"
            variant="outline"
            onClick={handelCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 justify-star text-start font-normal"
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint
          text={data.sandboxUrl ? "Open in new tab" : "No URL available"}
          side="top"
          align="center"
        >
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              if (data.sandboxUrl) {
                window.open(data.sandboxUrl, "_blank");
              }
            }}
            disabled={!data.sandboxUrl}
            className="flex-1 justify-star text-start font-normal"
          >
            <ExternalLinkIcon className="w-4 h-4" />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentkey}
        className="h-full w-full"
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  );
}
export type { Fragment };
