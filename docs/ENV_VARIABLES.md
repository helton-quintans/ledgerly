# 🔐 Environment Variables

Complete reference for all environment variables used in Ledgerly.

## Required Variables

### Database

#### `DATABASE_URL`
PostgreSQL connection string for application runtime.

**Format:**
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
```

**Example (Supabase Session Pooler):**
```env
DATABASE_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-X-region.pooler.supabase.com:5432/postgres"
```

**Notes:**
- Use **Session Pooler** URL for serverless environments (Vercel, AWS Lambda)
- Special characters in password must be URL-encoded (`@` → `%40`, `*` → `%2A`)
- Port 5432 for Session Pooler, 6543 for Transaction Pooler

---

#### `DIRECT_URL`
Direct PostgreSQL connection string for migrations.

**Format:** Same as `DATABASE_URL`

**Example:**
```env
DIRECT_URL="postgresql://postgres.PROJECT_REF:PASSWORD@aws-X-region.pooler.supabase.com:5432/postgres"
```

**Notes:**
- Used by Prisma for running migrations
- Can be the same as `DATABASE_URL` when using Session Pooler

---

### Authentication

#### `NEXTAUTH_URL`
The canonical URL of your application.

**Development:**
```env
NEXTAUTH_URL="http://localhost:3000"
```

**Production:**
```env
NEXTAUTH_URL="https://yourdomain.vercel.app"
```

**Notes:**
- Must include protocol (http:// or https://)
- No trailing slash
- Critical for OAuth redirects

---

#### `NEXTAUTH_SECRET`
Secret key for encrypting JWT tokens and sessions.

**Generate:**
```bash
openssl rand -base64 32
```

**Example:**
```env
NEXTAUTH_SECRET="your-random-secret-string-here"
```

**Notes:**
- Keep this secret secure
- Use different secrets for dev/staging/production
- Never commit to version control

---

## Optional Variables

### Google OAuth

#### `GOOGLE_CLIENT_ID`
Google OAuth 2.0 Client ID

**How to get:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `{NEXTAUTH_URL}/api/auth/callback/google`

```env
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
```

---

#### `GOOGLE_CLIENT_SECRET`
Google OAuth 2.0 Client Secret

```env
GOOGLE_CLIENT_SECRET="your-client-secret"
```

---

### Public Variables

#### `NEXT_PUBLIC_BASE_URL`
Base URL for client-side requests (optional)

```env
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
```

---

## Environment-Specific Setup

### Local Development (`.env.local`)

```env
# Database (use local or Supabase)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ledgerly?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/ledgerly?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-change-in-production"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Vercel Production

In Vercel Dashboard → Project → Settings → Environment Variables:

1. Add all variables listed above
2. Set environment scopes:
   - ✅ Production
   - ✅ Preview
   - ✅ Development (optional)
3. Click "Save"

**Important:**
- Use **Session Pooler** URL for `DATABASE_URL` in production
- Use strong `NEXTAUTH_SECRET` (different from dev)
- Set correct `NEXTAUTH_URL` with production domain

---

## Security Best Practices

### ✅ DO

- Store secrets in `.env.local` (gitignored)
- Use different secrets for each environment
- Rotate secrets periodically
- Use strong, random secrets
- URL-encode special characters in connection strings
- Set appropriate environment scopes in Vercel

### ❌ DON'T

- Commit `.env.local` to git
- Share secrets in public channels
- Reuse secrets across projects
- Use weak or predictable secrets
- Hardcode secrets in source code

---

## Troubleshooting

### Connection Issues

**Problem:** Can't connect to database
**Solution:**
- Verify `DATABASE_URL` is correct
- Check password is URL-encoded
- For Supabase, use Session Pooler URL
- Ensure database is not paused (Supabase free tier)

### Authentication Issues

**Problem:** Login redirects fail
**Solution:**
- Verify `NEXTAUTH_URL` matches your domain
- Check no trailing slash in `NEXTAUTH_URL`
- Ensure `NEXTAUTH_SECRET` is set

### OAuth Issues

**Problem:** Google OAuth fails
**Solution:**
- Verify redirect URI in Google Console matches `{NEXTAUTH_URL}/api/auth/callback/google`
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Ensure Google+ API is enabled

---

## Reference

- [NextAuth Environment Variables](https://next-auth.js.org/configuration/options#environment-variables)
- [Prisma Connection URLs](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
