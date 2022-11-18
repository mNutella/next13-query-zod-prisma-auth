import * as z from "zod";

import { outputUserSchema } from "@lib/users/models/user";

export const outputPostSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  author: outputUserSchema,
  published: z.boolean(),
  createAt: z.date(),
});

export type OutputPost = z.infer<typeof outputPostSchema>;
