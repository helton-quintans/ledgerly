# 🚀 Deployment

Guide for deploying Ledgerly to production on Vercel.

## Prerequisites

- GitHub repository with your code
- [Vercel account](https://vercel.com/signup) (free tier available)
- PostgreSQL database (we recommend [Supabase](https://supabase.com/))
- Environment variables ready (see [ENV_VARIABLES.md](ENV_VARIABLES.md))

## Vercel Deployment

### Initial Setup

1. **Push to GitHub**

```bash
git add .
git commit -m "feat: prepare for deployment"
git push origin main
```

2. **Import Project to Vercel**

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Click "Add New" → "Project"
- Import your GitHub repository
- Configure project:
  - **Framework Preset:** Next.js
  - **Root Directory:** `./` (default)
  - **Build Command:** `pnpm run build` (auto-detected)
  - **Output Directory:** `.next` (auto-detected)

3. **Configure Environment Variables**

In Vercel project settings, add these variables:

```env
# Database
DATABASE_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-X-region.pooler.supabase.com:5432/postgres
DIRECT_URL=postgresql://postgres.PROJECT_REF:PASSWORD@aws-X-region.pooler.supabase.com:5432/postgres

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
```

**Important:**
- Use **Session Pooler** URL (not Direct Connection)
- URL-encode special characters in passwords
- Use strong, unique `NEXTAUTH_SECRET`
- Mark all as **Production**, **Preview**, and **Development**

4. **Deploy**

Click "Deploy" and wait for the build to complete.

---

## Database Setup

### Option 1: Supabase (Recommended)

1. **Create Project**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Create new project
   - Wait for database to provision

2. **Get Connection String**
   - Go to **Settings** → **Database**
   - Copy **Connection string** → **Session Pooler** → **URI**
   - Replace `[YOUR-PASSWORD]` with your actual password

3. **Run Migrations**
   - Go to **SQL Editor**
   - Execute the SQL from `prisma/migrations/20260118014654_auth_infra/migration.sql`

4. **Verify Tables**
   - Go to **Table Editor**
   - Confirm `User`, `Account`, `Session`, etc. exist

### Option 2: Other Providers

- **Neon:** Serverless PostgreSQL with generous free tier
- **PlanetScale:** MySQL with branching (requires schema changes)
- **Railway:** PostgreSQL with simple setup
- **Render:** PostgreSQL with free tier

---

## Custom Domain

1. **Add Domain in Vercel**
   - Go to Project → Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Environment Variables**
   ```env
   NEXTAUTH_URL=https://yourdomain.com
   ```

3. **Update OAuth Redirect URIs**
   - Google Console: Add `https://yourdomain.com/api/auth/callback/google`

---

## Continuous Deployment

Vercel automatically deploys on every push to your repository:

- **Production:** Deploys from `main` branch
- **Preview:** Deploys from pull requests and other branches

### Disable Auto-Deploy

Project Settings → Git → Disable "Automatic Deployments"

---

## Build Configuration

### Custom Build Command

If needed, customize in `vercel.json`:

```json
{
  "buildCommand": "pnpm prisma generate && pnpm run build",
  "framework": "nextjs"
}
```

### Environment-Specific Builds

Vercel uses these environment variables during build:

- `VERCEL=1`
- `VERCEL_ENV` (production | preview | development)
- `VERCEL_URL` (deployment URL)

---

## Performance Optimization

### 1. Edge Functions

Move API routes to Edge Runtime for better performance:

```typescript
export const runtime = 'edge';
```

### 2. Image Optimization

Images are automatically optimized by Next.js Image component.

### 3. Caching

Configure caching headers in `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=60' }
      ],
    },
  ];
}
```

---

## Monitoring

### Vercel Analytics

Enable in Project Settings → Analytics (included in free tier)

### Error Tracking

Integrate error tracking service:

- [Sentry](https://sentry.io/) - Recommended
- [LogRocket](https://logrocket.com/)
- [Datadog](https://www.datadoghq.com/)

---

## Security Checklist

Before going live:

- [ ] Use strong `NEXTAUTH_SECRET`
- [ ] Enable HTTPS only (automatic on Vercel)
- [ ] Set secure headers in `next.config.ts`
- [ ] Validate all user inputs with Zod
- [ ] Review CORS settings if using API
- [ ] Enable Vercel Firewall (Pro plan)
- [ ] Regular database backups (Supabase has automatic backups)

---

## Rollback

If deployment fails:

1. Go to Deployments
2. Find last working deployment
3. Click "⋮" → "Promote to Production"

---

## CI/CD Pipeline (Optional)

Add GitHub Actions for automated testing:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test # when implemented
```

---

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure environment variables are set
- Test build locally: `pnpm run build`

### Database Connection Errors

- Verify `DATABASE_URL` uses Session Pooler
- Check password is URL-encoded
- Ensure Supabase project is not paused
- Test connection locally first

### 500 Errors in Production

- Check Function Logs in Vercel
- Verify all environment variables are set
- Ensure database migrations are applied
- Check for missing dependencies

---

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Guides](https://supabase.com/docs/guides/database)
