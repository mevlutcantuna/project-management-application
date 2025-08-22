import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth";
import { db } from "../config/dbClient";
import { ValidationError, UnauthorizedError } from "../utils/errors";
import { AuthService } from "@/services/auth";
import { extractTokenFromHeader } from "@/utils/jwt";

const authService = new AuthService(db);

export const signup = async (req: Request, res: Response) => {
  const validatedData = signupSchema.safeParse(req.body);
  if (!validatedData.success) throw new ValidationError(validatedData.error);

  const { fullName, email, password } = validatedData.data;

  const user = await authService.signup({
    fullName,
    email,
    password,
  });

  res.status(201).json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
  });
};

export const login = async (req: Request, res: Response) => {
  const validatedData = loginSchema.safeParse(req.body);
  if (!validatedData.success) throw new ValidationError(validatedData.error);

  const { email, password } = validatedData.data;
  const result = await authService.login(email, password);
  if (!result) throw new UnauthorizedError("Invalid email or password");

  res.status(200).json({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
    tokenType: result.tokenType,
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refresh_token = extractTokenFromHeader(req.headers.authorization);
  if (!refresh_token) throw new UnauthorizedError("No refresh token provided");

  const result = await authService.refreshAccessToken(refresh_token);

  res.status(200).json({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    expiresIn: result.expiresIn,
    tokenType: "Bearer",
  });
};
