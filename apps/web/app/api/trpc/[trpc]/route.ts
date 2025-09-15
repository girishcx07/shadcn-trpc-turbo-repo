import { createTRPCApiHandler } from "@workspace/trpc/next-handler";

const { GET, POST, OPTIONS } = createTRPCApiHandler();


export { GET, POST, OPTIONS, };