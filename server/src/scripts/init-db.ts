import { readFileSync } from "fs";
import { join } from "path";
import { db } from "../config/dbClient";

async function initDatabase() {
  try {
    console.log("Initializing database...");

    // Read and execute schema
    const schemaPath = join(process.cwd(), "src", "db", "schema.sql");
    const schema = readFileSync(schemaPath, "utf8");

    await db.query(schema);

    console.log("Database initialized successfully!");
    console.log("Tables created:");
    console.log("- users");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

initDatabase();
