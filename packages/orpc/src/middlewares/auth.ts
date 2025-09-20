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

const auth = os.errors({
  UNAUTHORIZED: {}
})


export const requiredAuthMiddleware = auth
  .$context<{ session?: { user?: User } }>()
  .middleware(async ({ context, next }) => {
    /**
     * Why we should ?? here?
     * Because it can avoid `getSession` being called when unnecessary.
     * {@link https://orpc.unnoq.com/docs/best-practices/dedupe-middleware}
     */
    const session = context.session ?? (await getSession());

    if (!session || !session.user) {
      throw new ORPCError("UNAUTHORIZED");
    }

    return next({
      context: {
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
  // 1️⃣ Get cookies from the request
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) {
    return null; // no session
  }

  // 2️⃣ Look up user by token
  const user = users.find((u) => u.id === token);

  if (!user) {
    return null; // invalid session
  }

  // 3️⃣ Return session object
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  };
}

export const authed = os.use(requiredAuthMiddleware);
