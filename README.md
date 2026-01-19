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
