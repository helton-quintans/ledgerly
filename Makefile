# ──────────────── Environment ────────────────
setup:
		cp .env.example .env.local

# ──────────────── Prisma ────────────────
migrate:
		pnpm prisma migrate dev
generate:
		pnpm prisma generate
studio:
		pnpm prisma studio
reset-db:
		pnpm prisma migrate reset --force
seed:
		pnpm prisma db seed

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