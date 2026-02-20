import { prisma } from "@/lib/prisma";
import { DeleteTransactionInput } from "../../../schema/types/transaction.types";

export async function deleteTransaction(
  _: unknown,
  args: DeleteTransactionInput,
  context: { user?: { sub?: string; id?: string; email?: string } }
) {
  const tokenUser = context?.user;

  // Resolve application `userId` (prefer matching User.id, then email, then Account)
  let userId: string | undefined = tokenUser?.sub ?? tokenUser?.id;

  if (tokenUser?.sub) {
    const u = await prisma.user.findUnique({ where: { id: tokenUser.sub } });
    if (u) userId = u.id;
  }

  if (!userId && tokenUser?.email) {
    const uByEmail = await prisma.user.findUnique({ where: { email: tokenUser.email } });
    if (uByEmail) userId = uByEmail.id;
  }

  if (!userId && tokenUser?.sub) {
    const acct = await prisma.account.findFirst({ where: { providerAccountId: tokenUser.sub } });
    if (acct) userId = acct.userId;
  }

  if (!userId) {
    throw new Error("User not authenticated. Please log in to delete transactions.");
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: args.id },
  });

  if (!transaction) {
    throw new Error("Transaction not found.");
  }

  // Permission check: allow if resolved `userId` owns the transaction
  // or if the token email matches the owner's email (handles duplicate user records).
  if (transaction.userId !== userId) {
    if (tokenUser?.email) {
      const owner = await prisma.user.findUnique({ where: { id: transaction.userId } });
      if (owner?.email === tokenUser.email) {
        // allow (same email but different internal user record)
      } else {
        throw new Error("You do not have permission to delete this transaction.");
      }
    } else {
      throw new Error("You do not have permission to delete this transaction.");
    }
  }

  const deleted = await prisma.transaction.delete({
    where: { id: args.id },
  });

  return {
    ...deleted,
    amount_cents: Math.round((deleted.amount ?? 0) * 100),
    type: (deleted.amount ?? 0) >= 0 ? "income" : "expense",
    date: deleted.date instanceof Date ? deleted.date.toISOString() : deleted.date,
  };
}
