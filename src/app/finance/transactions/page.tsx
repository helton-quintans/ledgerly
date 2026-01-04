"use client";

import CurrencySelector from "@/components/transactions/CurrencySelector";
import Summary from "@/components/transactions/Summary";
import TransactionFormModal from "@/components/transactions/TransactionFormModal";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import type { Currency } from "@/lib/schemas/transaction";
import {
  type Transaction,
  deleteTransaction,
  listTransactions,
} from "@/lib/transactions";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [hidden, setHidden] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("USD");

  async function load() {
    const data = await listTransactions();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  // mock conversion rates to USD (1 unit of currency = x USD)
  const rateToUSD: Record<Currency, number> = { USD: 1, EUR: 1.08, BRL: 0.19 };

  function convert(amount: number, from: Currency | undefined, to: Currency) {
    const f = rateToUSD[from || "USD"] ?? 1;
    const t = rateToUSD[to] ?? 1;
    return (amount * f) / t;
  }

  const incomes = items.reduce((acc, it) => {
    if (it.type !== "income") return acc;
    // if there's a converted snapshot matching displayCurrency, use it
    if (
      it.converted_currency === displayCurrency &&
      typeof it.converted_amount_cents === "number"
    ) {
      return acc + (it.converted_amount_cents || 0) / 100;
    }
    return (
      acc +
      convert(
        (it.amount_cents || 0) / 100,
        it.currency as Currency | undefined,
        displayCurrency,
      )
    );
  }, 0);

  const expenses = items.reduce((acc, it) => {
    if (it.type !== "expense") return acc;
    if (
      it.converted_currency === displayCurrency &&
      typeof it.converted_amount_cents === "number"
    ) {
      return acc + (it.converted_amount_cents || 0) / 100;
    }
    return (
      acc +
      convert(
        (it.amount_cents || 0) / 100,
        it.currency as Currency | undefined,
        displayCurrency,
      )
    );
  }, 0);
  const balance = incomes - expenses;
  const fmt = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: displayCurrency || "USD",
  });

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex items-center justify-end gap-2 mb-3">
          <CurrencySelector
            value={displayCurrency}
            onChange={(v) => setDisplayCurrency(v)}
          />
          <button
            aria-label="Toggle balance visibility"
            onClick={() => setHidden((s) => !s)}
            className="p-1 rounded hover:bg-muted"
          >
            {hidden ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <Summary
          incomes={incomes}
          expenses={expenses}
          balance={balance}
          hidden={hidden}
          fmt={(v) => fmt.format(v)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-md border p-4 relative">
            <div className="mb-4">
              <div className="flex gap-2 justify-end">
                <TransactionFormModal onSaved={load} />
              </div>
            </div>
            <TransactionsTable
              items={items}
              onEdit={(t) => console.log("edit", t.id)}
              onDelete={async (id) => {
                await deleteTransaction(id);
                load();
              }}
            />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="text-sm font-medium">Resumo</h3>
            <div className="text-sm text-muted-foreground">
              Receitas e despesas recentes
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
