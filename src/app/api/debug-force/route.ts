export async function GET() {
  // Force a fresh read of all process.env
  const freshEnv = { ...process.env };
  
  // Debug all environment loading methods
  return Response.json({
    timestamp: new Date().toISOString(),
    platform: process.env.VERCEL ? "vercel" : "local",
    environment: process.env.NODE_ENV || "unknown",
    
    // Raw environment checks
    rawEnv: {
      GOOGLE_CLIENT_ID: {
        exists: 'GOOGLE_CLIENT_ID' in freshEnv,
        hasValue: !!freshEnv.GOOGLE_CLIENT_ID,
        type: typeof freshEnv.GOOGLE_CLIENT_ID,
        length: freshEnv.GOOGLE_CLIENT_ID?.length || 0
      },
      GOOGLE_CLIENT_SECRET: {
        exists: 'GOOGLE_CLIENT_SECRET' in freshEnv,
        hasValue: !!freshEnv.GOOGLE_CLIENT_SECRET,
        type: typeof freshEnv.GOOGLE_CLIENT_SECRET,
        length: freshEnv.GOOGLE_CLIENT_SECRET?.length || 0
      }
    },
    
    // Check if Vercel environment is properly loaded
    vercelStatus: {
      hasVercelEnv: !!process.env.VERCEL,
      vercelEnv: process.env.VERCEL_ENV,
      totalEnvVars: Object.keys(freshEnv).length,
      hasDatabase: !!process.env.DATABASE_URL,
      hasNextAuth: !!process.env.NEXTAUTH_SECRET,
    },
    
    // Show a sample of environment keys (no values)
    environmentKeySample: Object.keys(freshEnv)
      .filter(key => 
        key.includes('GOOGLE') || 
        key.includes('CLIENT') || 
        key.includes('SECRET') ||
        key.includes('AUTH')
      )
      .sort(),
      
    // Specific Google checks with different access patterns
    googleChecks: {
      directAccess: process.env.GOOGLE_CLIENT_ID,
      bracketAccess: process.env['GOOGLE_CLIENT_ID'],
      getOwnProperty: Object.prototype.hasOwnProperty.call(process.env, 'GOOGLE_CLIENT_ID'),
      fromFreshEnv: freshEnv.GOOGLE_CLIENT_ID,
    }
  });
}