import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "Full name is required")
    .max(255, "First name must be less than 255 characters")
    .trim(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(255, "Last name must be less than 255 characters")
    .trim(),

  email: z
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),

  profilePicture: z.string().optional(),
});
