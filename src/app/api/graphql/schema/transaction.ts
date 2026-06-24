import { createTransactionMutation } from "./mutations/transactions/createTransaction";
import { deleteTransactionMutation } from "./mutations/transactions/deleteTransaction";
import { updateTransactionMutation } from "./mutations/transactions/updateTransaction";
import {
  transactionPageType,
  transactionQueries,
  transactionType,
} from "./types/transaction";

export const transactionSchema = `#graphql
  ${transactionType}
  ${transactionPageType}

  type Query {
    ${transactionQueries}
  }

  type Mutation {
    ${createTransactionMutation}
    ${deleteTransactionMutation}
    ${updateTransactionMutation}
  }
`;
