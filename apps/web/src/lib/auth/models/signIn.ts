import * as z from "zod";

export const inputSignInSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const outputSignInSchema = z.object({
  token: z.string(),
});

export type InputSignIn = z.infer<typeof inputSignInSchema>;
export type OutputSignIn = z.infer<typeof outputSignInSchema>;
