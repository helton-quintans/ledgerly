# 🏗️ Architecture

Overview of Ledgerly's architecture, design decisions, and project structure.

## Project Structure

```
ledgerly/
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma         # Prisma data models
│   └── migrations/           # Database migration files
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/          # Authentication routes (login, register)
│   │   ├── (shell)/         # Main application routes
│   │   │   ├── finance/     # Financial management module
│   │   │   ├── projects/    # Project management module
│   │   │   ├── career/      # Career tracking module
│   │   │   ├── health-wellbeing/ # Health and wellness module
│   │   │   ├── analytics/   # Analytics dashboard
│   │   │   └── ai/          # AI assistant
│   │   └── api/             # API routes
│   │       └── auth/        # Authentication endpoints
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── providers/      # Context providers
│   │   └── transactions/   # Domain-specific components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility libraries
│   │   ├── prisma.ts      # Prisma client setup
│   │   ├── auth.ts        # NextAuth configuration
│   │   └── utils.ts       # Helper functions
│   └── types/              # TypeScript type definitions
├── generated/              # Auto-generated Prisma Client
└── docs/                   # Documentation
```

## Design Patterns

### 1. Route Groups

We use Next.js route groups to organize pages logically:

- `(auth)`: Public authentication pages without shell layout
- `(shell)`: Protected pages with sidebar navigation

### 2. Server Components First

- Pages are Server Components by default
- Client Components (`'use client'`) only when needed (forms, interactivity)
- Reduces JavaScript sent to the client

### 3. API Routes

RESTful API routes in `app/api/`:
- `POST /api/auth/register` - User registration
- `GET/POST /api/auth/*` - NextAuth endpoints

### 4. Database Access

- **Prisma Client** with PostgreSQL adapter for serverless environments
- Connection pooling via `@prisma/adapter-pg` and `pg`
- Singleton pattern to reuse Prisma Client instance

```typescript
// src/lib/prisma.ts
const pool = new Pool({ connectionString: DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
```

### 5. Authentication

- **NextAuth.js** with multiple providers:
  - Credentials (email/password)
  - Google OAuth (optional)
- JWT strategy for sessions
- Password hashing with bcryptjs (12 rounds)

## Technology Choices

### Why Next.js 16?

- App Router for improved routing and layouts
- Turbopack for faster development builds
- Built-in API routes and middleware
- Excellent TypeScript support

### Why Prisma 7?

- Type-safe database access
- Improved serverless support
- Better performance with native queries
- Auto-generated TypeScript types

### Why Supabase?

- Managed PostgreSQL database
- Session Pooler for serverless compatibility
- Free tier suitable for development
- Easy to scale

### Why shadcn/ui?

- Copy-paste components (no package dependency)
- Built on Radix UI primitives
- Fully customizable with Tailwind
- Accessible by default

## Data Flow

```
User Request
    ↓
Next.js Middleware (auth check)
    ↓
Server Component / API Route
    ↓
Prisma Client
    ↓
PostgreSQL (Supabase)
    ↓
Response to User
```

## State Management

- **Server State**: React Server Components (no client-side state)
- **Client State**: React hooks (useState, useReducer)
- **Forms**: React Hook Form + Zod validation
- **Session**: NextAuth session provider

## Code Style

### File Naming

- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Route files: lowercase (`page.tsx`, `route.ts`)

### Component Structure

```typescript
// 1. Imports
import { FC } from 'react';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export const MyComponent: FC<Props> = ({ title }) => {
  return <div>{title}</div>;
};
```

### Error Handling

- Try-catch blocks in API routes
- Zod schema validation for inputs
- Consistent error responses:

```typescript
return NextResponse.json(
  { message: "Error message" },
  { status: 400 }
);
```

## Performance Optimizations

1. **Turbopack** for faster dev builds
2. **Server Components** to reduce client bundle
3. **Connection Pooling** for database efficiency
4. **Image Optimization** via Next.js Image component
5. **Code Splitting** automatic with App Router

## Security

- Environment variables for secrets
- CSRF protection via NextAuth
- SQL injection prevention via Prisma
- Password hashing with bcrypt
- HTTP-only cookies for sessions

## Testing Strategy

(To be implemented)

- Unit tests: Vitest
- Integration tests: Playwright
- E2E tests: Playwright
- Database tests: Isolated test database

## Future Improvements

- [ ] Implement caching strategy (Redis)
- [ ] Add request rate limiting
- [ ] Implement real-time features (WebSockets)
- [ ] Add comprehensive test coverage
- [ ] Implement CI/CD pipeline
- [ ] Add monitoring and error tracking
