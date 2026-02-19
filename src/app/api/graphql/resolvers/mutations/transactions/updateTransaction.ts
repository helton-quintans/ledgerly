import { prisma } from "@/lib/prisma";
import { UpdateTransactionInput } from "../../../schema/types/transaction.types";

export async function updateTransaction(
  _: unknown,
  args: UpdateTransactionInput,
  context: { user?: { id: string } }
) {
  const userId = context?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated. Please log in to edit transactions.");
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: args.id },
  });

  if (!transaction) {
    throw new Error("Transaction not found.");
  }

  if (transaction.userId !== userId) {
    throw new Error("You do not have permission to edit this transaction.");
  }

  const { id, ...data } = args;
  if (data.date) {
    data.date = new Date(data.date).toISOString();
  }

  return await prisma.transaction.update({
    where: { id },
    data,
  });
}
