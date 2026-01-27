function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount_cents: number;
  currency?: import("../../packages/schemas/transaction").Currency;
  // optional converted snapshot (stored at creation time)
  converted_amount_cents?: number;
  converted_currency?: import("../../packages/schemas/transaction").Currency;
  exchange_rate?: number;
  rate_timestamp?: string;
  date: string;
  category: string;
  description?: string;
};

// mock conversion rates to USD
const rateToUSD: Record<import("../../packages/schemas/transaction").Currency, number> = {
  USD: 1,
  EUR: 1.08,
  BRL: 0.19,
};

let items: Transaction[] = [
  {
    id: generateId(),
    type: "income",
    amount_cents: 2500 * 100,
    currency: "USD",
    converted_amount_cents: Math.round(2500 * 100 * (rateToUSD.USD ?? 1)),
    converted_currency: "USD",
    exchange_rate: rateToUSD.USD,
    rate_timestamp: new Date().toISOString(),
    date: new Date().toISOString(),
    category: "Salary",
    description: "Monthly salary",
  },
  {
    id: generateId(),
    type: "expense",
    amount_cents: Math.round(45.5 * 100),
    currency: "USD",
    converted_amount_cents: Math.round(45.5 * 100 * (rateToUSD.USD ?? 1)),
    converted_currency: "USD",
    exchange_rate: rateToUSD.USD,
    rate_timestamp: new Date().toISOString(),
    date: new Date().toISOString(),
    category: "Food",
    description: "Lunch",
  },
];

export async function listTransactions(): Promise<Transaction[]> {
  // simulate latency
  await new Promise((r) => setTimeout(r, 100));
  return [...items].sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function createTransaction(input: Omit<Transaction, "id">) {
  const t: Transaction = { id: generateId(), ...input };
  items = [t, ...items];
  await new Promise((r) => setTimeout(r, 100));
  return t;
}

export async function updateTransaction(
  id: string,
  patch: Partial<Transaction>,
) {
  items = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
  await new Promise((r) => setTimeout(r, 100));
  const updated = items.find((i) => i.id === id);
  if (!updated) {
    throw new Error(`Transaction ${id} not found after update.`);
  }
  return updated;
}

export async function deleteTransaction(id: string) {
  items = items.filter((it) => it.id !== id);
  await new Promise((r) => setTimeout(r, 100));
  return true;
}
