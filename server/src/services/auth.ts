import Database from "@/config/db";
import { CreateUserInput, User, UserService } from "./user";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "@/utils/jwt";
import { ConflictError, UnauthorizedError } from "@/utils/errors";
import { LoginResponse } from "@/types/auth";

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
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    const accessToken = generateToken(tokenPayload, 6 * 60 * 60); // 6 hours in seconds
    const refreshToken = generateToken(tokenPayload, 7 * 24 * 60 * 60); // 7 days in seconds

    return {
      accessToken,
      refreshToken,
      expiresIn: 6 * 60 * 60, // 6 hours in seconds
      tokenType: "Bearer",
    };
  }

  async signup(input: CreateUserInput): Promise<Omit<User, "passwordHash">> {
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
    const payload = verifyToken(refreshToken);
    if (!payload) throw new UnauthorizedError("Invalid refresh token");

    // Verify user still exists
    const user = await this.userService.getUserById(payload.id);
    if (!user) throw new UnauthorizedError("User not found");

    const tokenPayload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };

    const newAccessToken = generateToken(tokenPayload, 6 * 60 * 60); // 6 hours in seconds
    const newRefreshToken = generateToken(tokenPayload, 7 * 24 * 60 * 60); // 7 days in seconds

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 6 * 60 * 60, // 6 hours in seconds
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
}
