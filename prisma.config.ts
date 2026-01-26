import "dotenv/config";
import { defineConfig } from "prisma/config";

function normalizeEnv(v: string | undefined | null) {
  if (!v) return v;
  const s = String(v).trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1).trim();
  }
  return s;
}

const databaseUrl =
  normalizeEnv(process.env.DATABASE_URL) ??
  "postgresql://postgres:postgres@localhost:5432/ledgerly?schema=public";

const directUrl = normalizeEnv(process.env.DIRECT_URL) ?? databaseUrl;

// Prevent accidental destructive operations on non-local databases.
// If DATABASE_URL points to a non-local host (for example a Supabase instance),
// abort unless the environment explicitly allows it via PRISMA_ALLOW_PROD_DB=true.
// If the DATABASE_URL is malformed (for example a secret with surrounding
// quotes), skip the host check so `prisma generate` invoked by CI/builds
// doesn't fail on install. This keeps `generate` allowed while still
// protecting against destructive commands at runtime.
let host: string | null = null;
try {
  host = new URL(databaseUrl).hostname;
} catch {
  // Malformed DATABASE_URL — skip host safety check (allow generate)
  host = null;
}

if (host) {
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
