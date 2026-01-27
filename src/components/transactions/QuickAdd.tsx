"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Currency } from "@ledgerly/schemas/transaction";
import { createTransaction } from "@/lib/transactions";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function TypeToggle({
  value,
  onChange,
}: {
  value: "income" | "expense";
  onChange: (v: "income" | "expense") => void;
}) {
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
  const [currency, setCurrency] = useState<Currency>("USD");

  async function handleCreate() {
    const raw = amount.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const val = Number.parseFloat(raw);
    if (Number.isNaN(val)) return;
    const amount_cents = Math.round(Math.abs(val) * 100);
    const rateToUSD: Record<Currency, number> = {
      USD: 1,
      EUR: 1.08,
      BRL: 0.19,
    };
    const converted_amount_cents = Math.round(
      amount_cents * (rateToUSD[currency] ?? 1),
    );
    try {
      const t = await createTransaction({
        type,
        amount_cents,
        currency,
        converted_amount_cents,
        converted_currency: "USD",
        exchange_rate: rateToUSD[currency] ?? 1,
        rate_timestamp: new Date().toISOString(),
        date: new Date().toISOString(),
        category: "Quick",
        description: desc,
      });
      setAmount("");
      setDesc("");
      onCreated(t.id);
      toast.success("Transaction added", {
        icon: <CheckCircle style={{ color: "var(--success)" }} />,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to add transaction", {
        icon: <XCircle style={{ color: "var(--destructive)" }} />,
      });
    }
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 justify-center w-full">
          <TypeToggle value={type} onChange={setType} />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="rounded border px-2 py-1"
          >
            <option value="USD">USD</option>
            <option value="BRL">BRL</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Input
            inputMode="decimal"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-40"
          />
          <Input
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div>
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
