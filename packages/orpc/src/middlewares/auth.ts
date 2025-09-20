import { ORPCError, os } from "@orpc/server";
import { User } from "../schemas/user";

import { cookies, headers } from "next/headers";


export const users = [
  {
    id: "28aa6286-48e9-4f23-adea-3486c86acd55",
    email: "demo@example.com",
    name: "Demo User",
    password: "password123", // ⚠️ plaintext only for demo! Use hashing in real apps
  },
];

// const auth = os.errors({
//   UNAUTHORIZED: {}
// })


export const requiredAuthMiddleware = os
  .$context<{ session?: { user?: User } }>()
  .middleware(async ({ context, next }) => {
    /**
     * Why we should ?? here?
     * Because it can avoid `getSession` being called when unnecessary.
     * {@link https://orpc.unnoq.com/docs/best-practices/dedupe-middleware}
     */
    const session = context.session ?? (await getSession());

    console.log("session :", session)

    if (!session || !session.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({
      context: {
        ...context,
        user: session.user,
        headers: await headers(),
        cookies: await cookies(),
      },
    });
  });


export const base = os.use(async ({ next }) => next({
  context: {
    headers: await headers(),
    cookies: await cookies(),
  },
}))

export async function getSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return {
      user: parsed,
    };
  } catch {
    return null; // corrupted session
  }
}


export const authed = os.use(requiredAuthMiddleware);
