import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Carrega `.env.local` primeiro para que desenvolvedores locais possam sobrescrever
// as variáveis sem modificar `.env`. Se não existir, fallback para `.env`.
dotenv.config({ path: ".env.local" });
dotenv.config();

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/ledgerly?schema=public";

// const directUrl = process.env.DIRECT_URL ?? databaseUrl;

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
