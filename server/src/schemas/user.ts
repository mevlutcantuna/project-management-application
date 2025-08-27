import { z } from "zod";

export const updateUserSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(255, "Full name must be less than 255 characters")
    .trim(),

  email: z
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),

  profilePicture: z.string().optional(),
});
