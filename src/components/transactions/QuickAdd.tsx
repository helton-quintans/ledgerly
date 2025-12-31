"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createTransaction } from "@/lib/transactions";

function TypeToggle({ value, onChange }: { value: "income" | "expense"; onChange: (v: "income" | "expense") => void }) {
  return (
    <div className="inline-flex rounded-md bg-muted p-1">
      <button
        type="button"
        className={`px-3 py-1 rounded ${value === "income" ? "bg-primary text-primary-foreground" : ""}`}
        onClick={() => onChange("income")}
      >
        In
      </button>
      <button
        type="button"
        className={`px-3 py-1 rounded ${value === "expense" ? "bg-destructive text-destructive-foreground" : ""}`}
        onClick={() => onChange("expense")}
      >
        Out
      </button>
    </div>
  );
}

type Props = {
  onCreated: (id: string) => void;
};

export default function QuickAdd({ onCreated }: Props) {
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [currency, setCurrency] = useState<string>("USD");

  async function handleCreate() {
    const raw = amount.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const val = parseFloat(raw);
    if (isNaN(val)) return;
    const t = await createTransaction({
      type,
      amount: Math.abs(val),
      currency,
      date: new Date().toISOString(),
      category: "Quick",
      description: desc,
    });
    setAmount("");
    setDesc("");
    onCreated(t.id);
  }

  return (
    <div className="flex items-center gap-2">
      <TypeToggle value={type} onChange={setType} />
      <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="rounded border px-2 py-1">
        <option value="USD">USD</option>
        <option value="BRL">BRL</option>
        <option value="EUR">EUR</option>
      </select>
      <Input inputMode="decimal" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-40" />
      <Input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <Button onClick={handleCreate}>Add</Button>
    </div>
  );
}
