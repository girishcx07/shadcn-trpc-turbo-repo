import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { z } from "zod/v4";

import { protectedProcedure, publicProcedure } from "../init";

// Cookie configuration
const COOKIE_NAME = "auth-user-id";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),

  getCurrentUser: publicProcedure.query(async ({ ctx }) => {
    
    // if (!userIdCookie?.value) {
    //   return { isAuthenticated: false, userId: null };
    // }

    // In a real app, you might fetch user details from database
    return { 
      isAuthenticated: true, 
      userId: ""
      // userId: userIdCookie.value,
      // user: await getUserById(userIdCookie.value) // Fetch full user data
    };
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),

  login: publicProcedure
    .input(
      z.object({ 
        userId: z.string().min(1, "User ID is required"),
        // You can add more fields for real authentication
        // email: z.string().email().optional(),
        // password: z.string().min(6).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Validate user exists (in real app, verify credentials)
        if (!input.userId || input.userId.trim() === "") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid user ID provided",
          });
        }

        // In a real application, you would:
        // 1. Verify username/password or token
        // 2. Check if user exists in database
        // 3. Validate user account status (active, verified, etc.)
        
        // For demo purposes, let's simulate user validation
        const isValidUser = await validateUser(input.userId);
        if (!isValidUser) {
          throw new TRPCError({
            code: "UNAUTHORIZED", 
            message: "Invalid user credentials",
          });
        }

        // Set the authentication cookie
        // const cookieStore = await cookies();
        // cookieStore.set(COOKIE_NAME, input.userId, COOKIE_OPTIONS);

        return { 
          success: true, 
          message: "Logged in successfully",
          userId: input.userId,
          expiresAt: new Date(Date.now() + COOKIE_OPTIONS.maxAge * 1000).toISOString(),
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

  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      // const cookieStore = await cookies();
      // const userIdCookie = cookieStore.get(COOKIE_NAME);
      
      // if (!userIdCookie?.value) {
      //   throw new TRPCError({
      //     code: "UNAUTHORIZED",
      //     message: "No active session found",
      //   });
      // }

      // Store the userId before clearing for response
      // const loggedOutUserId = userIdCookie.value;

      // Clear the authentication cookie
      // cookieStore.set(COOKIE_NAME, "", {
      //   ...COOKIE_OPTIONS,
      //   maxAge: 0, // Immediately expire the cookie
      //   expires: new Date(0), // Set expiry date to past
      // });

      // Alternative way to delete cookie
      // cookieStore.delete(COOKIE_NAME);

      return { 
        success: true, 
        message: "Logged out successfully",
        loggedOutUserId: "unknown",
      };

    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Logout failed. Please try again.",
      });
    }
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
      expiresAt: new Date(Date.now() + COOKIE_OPTIONS.maxAge * 1000).toISOString(),
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