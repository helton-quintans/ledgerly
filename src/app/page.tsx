"use client";

import React, { useEffect, useState } from "react";
import QuickAdd from "@/components/transactions/QuickAdd";
import TransactionDrawer from "@/components/transactions/TransactionDrawer";
import TransactionsTable from "@/components/transactions/TransactionsTable";
import { listTransactions, deleteTransaction, Transaction } from "@/lib/transactions";

export default function Home() {
  const [items, setItems] = useState<Transaction[]>([]);

  async function load() {
    const data = await listTransactions();
    setItems(data);
  }

  useEffect(() => {
    load();
  }, []);

  const balance = items.reduce((acc, it) => acc + (it.type === "income" ? it.amount : -it.amount), 0);
  const incomes = items.reduce((acc, it) => acc + (it.type === "income" ? it.amount : 0), 0);
  const expenses = items.reduce((acc, it) => acc + (it.type === "expense" ? it.amount : 0), 0);
  const fmt = new Intl.NumberFormat(undefined, { style: "currency", currency: items[0]?.currency || "USD" });

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Ledgerly</h1>
        <TransactionDrawer onSaved={load} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2 space-y-4">
          <div className="rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Current Balance</h3>
                <div className="text-2xl font-semibold">{fmt.format(balance)}</div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">In</div>
                  <div className="text-green-600 font-semibold">{fmt.format(incomes)}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Out</div>
                  <div className="text-red-600 font-semibold">{fmt.format(expenses)}</div>
                </div>
              </div>
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
