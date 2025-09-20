import { dehydrate } from "@tanstack/react-query";
import { HydrationBoundary } from "@tanstack/react-query";
import { orpc } from "@workspace/orpc/lib/orpc";
import Home from "./Home";
import getQueryClient from "@/lib/query-client";

export default async function Page() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(orpc.auth.me.queryOptions());
  // Prefetch todos for faster initial render
  queryClient.prefetchQuery(
    orpc.todo.getTodos.queryOptions({
      input: { amount: 5 },
    })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Home />
    </HydrationBoundary>
  );
}
