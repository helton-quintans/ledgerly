#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

// Load .env.local first if present, fallback to .env
const envLocal = path.resolve(process.cwd(), ".env.local");
const envDefault = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
} else if (fs.existsSync(envDefault)) {
  dotenv.config({ path: envDefault });
}

function normalizeEnv(v) {
  if (!v) return v;
  const s = String(v).trim();
  if ((s.startsWith("\"") && s.endsWith("\"")) || (s.startsWith("'") && s.endsWith("'"))) {
    return s.slice(1, -1).trim();
  }
  return s;
}

const databaseUrl = normalizeEnv(process.env.DATABASE_URL);
if (databaseUrl) {
  try {
    const url = new URL(databaseUrl);
    const host = url.hostname;
    const isLocal =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local");
    if (!isLocal && process.env.PRISMA_ALLOW_PROD_DB !== "true") {
      console.log(
        `Skipping prisma generate: DATABASE_URL points to non-local host '${host}'. Set PRISMA_ALLOW_PROD_DB=true to override, or provide a .env.local for local generation.`,
      );
      process.exit(0);
    }
  } catch (e) {
    console.log("Skipping prisma generate: invalid DATABASE_URL");
    process.exit(0);
  }
}

console.log("Running prisma generate...");
const res = spawnSync("pnpm", ["prisma", "generate"], { stdio: "inherit" });
process.exit(res.status ?? 0);
