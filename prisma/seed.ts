import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

async function main() {
  const devEmail = process.env.DEV_EMAIL ?? 'dev@example.com'
  const devName = process.env.DEV_NAME ?? 'Dev'
  const password = process.env.DEV_PASSWORD ?? 'devpass'

  // create or update a dev user
  const passwordHash = bcrypt.hashSync(password, 10)

  const user = await prisma.user.upsert({
    where: { email: devEmail },
    update: {
      name: devName,
      passwordHash,
    },
    create: {
      name: devName,
      email: devEmail,
      passwordHash,
    },
  })

  console.log('Dev user ready:', user.email)

  // create some default categories for dev
  const categories = [
    { name: 'General', icon: '📌', type: 'expense' },
    { name: 'Salary', icon: '💼', type: 'income' },
    { name: 'Groceries', icon: '🛒', type: 'expense' },
  ]

  for (const cat of categories) {
    await prisma.transactionCategory.upsert({
      where: { userId_name: { userId: user.id, name: cat.name } },
      update: { icon: cat.icon, type: cat.type },
      create: { ...cat, userId: user.id },
    })
  }

  console.log('Default categories ensured')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
