import { prisma } from "@/lib/prisma";
import type { CreateTransactionInput } from "../../../schema/types/transaction.types";

export async function createTransaction(
  _: unknown,
  args: CreateTransactionInput,
  context: { user?: { sub?: string; id?: string; email?: string } },
) {
  const { amount, currency, date, category, description } = args;

  const tokenUser = context?.user;

  // Resolve application `userId` safely:
  // 1) prefer matching User.id === token.sub
  // 2) then match by email if present
  // 3) finally try to find Account with providerAccountId == token.sub
  let userId: string | undefined = undefined;

  if (tokenUser?.sub) {
    const u = await prisma.user.findUnique({ where: { id: tokenUser.sub } });
    if (u) userId = u.id;
  }

  if (!userId && tokenUser?.email) {
    const uByEmail = await prisma.user.findUnique({
      where: { email: tokenUser.email },
    });
    if (uByEmail) userId = uByEmail.id;
  }

  if (!userId && tokenUser?.sub) {
    const acct = await prisma.account.findFirst({
      where: { providerAccountId: tokenUser.sub },
    });
    if (acct) userId = acct.userId;
  }

  if (!userId) {
    throw new Error(
      "User not authenticated. Please log in to create transactions.",
    );
  }

  const allowedCurrencies = ["BRL", "USD", "EUR"] as const;
  if (!allowedCurrencies.includes(currency as any)) {
    throw new Error(`Invalid currency: ${currency}`);
  }

  const created = await prisma.transaction.create({
    data: {
      amount,
      currency: currency as any,
      date: ((): Date => {
        // Accept both ISO strings and plain YYYY-MM-DD. For YYYY-MM-DD, construct
        // a local Date to avoid timezone shifting to previous day.
        if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
          const [y, m, d] = date.split("-").map(Number);
          return new Date(y, m - 1, d);
        }
        return new Date(date as string);
      })(),
      category,
      description,
      userId,
    },
  });

  return {
    ...created,
    amount_cents: Math.round((created.amount ?? 0) * 100),
    type: (created.amount ?? 0) >= 0 ? "income" : "expense",
    date:
      created.date instanceof Date ? created.date.toISOString() : created.date,
  };
}
