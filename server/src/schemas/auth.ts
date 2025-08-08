import { z } from "zod";

export const signupSchema = z.object({
  full_name: z
    .string()
    .min(1, "Full name is required")
    .max(255, "Full name must be less than 255 characters")
    .trim(),

  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must be less than 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .toLowerCase(),

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
