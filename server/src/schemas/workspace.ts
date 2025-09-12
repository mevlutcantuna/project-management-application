import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string({ message: "Name is required" }),
  description: z.string().optional(),
  url: z.string({ message: "URL is required" }),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});
