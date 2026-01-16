import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { withAccelerate } from "@prisma/extension-accelerate";
import { PrismaClient } from "../../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL ?? ""}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });

// Enable accelerate only when explicitly requested or when using a Postgres-style URL.
const shouldUseAccelerate =
  process.env.PRISMA_ACCELERATE === "true" ||
  /postgres(?:ql)?(:|\:|@)/i.test(connectionString);

const globalForPrisma = globalThis as unknown as { prisma?: unknown };

const baseClient = new PrismaClient({ adapter });

const maybeExtended = shouldUseAccelerate
  ? (baseClient.$extends(withAccelerate()) as unknown)
  : baseClient;

export const prisma: PrismaClient =
  (globalForPrisma.prisma as PrismaClient) || (maybeExtended as PrismaClient);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
