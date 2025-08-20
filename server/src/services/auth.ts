import Database from "@/config/db";
import { CreateUserInput, User, UserService, UserWithPassword } from "./user";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "@/utils/jwt";
import { ConflictError, UnauthorizedError } from "@/utils/errors";

export class AuthService {
  private userService: UserService;

  constructor(private db: Database) {
    this.userService = new UserService(db);
  }

  async login(
    email: string,
    password: string
  ): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: string;
  } | null> {
    const user = await this.verifyPassword(email, password);

    if (!user) {
      return null;
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    };

    const accessToken = generateToken(tokenPayload, "access");
    const refreshToken = generateToken(tokenPayload, "refresh");

    return {
      accessToken,
      refreshToken,
      expiresIn: 6 * 60 * 60, // 6 hours in seconds
      tokenType: "Bearer",
    };
  }

  async signup(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userService.checkUserExists(input.email);

    if (existingUser.emailExists)
      throw new ConflictError("email", "Email already registered");

    return await this.userService.createUser(input);
  }

  async refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  }> {
    // Verify refresh token
    const payload = verifyToken(refreshToken, "refresh");
    if (!payload) throw new UnauthorizedError("Invalid refresh token");

    // Verify user still exists
    const user = await this.userService.getUserById(payload.id);
    if (!user) throw new UnauthorizedError("User not found");

    const tokenPayload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
    };

    const newAccessToken = generateToken(tokenPayload, "access");
    const newRefreshToken = generateToken(tokenPayload, "refresh");

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 6 * 60 * 60, // 6 hours in seconds
    };
  }

  async verifyPassword(
    email: string,
    password: string
  ): Promise<UserWithPassword | null> {
    const user = await this.userService.getUserByEmail(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }
}
