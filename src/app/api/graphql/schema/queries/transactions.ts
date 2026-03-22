export const transactionQueries = `
  transactions(
    year: Int
    currency: String
    quickFilter: String
    page: Int
    pageSize: Int
  ): TransactionPage
`;
