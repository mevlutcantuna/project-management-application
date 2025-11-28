import { Request, Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth";
import { ValidationError, UnauthorizedError } from "../utils/errors";
import { AuthService } from "@/services/auth";
import { LoginRequest, RefreshTokenRequest, SignupRequest } from "@/types/auth";
import z from "zod";

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  private async validateRequest<T>(
    schema: z.ZodSchema<T>,
    data: T
  ): Promise<T> {
    const validatedData = schema.safeParse(data);
    if (!validatedData.success) throw new ValidationError(validatedData.error);
    return validatedData.data;
  }

  signup = async (req: SignupRequest, res: Response) => {
    const validatedData = await this.validateRequest(signupSchema, req.body);
    const user = await this.authService.signup(validatedData);
    res.status(201).json(user);
  };

  login = async (req: LoginRequest, res: Response) => {
    const validatedData = await this.validateRequest(loginSchema, req.body);
    const result = await this.authService.login(
      validatedData.email,
      validatedData.password
    );

    if (!result) throw new UnauthorizedError("Invalid email or password");
    res.status(200).json(result);
  };

  refreshToken = async (req: RefreshTokenRequest, res: Response) => {
    const { token } = req.body;
    if (!token) throw new UnauthorizedError("No refresh token provided");

    const result = await this.authService.refreshAccessToken(token);

    res.status(200).json({
      ...result,
      tokenType: "Bearer",
    });
  };

  getMe = async (req: Request, res: Response) => {
    if (!req.user) throw new UnauthorizedError("User not found");

    const userData = await this.authService.getMe(req.user.id);
    if (!userData) throw new UnauthorizedError("User not found");

    res.status(200).json(userData);
  };
}

export default AuthController;
