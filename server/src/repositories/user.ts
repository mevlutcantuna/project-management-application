import Database from "@/config/db";
import { User } from "@/types/user";

class UserRepository {
  constructor(private db: Database) {}

  async createUser(
    user: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const query = `
      INSERT INTO users (full_name, email, password_hash, profile_picture)
      VALUES ($1, $2, $3, $4)
      RETURNING id, full_name, email, profile_picture, created_at, updated_at
    `;

    const values = [
      user.fullName,
      user.email,
      user.passwordHash,
      user.profilePicture ?? null,
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async getUserById(id: string): Promise<User | null> {
    const query = `
      SELECT id, full_name, email, profile_picture, created_at, updated_at, password_hash
      FROM users
      WHERE id = $1
    `;

    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const query = `
      SELECT id, full_name, email, profile_picture, created_at, updated_at, password_hash
      FROM users
      WHERE email = $1
    `;

    const result = await this.db.query(query, [email]);
    return result.rows[0] || null;
  }

  async getAllUsers(): Promise<User[]> {
    const query = `
      SELECT id, full_name, email, profile_picture, created_at, updated_at
      FROM users
    `;

    const result = await this.db.query(query);
    return result.rows;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const query = `
      UPDATE users
      SET full_name = $1, email = $2, profile_picture = $3
      WHERE id = $4
      RETURNING id, full_name, email, profile_picture, created_at, updated_at
    `;

    const values = [
      updates.fullName,
      updates.email,
      updates.profilePicture,
      id,
    ];

    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async deleteUser(id: string): Promise<void> {
    const query = `DELETE FROM users WHERE id = $1`;
    await this.db.query(query, [id]);
  }

  async checkUserExists(email: string): Promise<boolean> {
    const query = `SELECT COUNT(*) as count FROM users WHERE email = $1`;
    const result = await this.db.query(query, [email]);
    return parseInt(result.rows[0].count) > 0;
  }
}

export default UserRepository;
