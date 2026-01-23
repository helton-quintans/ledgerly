export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount_cents: number;
  amount?: number;
  currency?: import("./schemas/transaction").Currency;
  // optional converted snapshot (stored at creation time)
  converted_amount_cents?: number;
  converted_currency?: import("./schemas/transaction").Currency;
  exchange_rate?: number;
  rate_timestamp?: string;
  date: string;
  category: string;
  description?: string;
};

export async function listTransactions(): Promise<Transaction[]> {
  const response = await fetch("/api/transactions", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch transactions");
  }

  return response.json();
}

export async function createTransaction(input: Omit<Transaction, "id">) {
  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Failed to create transaction");
  }

  return response.json();
}

export async function updateTransaction(
  id: string,
  patch: Partial<Transaction>,
) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(patch),
  });

  if (!response.ok) {
    throw new Error("Failed to update transaction");
  }

  return response.json();
}

export async function deleteTransaction(id: string) {
  const response = await fetch(`/api/transactions/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete transaction");
  }

  return response.json();
}
