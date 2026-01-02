"use client";

import React, { useEffect, useState } from "react";
import QuickAdd from "@/components/transactions/QuickAdd";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import { listTransactions, deleteTransaction, Transaction } from "@/lib/transactions";
import { Eye, EyeOff } from "lucide-react";

export default function Home() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [hidden, setHidden] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<string>("USD");

  async function load() {
    const data = await listTransactions();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  // mock conversion rates to USD (1 unit of currency = x USD)
  const rateToUSD: Record<string, number> = { USD: 1, EUR: 1.08, BRL: 0.19 };

  function convert(amount: number, from: string | undefined, to: string) {
    const f = rateToUSD[from || "USD"] ?? 1;
    const t = rateToUSD[to] ?? 1;
    return (amount * f) / t;
  }

  const incomes = items.reduce((acc, it) => acc + (it.type === "income" ? convert(it.amount, it.currency, displayCurrency) : 0), 0);
  const expenses = items.reduce((acc, it) => acc + (it.type === "expense" ? convert(it.amount, it.currency, displayCurrency) : 0), 0);
  const balance = incomes - expenses;
  const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: displayCurrency || "USD" });

  return (
    <main className="p-6">
        <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-md border p-4 relative">
            <div className="flex flex-col items-center w-full text-center">
              <h3 className="text-sm font-medium">Current Balance</h3>
              <div className="text-2xl font-semibold mt-1">{hidden ? "......" : fmt.format(balance)}</div>

              <div className="flex items-center gap-6 mt-3">
                <div>
                  <div className="text-xs text-muted-foreground">In</div>
                  <div className="text-green-600 font-semibold">{hidden ? "......" : fmt.format(incomes)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Out</div>
                  <div className="text-red-600 font-semibold">{hidden ? "......" : fmt.format(expenses)}</div>
                </div>
              </div>
            </div>

            <div className="absolute top-2 right-2 flex items-center gap-2">
              <select value={displayCurrency} onChange={(e) => setDisplayCurrency(e.target.value)} className="rounded border px-2 py-1 text-sm">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="BRL">BRL</option>
              </select>
              <button aria-label="Toggle balance visibility" onClick={() => setHidden((s) => !s)} className="p-1 rounded hover:bg-muted">
                {hidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <QuickAdd onCreated={load} />
          <TransactionsTable
            items={items}
            onEdit={(t) => console.log("edit", t.id)}
            onDelete={async (id) => {
              await deleteTransaction(id);
              load();
            }}
          />
        </section>

        <aside className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="text-sm font-medium">Resumo</h3>
            <div className="text-sm text-muted-foreground">Receitas e despesas recentes</div>
          </div>
        </aside>
      </div>
    </main>
  );
}
