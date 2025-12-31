function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`;
}

export type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  currency?: string;
  date: string;
  category: string;
  description?: string;
};

let items: Transaction[] = [
  {
    id: generateId(),
    type: "income",
    amount: 2500,
    currency: "USD",
    date: new Date().toISOString(),
    category: "Salary",
    description: "Monthly salary",
  },
  {
    id: generateId(),
    type: "expense",
    amount: 45.5,
    currency: "USD",
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

export async function updateTransaction(id: string, patch: Partial<Transaction>) {
  items = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
  await new Promise((r) => setTimeout(r, 100));
  return items.find((i) => i.id === id)!;
}

export async function deleteTransaction(id: string) {
  items = items.filter((it) => it.id !== id);
  await new Promise((r) => setTimeout(r, 100));
  return true;
}
