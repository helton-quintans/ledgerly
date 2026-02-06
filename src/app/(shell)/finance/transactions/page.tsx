"use client";

import CurrencySelector from "@/components/transactions/CurrencySelector";
import DateFilter from "@/components/transactions/DateFilter";
import TransactionFormModal from "@/components/transactions/TransactionFormModal";
import TransactionsList from "@/components/transactions/TransactionsList";
import type { Currency } from "@ledgerly/schemas";
import {
  type Transaction,
  deleteTransaction,
  listTransactions,
} from "@/lib/transactions";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [editing, setEditing] = useState<Transaction | null>(null);
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

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex items-center justify-end gap-2">
          <CurrencySelector
            value={displayCurrency}
            onChange={(v) => setDisplayCurrency(v)}
          />
        </div>
      </div>

      <div className="mb-6">
        <DateFilter
          transactions={items}
          filter={dateFilter}
          onChange={setDateFilter}
        />
      </div>

      <div className="rounded-md border p-4 relative">
        <div className="mb-4">
          <div className="flex gap-2 justify-end">
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
        <TransactionsList
          items={filteredItems}
          displayCurrency={displayCurrency}
          onEdit={(t) => setEditing(t)}
          onDelete={async (id) => {
            await deleteTransaction(id);
            load();
          }}
        />
      </div>
    </main>
  );
}
