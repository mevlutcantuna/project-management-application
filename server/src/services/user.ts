import bcrypt from "bcrypt";
import Database from "../config/db";
import { CreateUserInput, UpdateUserInput, User } from "@/types/user";
import UserRepository from "@/repositories/user";

export class UserService {
  private userRepository: UserRepository;

  constructor(private db: Database) {
    this.userRepository = new UserRepository(db);
  }

  async createUser(
    input: CreateUserInput
  ): Promise<Omit<User, "passwordHash">> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    return this.userRepository.createUser({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      passwordHash: passwordHash,
      profilePicture: input.profilePicture ?? null,
    });
  }

  async getAllUsers(): Promise<Omit<User, "passwordHash">[]> {
    return this.userRepository.getAllUsers();
  }

  async getUserById(id: string): Promise<Omit<User, "passwordHash"> | null> {
    return this.userRepository.getUserById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.getUserByEmail(email);
  }

  async deleteUser(id: string): Promise<void> {
    return this.userRepository.deleteUser(id);
  }

  async updateUser(
    id: string,
    input: UpdateUserInput
  ): Promise<Omit<User, "passwordHash">> {
    return this.userRepository.updateUser(id, {
      firstName: input.firstName ?? undefined,
      lastName: input.lastName ?? undefined,
      email: input.email ?? undefined,
      profilePicture: input.profilePicture ?? undefined,
    });
  }

  async checkUserExists(email: string): Promise<boolean> {
    return this.userRepository.checkUserExists(email);
  }
}
