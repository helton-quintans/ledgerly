export const updateTransactionMutation = `
  updateTransaction(
    id: String!
    amount: Float
    currency: String
    date: String
    category: String
    description: String
  ): Transaction!
`;
