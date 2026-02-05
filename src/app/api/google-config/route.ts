// Dynamic Google OAuth configuration endpoint
// This endpoint will be called by auth.ts to get credentials

export async function GET() {
  const { getGoogleOAuthConfig } = await import('@/lib/google-oauth-config');
  const config = getGoogleOAuthConfig();
  
  return Response.json({
    timestamp: new Date().toISOString(),
    platform: process.env.VERCEL ? "vercel" : "local",
    environment: process.env.NODE_ENV || "unknown",
    
    // Google config resolution  
    googleConfig: {
      hasClientId: !!config.clientId,
      hasClientSecret: !!config.clientSecret,
      source: config.source,
      clientIdLength: config.clientId?.length || 0,
      clientSecretLength: config.clientSecret?.length || 0,
    },
    
    // Raw environment check - test EVERY possible variable name
    rawEnvCheck: {
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET: !!process.env.GOOGLE_CLIENT_SECRET,
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      NEXT_PUBLIC_GOOGLE_CLIENT_SECRET: !!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      GOOGLE_ID: !!process.env.GOOGLE_ID,
      GOOGLE_SECRET: !!process.env.GOOGLE_SECRET,
      AUTH_GOOGLE_CLIENT_ID: !!process.env.AUTH_GOOGLE_CLIENT_ID,
      AUTH_GOOGLE_CLIENT_SECRET: !!process.env.AUTH_GOOGLE_CLIENT_SECRET,
      VERCEL: !!process.env.VERCEL,
      NODE_ENV: process.env.NODE_ENV
    }
  });
}