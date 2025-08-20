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

  const { full_name, email, password } = validatedData.data;

  const user = await authService.signup({
    full_name,
    email,
    password,
  });

  res.status(201).json({
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: user.created_at,
  });
};

export const login = async (req: Request, res: Response) => {
  const validatedData = loginSchema.safeParse(req.body);
  if (!validatedData.success) throw new ValidationError(validatedData.error);

  const { email, password } = validatedData.data;
  const result = await authService.login(email, password);
  if (!result) throw new UnauthorizedError("Invalid email or password");

  res.status(200).json({
    access_token: result.accessToken,
    refresh_token: result.refreshToken,
    expires_in: result.expiresIn,
    token_type: result.tokenType,
  });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refresh_token = extractTokenFromHeader(req.headers.authorization);
  if (!refresh_token) throw new UnauthorizedError("No refresh token provided");

  const result = await authService.refreshAccessToken(refresh_token);

  res.status(200).json({
    access_token: result.accessToken,
    refresh_token: result.refreshToken,
    expires_in: result.expiresIn,
    token_type: "Bearer",
  });
};
