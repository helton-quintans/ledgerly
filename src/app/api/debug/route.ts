export async function GET() {
  // Lista TODAS as variáveis de ambiente que começam com GOOGLE ou NEXTAUTH
  const allEnvVars = Object.keys(process.env)
    .filter(key => key.includes('GOOGLE') || key.includes('NEXTAUTH'))
    .reduce((acc, key) => {
      const value = process.env[key];
      acc[key] = value ? `${value.substring(0, 10)}...` : 'undefined';
      return acc;
    }, {} as Record<string, string>);

  return Response.json({
    hasGoogleId: !!process.env.GOOGLE_CLIENT_ID,
    hasGoogleSecret: !!process.env.GOOGLE_CLIENT_SECRET,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nodeEnv: process.env.NODE_ENV,
    googleIdLength: process.env.GOOGLE_CLIENT_ID?.length || 0,
    googleSecretLength: process.env.GOOGLE_CLIENT_SECRET?.length || 0,
    allEnvVars,
  });
}