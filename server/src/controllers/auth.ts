import { Request, Response } from "express";
import { signupSchema } from "../schemas/auth";
import { UserService } from "../services/user";
import { db } from "../config/dbClient";
import {
  sendConflictError,
  sendInternalError,
  sendZodError,
} from "../utils/errors";

const userService = new UserService(db);

const signup = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = signupSchema.safeParse(req.body);

    if (!validatedData.success) {
      return sendZodError(res, validatedData.error);
    }

    const { full_name, username, email, password } = validatedData.data;

    // Check if user already exists
    const existingUser = await userService.checkUserExists(email, username);

    if (existingUser.emailExists) {
      return sendConflictError(res, "email", "Email already registered");
    }

    if (existingUser.usernameExists) {
      return sendConflictError(res, "username", "Username already taken");
    }

    // Create user
    const user = await userService.createUser({
      full_name,
      username,
      email,
      password,
    });

    // Return success response
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    sendInternalError(res, "An error occurred while creating your account");
  }
};

export { signup };
