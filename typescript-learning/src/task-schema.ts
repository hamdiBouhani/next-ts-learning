import { z } from "zod";

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1)
    .max(200),

  description: z
    .string()
    .max(2000)
    .optional(),

  priority: z.enum([
    "low",
    "medium",
    "high",
  ]),

  completed: z
    .boolean()
    .default(false),
});

export type CreateTask = z.infer<typeof createTaskSchema>;