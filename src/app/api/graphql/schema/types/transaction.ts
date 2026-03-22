export const transactionType = `
  type Transaction {
    id: ID!
    amount: Float!
    currency: String!
    date: String!
    category: String!
    description: String
    userId: String!
  }
`;

export const transactionPageType = `
  type TransactionPage {
    transactions: [Transaction!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }
`;

export const transactionQueries = `
  transactions(
    year: Int
    currency: String
    quickFilter: String
    page: Int = 1
    pageSize: Int = 10
  ): TransactionPage!
`;

export const transactionMutations = `
  createTransaction(
    amount: Float!
    currency: String!
    date: String!
    category: String!
    description: String
  ): Transaction!
`;
