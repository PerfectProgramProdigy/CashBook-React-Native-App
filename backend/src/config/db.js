import { neon } from "@neondatabase/serverless";
import "dotenv/config";

export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions (
              id SERIAL PRIMARY KEY,
              userid VARCHAR(255) NOT NULL,
              title VARCHAR(255) NOT NULL,
              amount DECIMAL(10, 2) NOT NULL,
              type VARCHAR(50) NOT NULL,
              createdate DATE NOT NULL DEFAULT CURRENT_DATE
          )`;
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}
