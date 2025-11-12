import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import Client from "./client";
import { Suspense } from "react";

export default function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.createAI.queryOptions({ text: "user prefetched" })
  );
  return <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<p>loading...</p>}>
      <Client/>
    </Suspense>
  </HydrationBoundary>;
}
