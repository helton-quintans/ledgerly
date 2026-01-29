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

This project provides a Makefile to simplify onboarding. To automatically create your `.env.local` file, just run:

```bash
make setup
```

This will copy `.env.example` to `.env.local`. Edit `.env.local` and configure the required variables (see [Environment Variables](ENV_VARIABLES.md) for details):

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

#### Option A: Using Supabase (Recommended)

1. Create a free account at [Supabase](https://supabase.com/)
2. Create a new project
3. Copy the **Session Pooler** connection string from **Database Settings**
4. Update `DATABASE_URL` and `DIRECT_URL` in `.env.local`

#### Option B: Local PostgreSQL

```bash
# Create database
createdb ledgerly

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ledgerly?schema=public"
```

### 5. Run Database Migrations

If using Supabase, execute the SQL from `prisma/migrations/20260118014654_auth_infra/migration.sql` in the SQL Editor.

Then generate the Prisma Client:

```bash
pnpm prisma generate
```

### 6. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

```bash
# Onboarding
make setup            # Copies .env.example to .env.local

# Development
make dev              # Starts the development server
make build            # Builds the project for production

# Database
make migrate          # Runs Prisma migrations
make generate         # Generates the Prisma client

# Code Quality
pnpm lint             # Checks code with Biome
pnpm lint:fix         # Automatically fixes code issues
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
