import bcrypt from 'bcryptjs';
import { prisma } from '../../../../../src/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name } = body;
    if (!email || !password) {
      console.warn('register: missing email or password', { body });
      return new Response(JSON.stringify({ error: 'email and password required' }), { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.warn('register: user already exists', { email });
      return new Response(JSON.stringify({ error: 'User already exists' }), { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, name: name ?? null, password: hashed } });

    return new Response(JSON.stringify({ user: { id: user.id, email: user.email } }), { status: 201 });
  } catch (err: any) {
    console.error('register: unexpected error', err);
    // If this is a native binding issue, include the stack/message to aid debugging
    return new Response(JSON.stringify({ error: err?.message ?? 'unknown', stack: err?.stack ?? null }), { status: 500 });
  }
}
