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
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [hidden, setHidden] = useState(false);
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("USD");

  const load = useCallback(async () => {
    const data = await listTransactions();
    setItems(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-bold text-2xl">Transactions</h1>
        <div className="mb-3 flex items-center justify-end gap-2">
          <CurrencySelector
            value={displayCurrency}
            onChange={(v) => setDisplayCurrency(v)}
          />
          <button
            type="button"
            aria-label="Toggle balance visibility"
            onClick={() => setHidden((s) => !s)}
            className="rounded p-1 hover:bg-muted"
          >
            {hidden ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
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

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section className="space-y-4 lg:col-span-2">
          <div className="relative rounded-md border p-4">
            <div className="mb-4">
              <div className="flex justify-end gap-2">
                <TransactionFormModal
                  onSaved={() => {
                    load();
                    setEditing(null);
                  }}
                  transaction={editing}
                  onClose={() => setEditing(null)}
                />
              </div>
            </div>
            <TransactionsTable
              items={items}
              onEdit={(t) => setEditing(t)}
              onDelete={async (id) => {
                await deleteTransaction(id);
                load();
              }}
            />
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-md border p-4">
            <h3 className="font-medium text-sm">Resumo</h3>
            <div className="text-muted-foreground text-sm">
              Receitas e despesas recentes
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
