import { Fragment } from "@/app/generated/prisma";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Hint } from "@/components/hint";
import { AnimatePresence } from "framer-motion";
import { AuroraLoading } from "@/components/aurora-loading";

interface Props {
  data: Fragment;
}

export function FragmentWeb({ data }: Props) {
  const [copied, setCopied] = useState(false);

  const [fragmentkey, setFragmentkey] = useState(0);
  const [isLoading,setIsLoading] = useState(false)
  const onRefresh = () => {
    setFragmentkey((prev) => prev + 1);
    setIsLoading(true)
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
      <div className="relative h-full w-full overflow-hidden">
        <iframe
          key={fragmentkey}
          className="h-full w-full transition-opacity duration-500 ease-out data-[loading=true]:opacity-0"
          data-loading={isLoading}
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals allow-downloads"
          loading="lazy"
          src={data.sandboxUrl}
          onLoad={() => setIsLoading(false)}
        />
        <AnimatePresence>
          {isLoading && <AuroraLoading label="Loading files" subtitle="" className="absolute inset-0" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
export type { Fragment };
