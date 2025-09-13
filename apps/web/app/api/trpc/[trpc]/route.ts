import { createTRPCApiHandler } from "@workspace/trpc/next-handler";

const { GET, POST, OPTIONS } = createTRPCApiHandler({ auth: null });

export { GET, POST, OPTIONS };