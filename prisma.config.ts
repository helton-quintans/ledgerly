import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // TODO: Change default DATABASE_URL to the local dev SQLite file when DATABASE_URL is not defined
    url: process.env.DATABASE_URL ?? "file:./dev.db",
  },
});
