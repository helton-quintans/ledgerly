import "dotenv/config";
import { defineConfig } from "prisma/config";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/ledgerly?schema=public";

const directUrl = process.env.DIRECT_URL ?? databaseUrl;

// Prevent accidental destructive operations on non-local databases.
// If DATABASE_URL points to a non-local host (for example a Supabase instance),
// abort unless the environment explicitly allows it via PRISMA_ALLOW_PROD_DB=true.
try {
  const url = new URL(databaseUrl);
  const host = url.hostname;
  // Allow `prisma generate` to run even when DATABASE_URL points to a
  // non-local host. `generate` is safe (it doesn't modify the database),
  // and Vercel runs `prisma generate` during build.
  const isGenerate = process.argv.includes("generate");
  const isLocal =
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.endsWith(".local");
  if (!isLocal && process.env.PRISMA_ALLOW_PROD_DB !== "true" && !isGenerate) {
    throw new Error(
      `Refusing to run Prisma against non-local host '${host}'.\nIf you really want to run Prisma commands against this host, set PRISMA_ALLOW_PROD_DB=true.\nTo run against your local DB instead, prefix commands with DOTENV_CONFIG_PATH=.env.local (recommended).`,
    );
  }
} catch (e) {
  // If parsing fails or the check throws, rethrow to stop Prisma commands.
  if (e instanceof Error) throw e;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
