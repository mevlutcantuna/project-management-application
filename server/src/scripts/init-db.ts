import { readFileSync } from "fs";
import { join } from "path";
import { db } from "../config/dbClient";

const SCHEMA_FILES = [
  "01-types.sql",
  "02-tables.sql",
  "03-indexes.sql",
  "04-functions.sql",
  "05-triggers.sql",
  "06-views.sql",
];

async function executeFile(filename: string): Promise<void> {
  const filePath = join(process.cwd(), "src", "db", filename);
  const sql = readFileSync(filePath, "utf8");

  console.log(`Running ${filename}...`);
  await db.query(sql);
  console.log(`✓ ${filename} completed`);
}

async function showTables(): Promise<void> {
  const result = await db.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name
  `);

  console.log(`\nCreated ${result.rows.length} tables:`);
  result.rows.forEach((row: { table_name: string }) => {
    console.log(`  • ${row.table_name}`);
  });
}

async function initDatabase(): Promise<void> {
  try {
    console.log("🚀 Initializing database...\n");

    for (const file of SCHEMA_FILES) {
      await executeFile(file);
    }

    await showTables();
    console.log("\n🎉 Database initialized successfully!");
  } catch (error) {
    console.error("\n❌ Database initialization failed:", error);
    process.exit(1);
  } finally {
    await db.close();
  }
}

initDatabase();
