import Database from "@/config/db";
import { UserService } from "./user";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "@/utils/jwt";
import { ConflictError, UnauthorizedError } from "@/utils/errors";
import { LoginResponse, RefreshTokenResponse } from "@/types/auth";
import { CreateUserInput, User } from "@/types/user";

export class AuthService {
  private userService: UserService;

  constructor(private db: Database) {
    this.userService = new UserService(db);
  }

  async login(email: string, password: string): Promise<LoginResponse | null> {
    const user = await this.verifyPassword(email, password);

    if (!user) {
      return null;
    }

    const tokenPayload = {
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 6 * 60 * 60, // 6 hours in seconds
    };

    const accessToken = generateToken(tokenPayload, 6 * 60 * 60); // 6 hours in seconds
    const refreshToken = generateToken(tokenPayload, 7 * 24 * 60 * 60); // 7 days in seconds

    const now = Math.floor(Date.now() / 1000);

    return {
      accessToken,
      refreshToken,
      expiresIn: now + 6 * 60 * 60, // 6 hours in seconds
      tokenType: "Bearer",
      user,
    };
  }

  async signup(input: CreateUserInput): Promise<Omit<User, "passwordHash">> {
    const existingUser = await this.userService.checkUserExists(input.email);

    if (existingUser) throw new ConflictError("email", "Email already exists");

    return await this.userService.createUser(input);
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<RefreshTokenResponse> {
    // Verify refresh token
    const payload = verifyToken(refreshToken);
    if (!payload) throw new UnauthorizedError("Invalid refresh token");

    // Verify user still exists
    const user = await this.userService.getUserById(payload.sub);
    if (!user) throw new UnauthorizedError("User not found");

    const tokenPayload = {
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 6 * 60 * 60, // 6 hours in seconds
    };

    const newAccessToken = generateToken(tokenPayload, 6 * 60 * 60); // 6 hours in seconds
    const newRefreshToken = generateToken(tokenPayload, 7 * 24 * 60 * 60); // 7 days in seconds

    const now = Math.floor(Date.now() / 1000);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: now + 6 * 60 * 60, // 6 hours in seconds,
    };
  }

  async verifyPassword(
    email: string,
    password: string
  ): Promise<Omit<User, "passwordHash"> | null> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  async getMe(id: string): Promise<Omit<User, "passwordHash"> | null> {
    const user = await this.userService.getUserById(id);
    if (!user) return null;

    return user;
  }
}
