import { prisma } from "@/lib/prisma";
import { DeleteTransactionInput } from "../../../schema/types/transaction.types";

export async function deleteTransaction(
  _: unknown,
  args: DeleteTransactionInput,
  context: { user?: { id: string } }
) {
  const userId = context?.user?.id;
  if (!userId) {
    throw new Error("User not authenticated. Please log in to delete transactions.");
  }

  const transaction = await prisma.transaction.findUnique({
    where: { id: args.id },
  });

  if (!transaction) {
    throw new Error("Transaction not found.");
  }

  if (transaction.userId !== userId) {
    throw new Error("You do not have permission to delete this transaction.");
  }

  return await prisma.transaction.delete({
    where: { id: args.id },
  });
}
