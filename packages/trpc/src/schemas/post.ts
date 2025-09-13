import { z } from 'zod';


export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  published: z.boolean().optional(),
});

export const updatePostSchema = z.object({
  id: z.string().uuid("Invalid post ID"),
  title: z.string().optional(),
  content: z.string().optional(),
  published: z.boolean().optional(),
});

export const getPostSchema = z.object({
  id: z.string().uuid("Invalid post ID"),
});

export const deletePostSchema = z.object({
  id: z.string().uuid("Invalid post ID"),
});

export type CreatePostSchema = z.infer<typeof createPostSchema>;
export type UpdatePostSchema = z.infer<typeof updatePostSchema>;
export type GetPostPostSchema = z.infer<typeof getPostSchema>;
export type DeletePostSchema = z.infer<typeof deletePostSchema>;