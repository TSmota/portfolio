import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

config({ path: ".env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? {
    ca: process.env.AIVEN_CA_CERT,
    rejectUnauthorized: true,
  } : false,
});

export const db = drizzle(pool);
