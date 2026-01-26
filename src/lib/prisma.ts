import "dotenv/config";
import "../lib/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient as GeneratedPrismaClient } from "../../generated/prisma/client";
import type { PrismaClient as GeneratedPrismaClientType } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: GeneratedPrismaClientType | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

export const prisma: GeneratedPrismaClientType =
  globalForPrisma.prisma ??
  (new GeneratedPrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  }) as unknown as GeneratedPrismaClientType);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
