import { prisma } from '../../../../../src/lib/prisma';

export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return new Response(JSON.stringify({ error: 'Not allowed in production' }), { status: 403 });
  }

  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map((c) => {
      const [k, ...v] = c.split('=');
      return [k?.trim(), v?.join('=')];
    }).filter(Boolean) as [string, string][]
  );

  const token = cookies['next-auth.session-token'] || null;

  let session = null;
  if (token) {
    session = await prisma.session.findUnique({ where: { sessionToken: token } });
  }

  return new Response(JSON.stringify({ cookieHeader, token, session }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
