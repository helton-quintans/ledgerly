export async function GET() {
  // Check all possible variations of Google OAuth environment variables
  const possibleGoogleVars = [
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'NEXT_PUBLIC_GOOGLE_CLIENT_ID',
    'NEXT_PUBLIC_GOOGLE_CLIENT_SECRET',
    'GOOGLE_ID',
    'GOOGLE_SECRET',
    'AUTH_GOOGLE_ID', 
    'AUTH_GOOGLE_SECRET',
    'OAUTH_GOOGLE_CLIENT_ID',
    'OAUTH_GOOGLE_CLIENT_SECRET'
  ];

  const allEnvVars = Object.keys(process.env);
  
  return Response.json({
    timestamp: new Date().toISOString(),
    platform: process.env.VERCEL ? "vercel" : "local",
    environment: process.env.NODE_ENV || "unknown",
    vercelEnv: process.env.VERCEL_ENV || "not-set",
    
    // Check each possible Google variable
    googleVariableCheck: possibleGoogleVars.map(varName => ({
      variable: varName,
      exists: varName in process.env,
      hasValue: !!process.env[varName],
      valueLength: process.env[varName]?.length || 0,
      firstChar: process.env[varName]?.charAt(0) || null
    })),
    
    // Show all environment variable keys that contain 'google' (case insensitive)
    allGoogleLikeVars: allEnvVars.filter(key => 
      key.toLowerCase().includes('google') || 
      key.toLowerCase().includes('oauth') ||
      key.toLowerCase().includes('client')
    ),
    
    // Environment variable statistics
    stats: {
      totalVars: allEnvVars.length,
      vercelVarsCount: allEnvVars.filter(k => k.includes('VERCEL')).length,
      authVarsCount: allEnvVars.filter(k => k.includes('AUTH')).length,
      publicVarsCount: allEnvVars.filter(k => k.includes('NEXT_PUBLIC')).length
    }
  });
}