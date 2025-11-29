"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const invoke = useMutation(
    trpc.invoke.mutationOptions({
      onSuccess: () => {
        toast.success("Background job has been started");
        setValue("")
      },
    })
  );

  return (
    <div className="p-4 flex flex-col gap-5 w-1/5 ">
      <Input
        placeholder="Start typing"
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <Button
        disabled={invoke.isPending}
        onClick={() => invoke.mutate({ value: value })}
        className="cursor-pointer"
      >
        Invoke Background job
      </Button>
    </div>
  );
}
