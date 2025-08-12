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

    const tables = await db.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name"
    );

    console.log("Tables in public schema:");
    tables.rows.forEach((r: { table_name: string }) =>
      console.log(`- ${r.table_name}`)
    );
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

initDatabase();
