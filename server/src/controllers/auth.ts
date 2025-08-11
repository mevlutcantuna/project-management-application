import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth";
import { db } from "../config/dbClient";
import { ValidationError, UnauthorizedError } from "../utils/errors";
import { extractTokenFromHeader } from "@/utils/jwt";
import { AuthService } from "@/services/auth";

const authService = new AuthService(db);

const signup = async (req: Request, res: Response) => {
  const validatedData = signupSchema.safeParse(req.body);
  if (!validatedData.success) throw new ValidationError(validatedData.error);

  const { full_name, username, email, password } = validatedData.data;

  const user = await authService.signup({
    full_name,
    username,
    email,
    password,
  });

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
};

const login = async (req: Request, res: Response) => {
  const validatedData = loginSchema.safeParse(req.body);
  if (!validatedData.success) throw new ValidationError(validatedData.error);

  const { email, password } = validatedData.data;
  const result = await authService.login(email, password);
  if (!result) throw new UnauthorizedError("Invalid email or password");

  res.status(200).json({ message: "Login successful", token: result.token });
};

const refreshToken = async (req: Request, res: Response) => {
  const token = extractTokenFromHeader(req.headers.authorization);
  if (!token) throw new UnauthorizedError();
  const newToken = await authService.refreshToken(token);
  res.status(200).json({ message: "Token refreshed", token: newToken });
};

export { signup, login, refreshToken };
