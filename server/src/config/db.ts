import { Pool, PoolClient, PoolConfig, QueryResult } from "pg";

class Database {
  private pool: Pool;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config);

    this.pool.on("error", (err) => {
      console.error("Database pool error:", err);
    });
  }

  async query(text: string, params?: unknown[]): Promise<QueryResult> {
    const start = Date.now();
    try {
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;

      console.log("Query executed:", {
        text,
        duration,
        rows: result.rowCount,
      });

      return result;
    } catch (error) {
      console.error("Database query error:", { text, params, error });
      throw error;
    }
  }

  async getClient(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async transaction<T>(
    callback: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.getClient();
    try {
      await client.query("BEGIN");

      const result = await callback(client);

      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.query("SELECT 1");
      return true;
    } catch (error) {
      console.error("Database health check failed:", error);
      return false;
    }
  }

  async close(): Promise<void> {
    await this.pool.end();
  }
}

export default Database;

/**
 * Common PostgreSQL Query Examples:
 *
 * 1. SELECT with parameters:
 *    const users = await db.query("SELECT * FROM users WHERE age > $1", [18]);
 *
 * 2. INSERT with returning ID:
 *    const result = await db.query(
 *      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id",
 *      ["John", "john@example.com"]
 *    );
 *    const newUserId = result.rows[0].id;
 *
 * 3. UPDATE with conditions:
 *    await db.query(
 *      "UPDATE users SET last_login = NOW() WHERE id = $1",
 *      [userId]
 *    );
 *
 * 4. DELETE with conditions:
 *    await db.query("DELETE FROM users WHERE id = $1", [userId]);
 *
 * 5. Complex JOIN query:
 *    const data = await db.query(`
 *      SELECT u.name, p.bio
 *      FROM users u
 *      JOIN profiles p ON u.id = p.user_id
 *      WHERE u.active = $1
 *    `, [true]);
 *
 * 6. Transaction example:
 *    await db.transaction(async (client) => {
 *      const user = await client.query(
 *        "INSERT INTO users (name) VALUES ($1) RETURNING id",
 *        ["Alice"]
 *      );
 *      await client.query(
 *        "INSERT INTO user_settings (user_id, theme) VALUES ($1, $2)",
 *        [user.rows[0].id, "dark"]
 *      );
 *    });
 */
