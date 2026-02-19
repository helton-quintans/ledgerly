export const createTransactionMutation = `
  createTransaction(
    amount: Float!
    currency: String!
    date: String!
    category: String!
    description: String
  ): Transaction!
`;
