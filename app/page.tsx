"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.invoke.mutationOptions({}))
  return <div className="p-4">
    <Button onClick={()=>invoke.mutate({text :"atia"})} className="cursor-pointer">Invoke Background job</Button>
  </div>;
}
