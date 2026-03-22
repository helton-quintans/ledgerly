import { prisma } from "@/lib/prisma";
import { UpdateTransactionInput } from "../../../schema/types/transaction.types";

export async function updateTransaction(
  _: unknown,
  args: UpdateTransactionInput,
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
    throw new Error("User not authenticated. Please log in to edit transactions.");
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
        throw new Error("You do not have permission to edit this transaction.");
      }
    } else {
      throw new Error("You do not have permission to edit this transaction.");
    }
  }

  const { id, ...data } = args;
  const updateData: Record<string, unknown> = { ...data };
  if (data.date) {
    const dstr = data.date as string;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dstr)) {
      const [y, m, d] = dstr.split("-").map(Number);
      updateData.date = new Date(y, m - 1, d);
    } else {
      updateData.date = new Date(dstr);
    }
  }

  const updated = await prisma.transaction.update({
    where: { id },
    data: updateData,
  });

  return {
    ...updated,
    amount_cents: Math.round((updated.amount ?? 0) * 100),
    type: (updated.amount ?? 0) >= 0 ? "income" : "expense",
    date: updated.date instanceof Date ? updated.date.toISOString() : updated.date,
  };
}
