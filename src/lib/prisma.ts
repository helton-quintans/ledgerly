import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

const databaseUrl = process.env.DATABASE_URL;

console.log("[PRISMA] DATABASE_URL env:", process.env.DATABASE_URL?.substring(0, 80));
console.log("[PRISMA] Using DATABASE_URL:", databaseUrl?.substring(0, 80));

if (!databaseUrl) {
	throw new Error("DATABASE_URL is not set");
}

// Force pooler URL in production
const connectionString = databaseUrl.includes('pooler.supabase.com') 
	? databaseUrl 
	: databaseUrl.replace('db.veormxeyybonamnlwdem.supabase.co', 'aws-1-us-west-1.pooler.supabase.com').replace('postgres:', 'postgres.veormxeyybonamnlwdem:');

console.log("[PRISMA] Final connection string:", connectionString.substring(0, 80));

const pool = new Pool({
	connectionString,
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
