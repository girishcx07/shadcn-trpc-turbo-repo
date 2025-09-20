import z from "zod";

export const TodoSchema = z.object({
  id: z.number(),
  title: z.string(),
  body: z.string(),
  userId: z.number()
});

export type TodoSchemaType = z.infer<typeof TodoSchema>;
