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
  ): Promise<{ user: User; token: string } | null> {
    const user = await this.verifyPassword(email, password);

    if (!user) {
      return null;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    return { user, token };
  }

  async signup(input: CreateUserInput): Promise<User> {
    const existingUser = await this.userService.checkUserExists(input.email);

    if (existingUser.emailExists)
      throw new ConflictError("email", "Email already registered");

    return await this.userService.createUser(input);
  }

  async refreshToken(oldToken: string): Promise<string> {
    const payload = verifyToken(oldToken);
    if (!payload) throw new UnauthorizedError();

    const user = await this.userService.getUserById(payload.id);
    if (!user) throw new UnauthorizedError();

    return generateToken({
      id: user.id,
      email: user.email,
    });
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
