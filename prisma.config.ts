import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load environment variables with the following priority:
// 1. If DOTENV_CONFIG_PATH is set, use that
// 2. If not production and .env.local exists, use .env.local
// 3. Fallback to default dotenv behaviour (loads .env)
const explicitPath = process.env.DOTENV_CONFIG_PATH;
if (explicitPath) {
  dotenv.config({ path: explicitPath });
} else {
  const localPath = path.resolve(process.cwd(), ".env.local");
  if (process.env.NODE_ENV !== "production" && fs.existsSync(localPath)) {
    dotenv.config({ path: localPath });
  } else {
    dotenv.config();
  }
}

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/ledgerly?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
