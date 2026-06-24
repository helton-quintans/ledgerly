export type TransactionArgs = {
  year?: number;
  currency?: string;
  quickFilter?: string;
  page?: number;
  pageSize?: number;
};

export type CreateTransactionInput = {
  amount: number;
  currency: string;
  date: string;
  category: string;
  description?: string;
};

export type DeleteTransactionInput = {
  id: string;
};

export type UpdateTransactionInput = {
  id: string;
  amount?: number;
  currency?: string;
  date?: string;
  category?: string;
  description?: string;
};
