import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./root";
import { createTRPCContext } from "./init";

// import { auth } from "~/auth/server";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

export const createTRPCApiHandler = () => { // opts: {  } auth: Auth; }
  const handler = async (req: NextRequest) => {
    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      router: appRouter,
      req,
      createContext: () =>
        createTRPCContext({
          // auth: opts.auth,
          headers: req.headers,
        }),
      onError({ error, path }) {
        console.error(`>>> tRPC Error on '${path}'`, error);
      },
    });

    setCorsHeaders(response);
    return response;
  };

  return {
    OPTIONS: () => {
      const response = new Response(null, {
        status: 204,
      });
      setCorsHeaders(response);
      return response;
    },
    GET: handler,
    POST: handler,
  };
};
