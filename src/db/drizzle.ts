import { config } from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

config({ path: ".env" });

const caCert = process.env.AIVEN_CA_CERT_BASE64 ? Buffer.from(process.env.AIVEN_CA_CERT_BASE64, "base64").toString("utf-8") : undefined;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: caCert ? {
    ca: caCert,
    rejectUnauthorized: true,
  } : false,
});

export const db = drizzle(pool);
