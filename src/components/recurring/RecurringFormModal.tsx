"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import * as recurringClient from "@/services/recurringClient";
import CurrencySelector from "@/components/transactions/CurrencySelector";
import CategorySelector from "@/components/transactions/CategorySelector";
import { DatePicker } from "@/components/ui/date-picker";
import { NumericFormat } from "react-number-format";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, Coins, DollarSign, FileText, Tag, TrendingUp, Calendar as CalendarIcon } from "lucide-react";

type Props = {
  onSaved?: () => void;
  initial?: any | null;
  trigger?: React.ReactNode;
};

export default function RecurringFormModal({ onSaved, initial = null, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({
    amount: initial?.amount ?? 0,
    currency: initial?.currency ?? "USD",
    frequency: initial?.frequency ?? "MONTHLY",
    interval: initial?.interval ?? 1,
    description: initial?.description ?? "",
    category: initial?.category ?? "Other",
    type: initial?.type ?? "income",
    startDate: initial?.startDate ?? undefined,
  });

  useEffect(() => {
    if (initial) setForm((s:any) => ({ ...s, ...initial }));
  }, [initial]);

  const currencySymbolMap: Record<string, string> = { USD: "$", EUR: "€", BRL: "R$" };

  async function save() {
    try {
      const { id, amount, currency, frequency, interval, description, category, type, startDate, endDate, daysOfWeek, dayOfMonth, active } = form;
      if (initial?.id) {
        await recurringClient.updateRecurring({ id, amount, currency, frequency, interval, description, category, type, startDate, endDate, daysOfWeek, dayOfMonth, active });
        toast.success("Recurring updated");
      } else {
        await recurringClient.createRecurring({ amount, currency, frequency, interval, description, category, type, startDate, endDate, daysOfWeek, dayOfMonth });
        toast.success("Recurring created");
      }
      setOpen(false);
      onSaved?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save recurring");
    }
  }

  const defaultTrigger = (
    <Button onClick={() => setOpen(true)} variant="default" className="shadow-lg font-medium">
      <PlusIcon />
      New recurring
    </Button>
  );

  const renderTrigger = trigger ?? defaultTrigger;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {renderTrigger && <DialogTrigger asChild>{renderTrigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initial ? "Edit recurring" : "New recurring"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Coins className="size-4" />
              Currency
            </Label>
            <CurrencySelector value={form.currency} onChange={(v) => setForm({ ...form, currency: v })} className="w-full h-10" />
          </div>

          <div className="mt-2 w-full">
            <label className="w-full flex text-sm font-medium mb-2">
              <CalendarIcon className="size-4 mr-2" />
              Start date
            </label>
            <DatePicker
              value={form.startDate ? new Date(form.startDate) : undefined}
              onChange={(d) => setForm({ ...form, startDate: d ? d.toISOString() : undefined })}
              className="w-full h-10 justify-center text-center gap-2"
            />
          </div>

          <div className="relative space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="size-4" />
              Amount
            </Label>
            <NumericFormat
              customInput={Input}
              thousandSeparator={","}
              decimalSeparator={"."}
              decimalScale={2}
              allowNegative={false}
              prefix={currencySymbolMap[form.currency] || ""}
              value={form.amount}
              onValueChange={(v) => setForm({ ...form, amount: v.floatValue ?? 0 })}
              className="h-10"
            />
          </div>

          <div className="relative space-y-2">
            <Label className="flex items-center gap-2">
              <FileText className="size-4" />
              Description
            </Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="h-10" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Tag className="size-4" />
              Category
            </Label>
            <CategorySelector value={form.category} onChange={(v) => setForm({ ...form, category: v })} className="w-full h-10" />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Type
            </Label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-3 rounded h-10 cursor-pointer border ${form.type === "income" ? "bg-success/20 text-success border-success/30" : "text-success border-neutral-200"}`}
                onClick={() => setForm({ ...form, type: "income" })}
              >
                <ArrowUp className="size-4" />
                <span>In</span>
              </button>

              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-3 rounded h-10 cursor-pointer border ${form.type === "expense" ? "bg-destructive/20 text-destructive border-destructive/30" : "text-destructive border-neutral-200"}`}
                onClick={() => setForm({ ...form, type: "expense" })}
              >
                <ArrowDown className="size-4" />
                <span>Out</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Frequency</Label>
              <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v })}>
                <SelectTrigger className="w-full" size="default">
                  <SelectValue>{form.frequency}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DAILY">Daily</SelectItem>
                  <SelectItem value="WEEKLY">Weekly</SelectItem>
                  <SelectItem value="MONTHLY">Monthly</SelectItem>
                  <SelectItem value="YEARLY">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Interval</Label>
              <Select value={String(form.interval)} onValueChange={(v) => setForm({ ...form, interval: Number(v) })}>
                <SelectTrigger className="w-full" size="default">
                  <SelectValue>{String(form.interval)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }).map((_, i) => {
                    const val = String(i + 1);
                    return (
                      <SelectItem key={val} value={val}>
                        {val}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-1 flex flex-row justify-end gap-2 sm:justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={save}>{initial ? "Save" : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14"/></svg>
  );
}
