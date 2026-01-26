# 📖 How to Run

Complete guide to set up and run Ledgerly locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 22.17.0 or higher ([download](https://nodejs.org/))
- **pnpm** 10.9.2 or higher (`npm install -g pnpm`)
- **PostgreSQL** database (we recommend [Supabase](https://supabase.com/))
- **Git** for version control

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/helton-quintans/ledgerly.git
cd ledgerly
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure the following variables (see [Environment Variables](ENV_VARIABLES.md) for details):

```env
# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### 4. Setup Database

#### Option A — Production (Supabase, recommended for deployment)

> Recommended for production and preview deployments. Do NOT use your production Supabase database
> for local development. For local development, use the `Local PostgreSQL` (docker-compose) option below.

1. Create a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. Copy the **Session Pooler** connection string from **Database Settings**
4. Update `DATABASE_URL` and `DIRECT_URL` in `.env.local`

#### Option B: Local PostgreSQL

Option B: Local PostgreSQL (recommended via docker-compose)

We provide a `docker-compose.yml` to standardize the local database for all contributors.

1. Start the database with Docker Compose:

```bash
docker compose up -d
```

This will start a Postgres 15 container named `ledgerly-pg` and create a persistent volume `ledgerly-pg-data`.

2. Export or set your local `DATABASE_URL` (matches `.env.example` development settings):

```bash
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
# or add to .env.local:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
```

3. Apply schema and generate the Prisma Client (run from project root):

```bash
# Recommended for local development (safe):
pnpm prisma:generate
pnpm prisma:push:local

# or explicitly:
DOTENV_CONFIG_PATH=.env.local npx prisma db push
```

4. (Optional) Seed development data (creates a dev user)

```bash
# runs prisma/seed.ts and creates a dev user (defaults to helton.quit@gmail.com)
pnpm prisma:seed:local
# to customize email/password:
SEED_EMAIL=me@local.test SEED_PASSWORD=MyPass123 pnpm prisma:seed:local
```

Notes:
- Use `docker compose down` to stop the container.
- If you prefer not to use Docker, you may install Postgres locally and create the `ledgerly` database, but Docker ensures consistent environment across contributors.

### 5. Run Database Migrations

Migration workflow recommendation:

- Local development: use `npx prisma migrate dev` to create and apply migrations while developing. This updates the `prisma/migrations` folder.
- Production / CI: apply migrations with `npx prisma migrate deploy` (never use `db push` in production).

Example local:

```bash
pnpm prisma:migrate:dev:local
```

Example CI / deploy (run in CI with `DATABASE_URL` from secrets):

```bash
pnpm prisma:migrate:deploy
```

Notes:
- `db push` is useful for prototyping, but it can be destructive in production. Prefer migrations (`migrate dev` / `migrate deploy`) for production workflows.
- We provide an example GitHub Actions workflow `.github/workflows/deploy-migrations.yml` that demonstrates running `prisma migrate deploy` using a secret `DATABASE_URL`.

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Development
pnpm dev              # Start dev server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm prisma:generate  # Generate Prisma Client
pnpm prisma:studio    # Open Prisma Studio (database GUI)
pnpm prisma:migrate:dev # Create and apply migrations (dev only)

# Code Quality
pnpm lint             # Check code with Biome
pnpm lint:fix         # Fix code issues automatically
```

## Troubleshooting

### Port 3000 already in use

```bash
# Kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Or start on different port
PORT=3001 pnpm dev
```

### Database connection issues

- Ensure your database is running
- Check that `DATABASE_URL` is correct
- For Supabase, use the **Session Pooler** URL (not Direct Connection)
- Verify the password is URL-encoded (e.g., `@` becomes `%40`)

### Prisma Client errors

```bash
# Clear generated files and rebuild
rm -rf node_modules/.prisma
pnpm prisma generate
```

### Build errors

```bash
# Clear Next.js cache
rm -rf .next
pnpm build
```

## Next Steps

- Read the [Architecture](ARCHITECTURE.md) guide to understand the project structure
- Check [Contributing](CONTRIBUTING.md) if you want to contribute
- See [Deployment](DEPLOYMENT.md) for production setup
