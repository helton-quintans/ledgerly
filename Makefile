# ──────────────── Environment ────────────────
setup:
		cp .env.example .env.local

# ──────────────── Install Dependencies ────────────────
install:
		pnpm install

# ──────────────── Prisma ────────────────
migrate:
		DOTENV_CONFIG_PATH=.env.local pnpm prisma migrate dev
generate:
		DOTENV_CONFIG_PATH=.env.local pnpm prisma generate
studio:
		DOTENV_CONFIG_PATH=.env.local pnpm prisma studio
reset-db:
		DOTENV_CONFIG_PATH=.env.local pnpm prisma migrate reset --force
seed:
		DOTENV_CONFIG_PATH=.env.local pnpm prisma db seed

# ──────────────── Local Database ────────────────
db-up:
		docker compose up -d

db-down:
		docker compose down

# ──────────────── Application ────────────────
dev:
		pnpm dev
build:
	pnpm build
start:
		pnpm start
# ──────────────── Testing ────────────────
test:
		pnpm test

# ──────────────── Code Quality ────────────────
lint:
		pnpm biome lint .
lint-fix:
	pnpm biome lint . --apply
format:
		pnpm biome format .