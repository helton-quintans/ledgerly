#!/usr/bin/env -S node
import fs from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load `.env.local` automatically if it exists, fallback to `.env`
const envLocal = path.resolve(process.cwd(), ".env.local");
const envDefault = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
} else if (fs.existsSync(envDefault)) {
  dotenv.config({ path: envDefault });
}

if (!process.env.DATABASE_URL) {
  console.error(
    "Missing DATABASE_URL. Create a .env.local or export DATABASE_URL before running the seed.",
  );
  process.exit(1);
}

const { prisma } = await import("../src/lib/prisma");

async function main() {
  const email = process.env.SEED_EMAIL ?? "helton.quit@gmail.com";
  const password = process.env.SEED_PASSWORD ?? "devpass123";

  const passwordHash = bcrypt.hashSync(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: "Helton (dev)" },
    create: {
      email,
      name: "Helton (dev)",
      passwordHash,
    },
  });

  console.log(`Seeded user: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
