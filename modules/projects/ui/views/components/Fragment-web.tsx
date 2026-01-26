import { Fragment } from "@/app/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Hint } from "../../../../../components/hint";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [copied, setCopied] = useState(false);

  const [fragmentkey, setFragmentkey] = useState(0);
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
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Hint text="Refresh " side="bottom" align="start">
          <Button size="sm" variant="outline" onClick={onRefresh}>
            <RefreshCcwIcon />
          </Button>
        </Hint>
        <Hint text="Copy to clip board " side="bottom" align="start">
          <Button
            size="sm"
            variant="outline"
            onClick={handelCopy}
            disabled={!data.sandboxUrl || copied}
            className="flex-1 justify-start  text-start font-normal"
          >
            <span className="truncate">{data.sandboxUrl}</span>
          </Button>
        </Hint>
        <Hint text="Open in new tap " side="bottom" align="start">
          <Button
            size="sm"
            disabled={!data.sandboxUrl}
            variant="outline"
            onClick={() => {
              if (!data.sandboxUrl) return;
              window.open(data.sandboxUrl, "_blank");
            }}
          >
            <ExternalLinkIcon />
          </Button>
        </Hint>
      </div>
      <iframe
        key={fragmentkey}
        className="h-full w-full"
        sandbox="allow-forms allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  );
}
export type { Fragment };
