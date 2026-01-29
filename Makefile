setup:
	cp .env.example .env.local

migrate:
	pnpm prisma migrate dev

generate:
	pnpm prisma generate

dev:
	pnpm dev

build:
	pnpm build
