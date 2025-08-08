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

export interface CreateUserInput {
  full_name: string;
  username: string;
  email: string;
  password: string;
}

export class UserService {
  constructor(private db: Database) {}

  async createUser(input: CreateUserInput): Promise<User> {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);

    const query = `
      INSERT INTO users (full_name, username, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING full_name, username, email, created_at, updated_at
    `;

    const values = [input.full_name, input.username, input.email, passwordHash];

    const result = await this.db.query(query, values);
    return result.rows[0] as User;
  }

  async findByEmail(email: string): Promise<User | null> {
    const query =
      "SELECT id, full_name, username, email, created_at, updated_at FROM users WHERE email = $1";
    const result = await this.db.query(query, [email]);
    return (result.rows[0] as User) || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const query =
      "SELECT id, full_name, username, email, created_at, updated_at FROM users WHERE username = $1";
    const result = await this.db.query(query, [username]);
    return (result.rows[0] as User) || null;
  }

  async findById(id: string): Promise<User | null> {
    const query =
      "SELECT id, full_name, username, email, created_at, updated_at FROM users WHERE id = $1";
    const result = await this.db.query(query, [id]);
    return (result.rows[0] as User) || null;
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

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const query =
      "SELECT id, full_name, username, email, password_hash, created_at, updated_at FROM users WHERE email = $1";
    const result = await this.db.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return null;
    }

    // Return user without password hash
    const { password_hash, ...userWithoutPassword } = user;
    return userWithoutPassword as User;
  }
}
