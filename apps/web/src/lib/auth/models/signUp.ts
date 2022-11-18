import * as z from "zod";

export const inputSignUpSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const outputSignUpSchema = z.object({
  token: z.string(),
});

export type InputSignUp = z.infer<typeof inputSignUpSchema>;
export type OutputSignUp = z.infer<typeof outputSignUpSchema>;
