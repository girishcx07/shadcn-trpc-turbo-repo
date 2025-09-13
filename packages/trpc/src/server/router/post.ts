import { TRPCError, type TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { createPostSchema } from "../../schemas/post";

// import { desc, eq } from "@acme/db";
// import { CreatePostSchema, Post } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../init";

export const postRouter = {
  all: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
        category: z.string().optional(),
      })
    )
    .query(({ ctx }) => {
      const data = Array.from({ length: 10 }).map((_, i) => ({
        id: `post-${i}`,
        title: `Post ${i}`,
        content: `This is the content of post ${i}`,
      }));
      const nextCursor =
        data.length === 10 ? data[data.length - 1]?.id : undefined;

      return {
        posts: data,
        nextCursor,
      };
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      const post = {
        id: input.id,
        title: "Post 1",
        content: "This is the content of post 1",
      };
      if (!post) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return post;
    }),

  create: protectedProcedure
    .input(
      createPostSchema // CreatePostSchema
    )
    .mutation(({ ctx, input }) => {
      const randomId = Math.random().toString(36).substring(2, 15);

      return { id: `post-${randomId}`, ...input };
      // return ctx.db.insert(Post).values(input);
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
