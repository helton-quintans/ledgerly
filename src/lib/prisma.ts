import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

// Safety: prevent accidental writes to production DB when running in development.
// If running locally (NODE_ENV !== 'production') we only allow connecting
// to localhost/127.0.0.1 Postgres URLs. This avoids accidental usage of
// a remote/prod DATABASE_URL during development.
if (process.env.NODE_ENV !== "production") {
  const isLocal =
    databaseUrl.includes("localhost") ||
    databaseUrl.includes("127.0.0.1") ||
    databaseUrl.startsWith("postgresql://postgres:postgres@localhost");

  if (!isLocal) {
    throw new Error(
      "Refusing to connect to non-local DATABASE_URL in development. " +
        "Set NODE_ENV=production to connect, or update your .env to use a local database.",
    );
  }
}

const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
