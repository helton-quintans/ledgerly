export async function GET() {
  return Response.json({
    testVar: process.env.TEST_VAR,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    publicGoogleId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    publicGoogleSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
    // Lista só as que contêm GOOGLE
    googleVars: Object.keys(process.env)
      .filter(key => key.includes('GOOGLE'))
      .map(key => `${key}: ${process.env[key] ? 'EXISTS' : 'NULL'}`),
  });
}