# Ledgerly

Pequeno app de finanças pessoais usado para demonstrações técnicas e entrevistas.

## Tech stack
- Next.js (App Router) + TypeScript
- Prisma (Postgres)
- NextAuth
- pnpm, Docker

## Rápido (local) — recomendado para desenvolvimento
Pré-requisitos: Docker Desktop, Node.js >= 22, pnpm

1. Levantar Postgres local:

```bash
docker compose up -d
```

2. Instalar dependências e gerar client Prisma:

```bash
pnpm install
pnpm prisma:generate
```

3. Aplicar schema local (recomendado usar `.env.local`):

```bash
pnpm prisma:push:local
# ou
DOTENV_CONFIG_PATH=.env.local npx prisma db push
```

4. Rodar seed (popula uma conta de demo):

```bash
pnpm prisma:seed:local
```

5. Iniciar servidor de desenvolvimento:

```bash
pnpm dev
```

## Credenciais de demo (apenas para dev)
- Email: `helton.quit@gmail.com`
- Senha: `devpass123`

> Não usar essas credenciais em produção.

## Scripts úteis
- `pnpm dev` — servidor dev
- `pnpm build` / `pnpm start` — build/produção
- `pnpm prisma:push:local` — aplica `schema.prisma` contra `.env.local`
- `pnpm prisma:seed:local` — executa seed contra `.env.local`
- `pnpm prisma:studio:local` — abre Prisma Studio apontando para `.env.local`
- `pnpm ci` — rotina curta usada no CI (generate, typecheck, lint, build)

## Segurança / notas sobre Prisma
O projeto contém uma checagem em `prisma.config.ts` que impede comandos Prisma de serem executados contra hosts não-locais (ex.: Supabase) a menos que `PRISMA_ALLOW_PROD_DB=true` seja definido. Use sempre as variantes `*:local` ou prefixe com `DOTENV_CONFIG_PATH=.env.local` para garantir que os comandos ajustem apenas o banco local.

## Contribuindo
Veja `docs/HOW_TO_RUN.md` para mais detalhes sobre onboarding e fluxo de desenvolvimento.

---
Se quiser, eu também adiciono um `CONTRIBUTING.md` com checklist para entrevistas (o que destacar no README, screenshots e um pequeno vídeo de demo). Deseja isso agora?
# 📊 Ledgerly

> Your personal life management system - Track finances, projects, career, and wellness in one unified platform.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.2-2D3748?logo=prisma)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Overview

Ledgerly is a comprehensive personal ledger application that helps you manage all aspects of your life in one place. Built with modern web technologies, it provides a seamless experience for tracking finances, managing projects, monitoring career progress, and maintaining wellness habits.

The platform features a modular architecture with independent dashboards for each life area, powered by AI assistance and backed by a robust authentication system with PostgreSQL database.

## 🚀 Key Features

- 🔐 **Complete Authentication** - Secure login with email/password and Google OAuth
- 💰 **Financial Management** - Track transactions, budgets, and financial overview
- 📁 **Project Management** - Organize and monitor personal and professional projects
- 🎯 **Career Tracking** - Set goals, track tasks, and monitor career progression
- 🏃 **Health & Wellness** - Log activities, build habits, and track wellbeing
- 🤖 **AI Integration** - Smart assistance powered by artificial intelligence
- 📊 **Analytics Dashboard** - Live reports and comprehensive data visualization
- 🔔 **Smart Alerts** - Stay notified about important events and deadlines

## 🛠️ Tech Stack

**Frontend:**
- [Next.js 16](https://nextjs.org/) with Turbopack
- [TypeScript](https://www.typescriptlang.org/) 5.4
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)

**Backend:**
- [Prisma 7](https://www.prisma.io/) with PostgreSQL adapter
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Supabase](https://supabase.com/) PostgreSQL database
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) for password hashing

**Dev Tools:**
- [Biome](https://biomejs.dev/) for linting/formatting
- [Zod](https://zod.dev/) for schema validation
- [React Hook Form](https://react-hook-form.com/) for forms

## ⚡ Quick Start

```bash
# Install dependencies
pnpm install

# Setup environment variables (see docs/ENV_VARIABLES.md)
cp .env.example .env.local

# Run database migrations
pnpm prisma generate

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 📚 Documentation

- 📖 [How to Run](docs/HOW_TO_RUN.md) - Detailed installation and setup guide
- 🏗️ [Architecture](docs/ARCHITECTURE.md) - Project structure and design decisions
- 🤝 [Contributing](docs/CONTRIBUTING.md) - Guidelines for contributors
- 🔐 [Environment Variables](docs/ENV_VARIABLES.md) - Complete list of env variables
- 🚀 [Deployment](docs/DEPLOYMENT.md) - Deploy to Vercel and production setup
- 📋 [Roadmap](docs/ROADMAP.md) - Upcoming features and future plans

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Helton Quintans**

- GitHub: [@helton-quintans](https://github.com/helton-quintans)

---

<div align="center">
Made with ❤️ and ☕
</div>
