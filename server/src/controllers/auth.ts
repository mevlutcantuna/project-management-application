import { Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth";
import { ValidationError, UnauthorizedError } from "../utils/errors";
import { AuthService } from "@/services/auth";
import {
  GetMeRequest,
  LoginRequest,
  RefreshTokenRequest,
  SignupRequest,
} from "@/types/auth";

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  signup = async (req: SignupRequest, res: Response) => {
    const validatedData = signupSchema.safeParse(req.body);
    if (!validatedData.success) throw new ValidationError(validatedData.error);

    const { firstName, lastName, email, password } = validatedData.data;

    const user = await this.authService.signup({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json(user);
  };

  login = async (req: LoginRequest, res: Response) => {
    const validatedData = loginSchema.safeParse(req.body);
    if (!validatedData.success) throw new ValidationError(validatedData.error);

    const { email, password } = validatedData.data;
    const result = await this.authService.login(email, password);
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

  getMe = async (req: GetMeRequest, res: Response) => {
    const user = req.user;

    if (!user) throw new UnauthorizedError("User not found");

    const userData = await this.authService.getMe(user.id);
    if (!userData) throw new UnauthorizedError("User not found");

    res.status(200).json(userData);
  };
}

export default AuthController;
