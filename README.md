# 📊 Ledgerly

> Your personal life management system - Track finances, projects, career, and wellness in one unified platform.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7.2-2D3748?logo=prisma)
![License](https://img.shields.io/badge/license-MIT-green)

---

## ✨ Overview

Ledgerly is a comprehensive personal life management system, unifying finances, projects, career, and wellness in a single modern platform.

The project is built with a modular and scalable architecture, focused on code reuse, automation, and best development practices. It uses a monorepo approach with shared packages (see the `packages/` directory) for UI components, hooks, utilities, schemas, types, and integrations, making maintenance and continuous evolution easier.

**Timeless project principles:**
- Modularity and separation of concerns
- Code reuse across frontend, backend, and libraries
- Contextual and automated documentation
- Automated testing, builds, and deployments
- Easy onboarding for new developers
- Cloud readiness and scalability

For details about architectural decisions, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

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

- 📖 [How to Run](docs/HOW_TO_RUN.md) — Complete installation and setup guide
- 🏗️ [Architecture](docs/ARCHITECTURE.md) — Design decisions and long-term vision
- 🤝 [Contributing](docs/CONTRIBUTING.md) — How to contribute
- 🔐 [Environment Variables](docs/ENV_VARIABLES.md) — Full list of environment variables
- 🚀 [Deployment](docs/DEPLOYMENT.md) — Production and Vercel deployment
- 📋 [Roadmap](docs/ROADMAP.md) — Project future and upcoming features

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
