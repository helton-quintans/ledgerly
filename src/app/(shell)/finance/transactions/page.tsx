"use client";

import CurrencySelector from "@/components/transactions/CurrencySelector";
import DateFilter from "@/components/transactions/DateFilter";
import Summary from "@/components/transactions/Summary";
import TransactionsList from "@/components/transactions/TransactionsList";
import { Card, CardContent } from "@/components/ui/card";
import { useTransactions } from "@/contexts/TransactionsContext";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [hidden, setHidden] = useState(false);

  const {
    transactions,
    filteredTransactions,
    dateFilter,
    displayCurrency,
    incomes,
    expenses,
    balance,
    formatCurrency,
    editing,
    setDateFilter,
    setDisplayCurrency,
    setEditing,
    deleteTransaction,
    refreshTransactions,
  } = useTransactions();

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <div className="flex items-center justify-end gap-2">
          <CurrencySelector
            value={displayCurrency}
            onChange={setDisplayCurrency}
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

      <Summary
        incomes={incomes}
        expenses={expenses}
        balance={balance}
        hidden={hidden}
        fmt={(v) => formatCurrency(v)}
      />

      <Card className="mb-6">
        <CardContent>
          <DateFilter
            transactions={transactions}
            filter={dateFilter}
            onChange={setDateFilter}
          />
        </CardContent>
      </Card>


      <TransactionsList
        items={filteredTransactions}
        displayCurrency={displayCurrency}
        editing={editing}
        onSaved={() => {
          refreshTransactions();
          setEditing(null);
        }}
        onClose={() => setEditing(null)}
        onEdit={(t) => setEditing(t)}
        onDelete={deleteTransaction}
      />
    </main>
  );
}
