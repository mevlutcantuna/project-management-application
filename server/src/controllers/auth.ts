import { Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth";
import { db } from "../config/dbClient";
import { ValidationError, UnauthorizedError } from "../utils/errors";
import { AuthService } from "@/services/auth";
import { LoginRequest, RefreshTokenRequest, SignupRequest } from "@/types/auth";

const authService = new AuthService(db);

export const signup = async (req: SignupRequest, res: Response) => {
  const validatedData = signupSchema.safeParse(req.body);
  if (!validatedData.success) throw new ValidationError(validatedData.error);

  const { fullName, email, password } = validatedData.data;

  const user = await authService.signup({
    fullName,
    email,
    password,
  });

  res.status(201).json(user);
};

export const login = async (req: LoginRequest, res: Response) => {
  const validatedData = loginSchema.safeParse(req.body);
  if (!validatedData.success) throw new ValidationError(validatedData.error);

  const { email, password } = validatedData.data;
  const result = await authService.login(email, password);
  if (!result) throw new UnauthorizedError("Invalid email or password");

  res.status(200).json(result);
};

export const refreshToken = async (req: RefreshTokenRequest, res: Response) => {
  const { token } = req.body;
  if (!token) throw new UnauthorizedError("No refresh token provided");

  const result = await authService.refreshAccessToken(token);

  res.status(200).json({
    ...result,
    tokenType: "Bearer",
  });
};
