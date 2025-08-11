import bcrypt from "bcrypt";
import Database from "../config/db";

export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  workspace_ids: string[];
}

export interface UserWithPassword extends User {
  password_hash: string;
}

export interface CreateUserInput {
  full_name: string;
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserInput {
  full_name?: string;
  username?: string;
  email?: string;
  workspace_ids?: string[];
}

export class UserService {
  constructor(private db: Database) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    const query = `
      INSERT INTO users (full_name, username, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, username, email, workspace_ids, created_at, updated_at
    `;

    const values = [input.full_name, input.username, input.email, passwordHash];

    const result = await this.db.query(query, values);
    return result.rows[0] as User;
  }

  async getAllUsers(): Promise<User[]> {
    const query =
      "SELECT id, full_name, username, email, created_at, updated_at, workspace_ids FROM users";
    const result = await this.db.query(query);
    return result.rows as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const query =
      "SELECT id, full_name, username, email, workspace_ids, created_at, updated_at FROM users WHERE id = $1";
    const result = await this.db.query(query, [id]);
    return (result.rows[0] as User) || null;
  }

  async getUserByEmail(email: string): Promise<UserWithPassword | null> {
    const query =
      "SELECT id, full_name, username, password_hash, email, workspace_ids, created_at, updated_at FROM users WHERE email = $1";
    const result = await this.db.query(query, [email]);

    return (result.rows[0] as UserWithPassword) || null;
  }

  async deleteUser(id: string): Promise<void> {
    const query = "DELETE FROM users WHERE id = $1";
    await this.db.query(query, [id]);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const query = `UPDATE users
                   SET full_name = $1, username = $2, email = $3, workspace_ids = $4
                   WHERE id = $5
                   RETURNING id, full_name, username, email, workspace_ids, created_at, updated_at`;

    const values = [
      input.full_name ?? null,
      input.username ?? null,
      input.email ?? null,
      input.workspace_ids ?? [],
      id,
    ];
    const result = await this.db.query(query, values);
    return result.rows[0] as User;
  }

  async checkUserExists(
    email: string,
    username: string
  ): Promise<{
    emailExists: boolean;
    usernameExists: boolean;
  }> {
    const query = `
      SELECT 
        COUNT(CASE WHEN email = $1 THEN 1 END) as email_count,
        COUNT(CASE WHEN username = $2 THEN 1 END) as username_count
      FROM users 
      WHERE email = $1 OR username = $2
    `;

    const result = await this.db.query(query, [email, username]);
    const row = result.rows[0];

    return {
      emailExists: parseInt(row.email_count) > 0,
      usernameExists: parseInt(row.username_count) > 0,
    };
  }
}
