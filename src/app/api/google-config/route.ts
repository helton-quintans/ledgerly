// Dynamic Google OAuth configuration endpoint
// This endpoint will be called by auth.ts to get credentials

export async function GET() {
  const config = {
    hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    platform: process.env.VERCEL ? 'vercel' : 'local',
  };
  
  // Only return actual values in development or if specifically requested
  if (process.env.NODE_ENV === 'development') {
    return Response.json({
      ...config,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    });
  }
  
  // In production, just confirm availability
  return Response.json(config);
}