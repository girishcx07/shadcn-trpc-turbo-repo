import * as z from "zod";

export const NewUserSchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});


export type NewUser= z.infer<typeof NewUserSchema>;
export type User = z.infer<typeof UserSchema>;