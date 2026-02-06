"use client";

import CurrencySelector from "@/components/transactions/CurrencySelector";
import DateFilter from "@/components/transactions/DateFilter";
import Summary from "@/components/transactions/Summary";
import TransactionsList from "@/components/transactions/TransactionsList";
import { Separator } from "@/components/ui/separator";
import type { Currency } from "@ledgerly/schemas";
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
  const [dateFilter, setDateFilter] = useState<{
    year: number | null;
    month: number | null;
    preset: "all" | "this-month" | "last-month" | "this-year" | "custom";
  }>({ 
    year: new Date().getFullYear(), 
    month: null, 
    preset: "this-year" 
  });

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

  // Filter items based on date filter
  const filteredItems = items.filter(item => {
    if (dateFilter.preset === "all") return true;
    
    const itemDate = new Date(item.date);
    const itemYear = itemDate.getFullYear();
    const itemMonth = itemDate.getMonth();
    
    // Year filter
    if (dateFilter.year && itemYear !== dateFilter.year) return false;
    
    // Month filter
    if (dateFilter.month !== null && itemMonth !== dateFilter.month) return false;
    
    return true;
  });

  const incomes = filteredItems.reduce((acc, it) => {
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

  const expenses = filteredItems.reduce((acc, it) => {
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex items-center justify-end gap-2">
          <CurrencySelector
            value={displayCurrency}
            onChange={(v) => setDisplayCurrency(v)}
          />
          <button
            type="button"
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
      
      <Separator className="mb-6" />
      
      <div className="mb-6">
        <DateFilter
          transactions={items}
          filter={dateFilter}
          onChange={setDateFilter}
        />
      </div>

      <Separator className="mb-6" />

      <TransactionsList
        items={filteredItems}
        displayCurrency={displayCurrency}
        editing={editing}
        onSaved={() => {
          load();
          setEditing(null);
        }}
        onClose={() => setEditing(null)}
        onEdit={(t) => setEditing(t)}
        onDelete={async (id) => {
          await deleteTransaction(id);
          load();
        }}
      />
    </main>
  );
}
