import bcrypt from "bcrypt";
import Database from "../config/db";
import camelcaseKeys from "camelcase-keys";

export interface User {
  id: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  passwordHash: string;
  profilePicture: string;
}

export interface CreateUserInput extends Record<string, unknown> {
  fullName: string;
  email: string;
  password: string;
}

export interface UpdateUserInput extends Record<string, unknown> {
  fullName?: string;
  email?: string;
}

export class UserService {
  constructor(private db: Database) {}

  async createUser(
    input: CreateUserInput
  ): Promise<Omit<User, "passwordHash">> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    const query = `
      INSERT INTO users (full_name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, full_name, email, profile_picture, created_at, updated_at
    `;

    const values = [input.fullName, input.email, passwordHash];

    const result = await this.db.query(query, values);
    return camelcaseKeys(result.rows[0]);
  }

  async getAllUsers(): Promise<Omit<User, "passwordHash">[]> {
    const query =
      "SELECT id, full_name, email, profile_picture, created_at, updated_at FROM users";
    const result = await this.db.query(query);
    return camelcaseKeys(result.rows);
  }

  async getUserById(id: string): Promise<Omit<User, "passwordHash"> | null> {
    const query =
      "SELECT id, full_name, email, profile_picture, created_at, updated_at FROM users WHERE id = $1";
    const result = await this.db.query(query, [id]);
    return result.rows[0] ? camelcaseKeys(result.rows[0]) : null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const query =
      "SELECT id, full_name, email, profile_picture, created_at, updated_at, password_hash FROM users WHERE email = $1";
    const result = await this.db.query(query, [email]);

    return result.rows[0] ? camelcaseKeys(result.rows[0]) : null;
  }

  async deleteUser(id: string): Promise<void> {
    const query = "DELETE FROM users WHERE id = $1";
    await this.db.query(query, [id]);
  }

  async updateUser(
    id: string,
    input: UpdateUserInput
  ): Promise<Omit<User, "passwordHash">> {
    const query = `UPDATE users
                   SET full_name = $1, email = $2
                   WHERE id = $3
                   RETURNING id, full_name, email, profile_picture, created_at, updated_at`;

    const values = [input.fullName ?? null, input.email ?? null, id];
    const result = await this.db.query(query, values);
    return camelcaseKeys(result.rows[0]);
  }

  async checkUserExists(email: string): Promise<{
    emailExists: boolean;
  }> {
    const query = `
      SELECT 
        COUNT(CASE WHEN email = $1 THEN 1 END) as email_count
      FROM users 
      WHERE email = $1
    `;

    const result = await this.db.query(query, [email]);
    const row = camelcaseKeys(result.rows[0]);

    return {
      emailExists: parseInt(row.emailCount) > 0,
    };
  }
}
