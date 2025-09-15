import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../init";
import { loginSchema } from "../../schemas";
import { cookies } from "next/headers";
import { xid } from "zod/v4";

// Cookie configuration
const COOKIE_NAME = "auth-user-id";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  // sameSite: "lax" as const,
  sameSite: true,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

export const authRouter = {
  getSession: publicProcedure.query(async ({ ctx }) => {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get(COOKIE_NAME);
    const expiresAtCookie = cookieStore.get("expiresAt");
    const createdAtCookie = cookieStore.get("createdAt");
    const sessionIdCookie = cookieStore.get("sessionId");

    // If no valid session cookie, return null session
    if (!userIdCookie?.value) {
      return { session: null };
    }

    if (expiresAtCookie && new Date(expiresAtCookie.value) < new Date()) {
      // Session expired, clear cookies
      cookieStore.set(COOKIE_NAME, "", {
        ...COOKIE_OPTIONS,
        maxAge: 0,
        expires: new Date(0),
      });
      cookieStore.set("expiresAt", "", {
        ...COOKIE_OPTIONS,
        maxAge: 0,
        expires: new Date(0),
      });
      cookieStore.set("createdAt", "", {
        ...COOKIE_OPTIONS,
        maxAge: 0,
        expires: new Date(0),
      });
      cookieStore.set("sessionId", "", {
        ...COOKIE_OPTIONS,
        maxAge: 0,
        expires: new Date(0),
      });

      return { session: null };
    }

    // Construct session object

    const session = userIdCookie
      ? {
          userId: userIdCookie.value,
          // In a real app, you might fetch more session details from database
          createdAt:  createdAtCookie?.value || new Date().toISOString(),
          expiresAt: expiresAtCookie?.value || new Date(new Date().getTime() + COOKIE_OPTIONS.maxAge * 1000).toISOString(),
          sessionId: sessionIdCookie?.value || "unknown",
          userName: cookieStore.get("username")?.value || "unknown",
          email: cookieStore.get("email")?.value || "unknown",
        }
      : null;

    return { session };
  }),

  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    // if (!userIdCookie?.value) {
    //   return { isAuthenticated: false, userId: null };
    // }

    // In a real app, you might fetch user details from database
    return {
      isAuthenticated: true,
      userId: "",
      // userId: userIdCookie.value,
      // user: await getUserById(userIdCookie.value) // Fetch full user data
    };
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),

  login: publicProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    try {
      const userId = "user-" + Math.floor(Math.random() * 1000);

      ctx.headers.set("x-user-id", userId);
      // For demo purposes, let's simulate user validation
      const isValidUser = await validateUser(userId);
      if (!isValidUser) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid user credentials",
        });
      }
      const userName = input.email.split("@")[0] || "unknown";
      const expiresAt = new Date(
        Date.now() + COOKIE_OPTIONS.maxAge * 1000
      ).toISOString();
      const createdAt = new Date().toISOString();
      const sessionId = "sess-" + Math.floor(Math.random() * 10000);


      // Set the authentication cookie
      const cookieStore = await cookies();
      cookieStore.set("some-random-cookie", "some-random-value",);
      cookieStore.set(COOKIE_NAME, userId, COOKIE_OPTIONS);
      cookieStore.set("email", input.email, COOKIE_OPTIONS);
      cookieStore.set("username", userName, COOKIE_OPTIONS);
      cookieStore.set("expiresAt", expiresAt, COOKIE_OPTIONS);
      cookieStore.set("createdAt", createdAt, COOKIE_OPTIONS);
      cookieStore.set("sessionId", sessionId, COOKIE_OPTIONS);

      return {
        success: true,
        message: "Logged in successfully",
        email: input.email,
        userId: userId,
        expiresAt: expiresAt,
        createdAt: createdAt,
        sessionId: sessionId,
        userName: userName,
      };
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Login failed. Please try again.",
      });
    }
  }),

logout: publicProcedure.mutation(async () => {
  const cookieStore = await cookies();

  // Clear cookies regardless of whether they exist
  for (const name of [
    COOKIE_NAME,
    "expiresAt",
    "createdAt",
    "sessionId",
    "email",
    "username",
  ]) {
    cookieStore.set(name, "", {
      ...COOKIE_OPTIONS,
      maxAge: 0,
      expires: new Date(0),
    });
  }

  return {
    success: true,
    message: "Logged out (or already logged out)",
  };
}),


  // Additional utility procedure
  refreshSession: publicProcedure.mutation(async ({ ctx }) => {
    // const cookieStore = await cookies();
    // const userIdCookie = cookieStore.get(COOKIE_NAME);

    // if (!userIdCookie?.value) {
    //   throw new TRPCError({
    //     code: "UNAUTHORIZED",
    //     message: "No active session to refresh",
    //   });
    // }

    // Refresh the cookie with new expiry
    // cookieStore.set(COOKIE_NAME, userIdCookie.value, COOKIE_OPTIONS);

    return {
      success: true,
      message: "Session refreshed successfully",
      userId: "unknown",
      // userId: userIdCookie.value,
      expiresAt: new Date(
        Date.now() + COOKIE_OPTIONS.maxAge * 1000
      ).toISOString(),
    };
  }),
} satisfies TRPCRouterRecord;

// Helper function to validate user (replace with your actual validation logic)
async function validateUser(userId: string): Promise<boolean> {
  // In a real application, you would:
  // 1. Check if user exists in database
  // 2. Verify user is active/not banned
  // 3. Any other business logic validation

  // For demo purposes, accept any non-empty userId
  return userId.length > 0;

  // Real implementation might look like:
  // const user = await db.user.findUnique({ where: { id: userId } });
  // return user && user.isActive;
}
