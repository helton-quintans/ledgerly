#!/usr/bin/env node
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma';

const email = process.env.EMAIL || 'me@me.com';
const password = process.env.PASSWORD || 'secret';

async function main() {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const hashed = await bcrypt.hash(password, 10);
    user = await prisma.user.create({ data: { email, name: 'Test User', password: hashed } });
    console.log('Created user', user.id);
  } else {
    console.log('User exists:', user.id);
  }

  const sessionToken = crypto.randomBytes(48).toString('hex');
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({ data: { sessionToken, userId: user.id, expires } });
  console.log('Created session', session.id);
  console.log('');
  console.log('Run this in the browser console to set the session cookie and go to /:');
  console.log(`document.cookie = "next-auth.session-token=${sessionToken}; path=/;"; location.href='/'`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
