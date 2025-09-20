import { createORPCClient,  isDefinedError,  onError } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { router } from "../router";

declare global {
  var $client: RouterClient<typeof router> | undefined;
}

const link = new RPCLink({
  url: () => {
    if (typeof window === "undefined") {
      throw new Error("RPCLink is not allowed on the server side.");
    }
    return `${window.location.origin}/rpc`;
  },
  // interceptors: [
  //   onError(async (error) => {
  //     console.log("error >", error);
  //     // ✅ Client-side redirect
  //     if (error?.code === "UNAUTHORIZED" && typeof window !== "undefined") {
  //       window.location.href = "/some-where"; // replace with your route
  //     }
  //   }),
  // ],
});

/**
 * Fallback to client-side client if server-side client is not available.
 */
export const client: RouterClient<typeof router> =
  globalThis.$client ?? createORPCClient(link);

// Add the type annotation here
export const orpc: ReturnType<
  typeof createTanstackQueryUtils<RouterClient<typeof router>>
> = createTanstackQueryUtils(client);
