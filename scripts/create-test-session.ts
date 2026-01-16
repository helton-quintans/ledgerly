import crypto from 'crypto';
import { prisma } from '../src/lib/prisma';

const email = 'admin@admin.com';

async function main() {
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { email, name: 'Admin' } });
    console.log('Usuário criado:', user.id, user.email);
  } else {
    console.log('Usuário existente:', user.id, user.email);
  }

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 dias

  const session = await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  });

  console.log('Session criada. Token:', sessionToken);
  console.log('');
  console.log('Cole no console do navegador:');
  console.log(`document.cookie = "next-auth.session-token=${sessionToken}; path=/"; location.href = '/'`);

  await prisma.$disconnect();
}

await main().catch((e) => {
  console.error(e);
  process.exit(1);
});
