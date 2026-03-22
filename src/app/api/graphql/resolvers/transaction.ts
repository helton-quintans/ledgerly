import { transactions } from "./queries/transactions/index";
import { createTransaction } from "./mutations/transactions/createTransaction";
import { deleteTransaction } from "./mutations/transactions/deleteTransaction";
import { updateTransaction } from "./mutations/transactions/updateTransaction";

export const transactionResolvers = {
  Query: {
    transactions,
  },
  Mutation: {
    createTransaction,
    deleteTransaction,
    updateTransaction,
  },
};
