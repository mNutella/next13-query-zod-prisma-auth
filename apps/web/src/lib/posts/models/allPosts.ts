import * as z from "zod";

import { outputPostSchema } from "./post";

export const outputPostsSchema = z.array(outputPostSchema);

export type OutputPosts = z.infer<typeof outputPostsSchema>;
