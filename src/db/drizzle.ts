import { writeFileSync, existsSync } from "fs";
import path from "path";
import { drizzle } from "drizzle-orm/node-postgres";

// Use Vercel's writable temp directory
const caPath = path.join("/tmp", "aiven-ca.pem");

let connectionString = process.env.DATABASE_URL!;

// Write the CA cert if not already present
if (process.env.AIVEN_CA_CERT_BASE64 && !existsSync(caPath)) {
  const ca = Buffer.from(
    process.env.AIVEN_CA_CERT_BASE64,
    "base64"
  ).toString("utf-8");
  writeFileSync(caPath, ca);
}

if (process.env.AIVEN_CA_CERT_BASE64) {
  connectionString += `&sslrootcert=${caPath}`;
}

export const db = drizzle(connectionString);
