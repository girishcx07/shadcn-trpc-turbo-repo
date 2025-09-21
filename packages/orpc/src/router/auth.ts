import { os } from "@orpc/server";
import { CredentialSchema, TokenSchema } from "../schemas/auth";
import { NewUserSchema, UserSchema } from "../schemas/user";
import { authed, base, users } from "../middlewares/auth";
import * as z from "zod";

export const signup = os
  .route({
    method: "POST",
    path: "/auth/signup",
    summary: "Sign up a new user",
    tags: ["Authentication"],
  })
  .input(NewUserSchema)
  .output(UserSchema)
  .handler(async ({ input, context }) => {
    return {
      id: "28aa6286-48e9-4f23-adea-3486c86acd55",
      email: input.email,
      name: input.name,
    };
  });

export const me = authed
  .route({
    method: "GET",
    path: "/auth/me",
    summary: "Get the current user",
    tags: ["Authentication"],
  })
  .output(
    z.object({
      user: UserSchema,
    })
  ) // <-- return { user: User }
  .handler(async ({ context }) => {
    // context.user comes from authed middleware
    return { user: context.user };
  });

  export const logout = authed
  .route({
    method: "POST",
    path: "/auth/logout",
    summary: "Log out the current user",
    tags: ["Authentication"],
  })
  .output(
    z.object({
      success: z.boolean(),
    })
  )
  .errors({
    UNAUTHORIZED: {
      message: "You were already logged out."
    }, 
    INTERNAL_SERVER_ERROR: {
      message: "Server error. Please try again later."
    },
    BAD_REQUEST: {
      message: "Something went wrong while logging out."
    }
  })
  .handler(async ({ context, errors }) => {

    const session = context.cookies.get("session")?.value
    if(!session){
      errors.UNAUTHORIZED()
    }
    // ✅ Clear cookie
    context.cookies.set("session", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0, // expire immediately
    });


    return { success: true };
  });

export const signin = base
  .route({
    method: "POST",
    path: "/auth/signin",
    summary: "Sign in a user",
    tags: ["Authentication"],
  })
  .input(CredentialSchema)
  .output(TokenSchema)
  .handler(async ({ input, context }) => {
    // 1️⃣ Verify user
    const user = users.find(
      (u) => u.email === input.email && u.password === input.password
    );

    if (!user) {
      throw new Error("Invalid credentials");
    }

    // 2️⃣ Build the session payload (store minimal required info)
    const sessionData = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // 3️⃣ Serialize session to cookie
    context.cookies.set("session", JSON.stringify(sessionData), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // 4️⃣ Return token just for debugging
    return { token: user.id };
  });
