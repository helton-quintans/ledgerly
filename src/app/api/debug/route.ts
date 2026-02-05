export async function GET() {
  const allEnvVars = process.env;
  const googleVars = Object.keys(allEnvVars).filter(key => 
    key.includes('GOOGLE') || key.includes('google')
  );
  
  const authVars = Object.keys(allEnvVars).filter(key => 
    key.includes('AUTH') || key.includes('auth') || 
    key.includes('NEXTAUTH') || key.includes('nextauth')
  );
  
  const vercelVars = Object.keys(allEnvVars).filter(key => 
    key.includes('VERCEL') || key.includes('vercel')
  );

  // Check for presence without exposing values
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
    platform: process.env.VERCEL ? "vercel" : "local",
    googleVars: googleVars.map(key => ({
      key,
      hasValue: !!process.env[key],
      valueLength: process.env[key]?.length || 0
    })),
    authVars: authVars.map(key => ({
      key,
      hasValue: !!process.env[key],
      valueLength: process.env[key]?.length || 0
    })),
    vercelVars: vercelVars.map(key => ({
      key,
      hasValue: !!process.env[key],
      valueLength: process.env[key]?.length || 0
    })),
    totalEnvVars: Object.keys(allEnvVars).length,
    // Check for common required vars
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    hasGoogleClientId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
  };

  return Response.json(debugInfo);
}