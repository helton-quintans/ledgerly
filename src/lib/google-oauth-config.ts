// Server-side Google OAuth configuration loader
// This runs only on server and tries different approaches to load variables

export function getGoogleOAuthConfig() {
  // In development, try environment variables normally
  if (process.env.NODE_ENV === 'development') {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      source: 'development'
    };
  }

  // In production, try multiple approaches
  let clientId: string | undefined;
  let clientSecret: string | undefined;

  // Method 1: Direct environment variables
  clientId = process.env.GOOGLE_CLIENT_ID;
  clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (clientId && clientSecret) {
    return { clientId, clientSecret, source: 'direct_env' };
  }

  // Method 2: Try NEXT_PUBLIC_ variants
  clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  clientSecret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;

  if (clientId && clientSecret) {
    return { clientId, clientSecret, source: 'next_public_env' };
  }

  // Method 3: Try different naming conventions
  const variants = [
    ['GOOGLE_ID', 'GOOGLE_SECRET'],
    ['AUTH_GOOGLE_CLIENT_ID', 'AUTH_GOOGLE_CLIENT_SECRET'],
    ['OAUTH_CLIENT_ID', 'OAUTH_CLIENT_SECRET'],
  ];

  for (const [idKey, secretKey] of variants) {
    const id = process.env[idKey];
    const secret = process.env[secretKey];
    if (id && secret) {
      return { clientId: id, clientSecret: secret, source: `variant_${idKey}` };
    }
  }

  return { clientId: undefined, clientSecret: undefined, source: 'not_found' };
}