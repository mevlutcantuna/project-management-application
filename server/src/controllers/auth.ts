import { Response } from "express";
import { loginSchema, signupSchema } from "../schemas/auth";
import { ValidationError, UnauthorizedError } from "../utils/errors";
import { AuthService } from "@/services/auth";
import { LoginRequest, RefreshTokenRequest, SignupRequest } from "@/types/auth";

class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  async signup(req: SignupRequest, res: Response) {
    const validatedData = signupSchema.safeParse(req.body);
    if (!validatedData.success) throw new ValidationError(validatedData.error);

    const { fullName, email, password } = validatedData.data;

    const user = await this.authService.signup({
      fullName,
      email,
      password,
    });

    res.status(201).json(user);
  }

  async login(req: LoginRequest, res: Response) {
    const validatedData = loginSchema.safeParse(req.body);
    if (!validatedData.success) throw new ValidationError(validatedData.error);

    const { email, password } = validatedData.data;
    const result = await this.authService.login(email, password);
    if (!result) throw new UnauthorizedError("Invalid email or password");

    res.status(200).json(result);
  }

  async refreshToken(req: RefreshTokenRequest, res: Response) {
    const { token } = req.body;
    if (!token) throw new UnauthorizedError("No refresh token provided");

    const result = await this.authService.refreshAccessToken(token);

    res.status(200).json({
      ...result,
      tokenType: "Bearer",
    });
  }
}

export default AuthController;
