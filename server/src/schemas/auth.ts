import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(255, "Full name must be less than 255 characters")
    .trim(),

  email: z
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z
    .email("Invalid email format")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be less than 128 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;
