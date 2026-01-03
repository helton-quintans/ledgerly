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
import { ArrowDown, ArrowUp, Plus,FileText, Tag, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import CurrencySelector from "@/components/transactions/CurrencySelector";
import { useState, useEffect } from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import transactionFormSchema, { TransactionFormValues } from "@/lib/schemas/transaction";
import { NumericFormat } from "react-number-format";
import type { Currency } from "@/lib/schemas/transaction";

type Props = {
  onSaved?: () => void;
};

export default function TransactionFormModal({ onSaved }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema) as any,
    defaultValues: {
      description: "",
      // `amount` is stored as integer cents by the schema preprocess — keep input empty initially
      amount: undefined as unknown as number,
      category: "",
      type: "income",
      currency: "USD" as Currency,
      date: undefined,
    } as any,
  });

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue, clearErrors, setError, control } = form;

  const watchedCurrency = (watch("currency") || "USD") as Currency;

  async function onSubmit(values: TransactionFormValues) {
    // values.amount is the integer cents thanks to the zod preprocess
    const amount_cents = Math.abs(values.amount as number);

    // mock rates to USD
    const rateToUSD: Record<string, number> = { USD: 1, EUR: 1.08, BRL: 0.19 };
    const exchange_rate = (rateToUSD[values.currency] ?? 1) / (rateToUSD["USD"] ?? 1);
    const converted_amount_cents = Math.round(amount_cents * (rateToUSD[values.currency] ?? 1));
    const rate_timestamp = new Date().toISOString();

    try {
      await createTransaction({
        type: values.type,
        amount_cents,
        currency: values.currency,
        converted_amount_cents,
        converted_currency: "USD",
        exchange_rate,
        rate_timestamp,
        date: values.date ?? new Date().toISOString(),
        category: values.category || "Uncategorized",
        description: values.description || "",
      });

      toast.success("Transaction created", {
        icon: <CheckCircle style={{ color: 'var(--success)' }} />,
      });
      reset();
      setOpen(false);
      onSaved?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create transaction", {
        icon: <XCircle style={{ color: 'var(--destructive)' }} />,
      });
    }
  }

  const trigger = (
    <Button onClick={() => setOpen(true)} variant="default">
      <Plus className="size-4" />
      New transaction
    </Button>
  );

  const currencySymbolMap: Record<Currency, string> = { USD: "$", EUR: "€", BRL: "R$" };

  useEffect(() => {
    // clear validation messages when modal opens
    if (open) {
      clearErrors();
      reset();
    }
  }, [open, clearErrors]);

  const content = (
    <div>
      <DialogHeader>
        <DialogTitle>New transaction</DialogTitle>
      </DialogHeader>

      <div className="flex justify-center items-center gap-2 my-2">
        <CurrencySelector value={watchedCurrency} onChange={(v) => setValue("currency", v)} />
      </div>

      <div className="grid gap-3 py-2">
        <div className="relative">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <NumericFormat
                {...field}
                customInput={Input}
                thousandSeparator={watchedCurrency === "BRL" ? "." : ","}
                decimalSeparator={watchedCurrency === "BRL" ? "," : "."}
                decimalScale={2}
                allowNegative={false}
                prefix={currencySymbolMap[watchedCurrency] || ""}
                onValueChange={(values) => {
                  const raw = values.value ?? "";
                  const normalized = String(raw).replace(/,/g, ".").replace(/[^0-9.]/g, "");
                  field.onChange(normalized);
                  clearErrors("amount");
                }}
                className="pl-9"
              />
            )}
          />
          <div className="absolute left-2 top-2 text-neutral-500">{currencySymbolMap[watchedCurrency] || "$"}</div>
          <div className="h-5 mt-1 text-sm text-red-400">{errors.amount?.message as string}</div>
        </div>

        <div className="relative">
          <Input
            placeholder="Description"
            {...register("description")}
            className="pl-9"
          />
          <FileText className="absolute left-2 top-2 size-4" style={{ color: 'var(--input-placeholder)' }} />
          <div className="h-5 mt-1 text-sm text-red-400">{errors.description?.message as string}</div>
        </div>

        <div className="relative">
          <Input
            placeholder="Category / Label"
            {...register("category")}
            className="pl-9"
          />
          <Tag className="absolute left-2 top-2 size-4" style={{ color: 'var(--input-placeholder)' }} />
          <div className="h-5 mt-1 text-sm text-red-400">{errors.category?.message as string}</div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded cursor-pointer border ${watch("type") === "income" ? "bg-green-200 text-green-800 border-green-300" : "text-green-600 border-neutral-200"}`}
            onClick={() => setValue("type", "income")}
          >
            <ArrowUp className="size-4" />
            <span>In</span>
          </button>

          <button
            type="button"
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded cursor-pointer border ${watch("type") === "expense" ? "bg-red-200 text-red-800 border-red-300" : "text-red-400 border-neutral-200"}`}
            onClick={() => setValue("type", "expense")}
          >
            <ArrowDown className="size-4" />
            <span>Out</span>
          </button>
        </div>
      </div>

      <DialogFooter className="flex flex-col gap-2 sm:flex-col">
        <Button size="lg" className="w-full" onClick={handleSubmit(onSubmit)}>Save</Button>
        <Button variant="outline" size="lg" className="w-full" onClick={() => { setOpen(false); reset(); }}>
          Cancel
        </Button>
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
