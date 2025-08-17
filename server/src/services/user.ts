import bcrypt from "bcrypt";
import Database from "../config/db";

export interface User {
  id: string;
  full_name: string;
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
  email: string;
  password: string;
}

export interface UpdateUserInput {
  full_name?: string;
  email?: string;
  workspace_ids?: string[];
}

export class UserService {
  constructor(private db: Database) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    const query = `
      INSERT INTO users (full_name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, full_name, email, workspace_ids, created_at, updated_at
    `;

    const values = [input.full_name, input.email, passwordHash];

    const result = await this.db.query(query, values);
    return result.rows[0] as User;
  }

  async getAllUsers(): Promise<User[]> {
    const query =
      "SELECT id, full_name, email, created_at, updated_at, workspace_ids FROM users";
    const result = await this.db.query(query);
    return result.rows as User[];
  }

  async getUserById(id: string): Promise<User | null> {
    const query =
      "SELECT id, full_name, email, workspace_ids, created_at, updated_at FROM users WHERE id = $1";
    const result = await this.db.query(query, [id]);
    return (result.rows[0] as User) || null;
  }

  async getUserByEmail(email: string): Promise<UserWithPassword | null> {
    const query =
      "SELECT id, full_name, password_hash, email, workspace_ids, created_at, updated_at FROM users WHERE email = $1";
    const result = await this.db.query(query, [email]);

    return (result.rows[0] as UserWithPassword) || null;
  }

  async deleteUser(id: string): Promise<void> {
    const query = "DELETE FROM users WHERE id = $1";
    await this.db.query(query, [id]);
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const query = `UPDATE users
                   SET full_name = $1, email = $2, workspace_ids = $3
                   WHERE id = $4
                   RETURNING id, full_name, email, workspace_ids, created_at, updated_at`;

    const values = [
      input.full_name ?? null,
      input.email ?? null,
      input.workspace_ids ?? [],
      id,
    ];
    const result = await this.db.query(query, values);
    return result.rows[0] as User;
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
    const row = result.rows[0];

    return {
      emailExists: parseInt(row.email_count) > 0,
    };
  }
}
