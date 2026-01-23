# Local development setup

Quick steps for a new developer to get the project running locally.

1) Requirements
- Docker (for a local Postgres instance)
- pnpm (or npm/yarn)

2) Create your local environment file
```bash
cp .env.local.example .env.local
# edit .env.local if you need to change credentials
```

3) Start a local Postgres with Docker (example)
```bash
docker run --name ledgerly-pg -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=postgres -p 5432:5432 -d postgres:15
```

4) Install dependencies and generate Prisma Client
```bash
pnpm install
npx prisma generate
```

Note: `prisma.config.ts` is configured to load `.env.local` first, so Prisma CLI commands will pick up your local variables automatically.

5) Apply migrations locally (this will wipe the local DB)
```bash
npx prisma migrate reset --force --schema=prisma/schema.prisma
```

If you prefer to force Prisma to load `.env.local` only for a single command, use:
```bash
DOTENV_CONFIG_PATH=.env.local npx prisma migrate reset --force --schema=prisma/schema.prisma
```

6) Run the app
```bash
pnpm dev
```

Tips
- Keep `.env.local` out of version control — it should be listed in `.gitignore`.
- Use `.env.example` and `.env.local.example` to document defaults and make onboarding easier.
- In production (Vercel, Supabase) set environment variables through the provider UI; do not commit secrets to the repo.
