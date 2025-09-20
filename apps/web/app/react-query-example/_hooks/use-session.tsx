"use client";

import { useQuery } from "@tanstack/react-query";
import { orpc } from "@workspace/orpc/lib/orpc";

export function useSession() {
  return  useQuery(orpc.auth.me.queryOptions());
}
