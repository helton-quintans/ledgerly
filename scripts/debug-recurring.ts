import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const recs = await prisma.recurringTransaction.findMany({ select: { id: true, userId: true, description: true } });
  console.log('Recurring records:', JSON.stringify(recs, null, 2));

  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log('Users:', JSON.stringify(users, null, 2));

  await prisma.$disconnect();
  pool.end();
}

main().catch(console.error);
