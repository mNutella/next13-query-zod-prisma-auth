import * as z from "zod";

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  profile: z.null(),
  createdAt: z.date()
});

export const outputUserSchema = userSchema.omit({ password: true });

export type User = z.infer<typeof userSchema>;
export type OutputUser = z.infer<typeof outputUserSchema>;
