"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { createTransaction } from "@/lib/transactions";
import { ArrowDown, ArrowUp, Plus } from "lucide-react";
import { useState } from "react";

type Props = {
  onSaved?: () => void;
};

export default function TransactionFormModal({ onSaved }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [currency, setCurrency] = useState<string>("USD");

  async function save() {
    const raw = amount.replace(/[^0-9.,-]/g, "").replace(",", ".");
    const val = Number.parseFloat(raw);
    if (isNaN(val)) return;

    await createTransaction({
      type,
      amount: Math.abs(val),
      currency,
      date: new Date().toISOString(),
      category: category || "Uncategorized",
      description,
    });

    setOpen(false);
    setDescription("");
    setAmount("");
    setCategory("");
    setType("income");
    setCurrency("USD");
    onSaved?.();
  }

  const trigger = (
    <Button onClick={() => setOpen(true)} variant="default">
      <Plus className="size-4" />
      New transaction
    </Button>
  );

  const content = (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>New transaction</DialogTitle>
      </DialogHeader>
      <div className="grid gap-2">
        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Input
          placeholder="Amount"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Input
          placeholder="Category / Label"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <div className="flex items-center gap-2">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="rounded border px-2 py-1"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="BRL">BRL</option>
          </select>

          <div className="flex-1">
            <div className="flex w-full rounded-md bg-muted p-1">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded ${type === "income" ? "bg-green-200 text-green-800" : "text-green-600"}`}
                onClick={() => setType("income")}
              >
                <ArrowUp className="size-4" />
                <span>In</span>
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded ${type === "expense" ? "bg-red-200 text-red-800" : "text-red-600"}`}
                onClick={() => setType("expense")}
              >
                <ArrowDown className="size-4" />
                <span>Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button onClick={save}>Save</Button>
      </DialogFooter>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side="bottom" className="p-4">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
}
