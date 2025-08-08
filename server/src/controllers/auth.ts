import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth";
import { UserService } from "../services/user";
import { db } from "../config/dbClient";
import {
  sendConflictError,
  sendInternalError,
  sendNotFoundError,
  sendUnauthorizedError,
  sendZodError,
} from "../utils/errors";
import {
  extractTokenFromHeader,
  generateToken,
  verifyToken,
} from "@/utils/jwt";

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

const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.safeParse(req.body);

    if (!validatedData.success) {
      return sendZodError(res, validatedData.error);
    }

    const { email, password } = validatedData.data;

    const user = await userService.verifyPassword(email, password);

    if (!user) {
      return sendUnauthorizedError(res, "Invalid email or password");
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    sendInternalError(res, "An error occurred while logging in");
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const token = extractTokenFromHeader(req.headers.authorization);

  if (!token) {
    return sendUnauthorizedError(res, "Unauthorized");
  }

  const user = await userService.findById(verifyToken(token)?.id || "");

  if (!user) {
    return sendNotFoundError(res, "User not found");
  }

  const newToken = generateToken({
    id: user.id,
    email: user.email,
    username: user.username,
  });

  res.status(200).json({
    message: "Token refreshed",
    token: newToken,
  });
};

export { signup, login, refreshToken };
