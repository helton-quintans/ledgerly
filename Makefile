setup:
	cp .env.example .env.local

# Comandos úteis para dev
migrate:
	pnpm prisma migrate dev

generate:
	pnpm prisma generate

dev:
	pnpm dev

build:
	pnpm build
