"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createTransaction, updateTransaction, Transaction } from "@/lib/transactions";

type Props = {
  initial?: Partial<Transaction>;
  onSaved?: () => void;
};

export default function TransactionDrawer({ initial = {}, onSaved }: Props) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(initial.amount || ""));
  const [desc, setDesc] = useState(initial.description || "");
  const [currency, setCurrency] = useState<string>((initial as any).currency || "USD");

  async function save() {
    const val = parseFloat(amount);
    if (isNaN(val)) return;
    if (initial.id) {
      await updateTransaction(initial.id, { amount: Math.abs(val), description: desc, currency });
    } else {
      await createTransaction({
        type: val >= 0 ? "income" : "expense",
        amount: Math.abs(val),
        currency,
        date: new Date().toISOString(),
        category: "Manual",
        description: desc,
      });
    }
    setOpen(false);
    onSaved?.();
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button onClick={() => setOpen(true)}>New Transaction</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[520px]">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">New Transaction</h3>
          <div className="space-y-2">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="rounded border px-2 py-1">
              <option value="USD">USD</option>
              <option value="BRL">BRL</option>
              <option value="EUR">EUR</option>
            </select>
            <Input inputMode="decimal" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <Input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setOpen(false)} className="mr-2">Cancel</Button>
            <Button onClick={save}>Save</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
