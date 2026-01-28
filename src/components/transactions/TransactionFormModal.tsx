"use client";

import CurrencySelector from "@/components/transactions/CurrencySelector";
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
import { useIsMobile } from "@ledgerly/hooks/use-mobile";
import { createTransaction } from "@/lib/transactions";
import { ArrowDown, ArrowUp, FileText, Plus, Tag, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import transactionFormSchema, {
  type TransactionFormValues,
} from "@ledgerly/schemas/transaction";
import type { Currency } from "@ledgerly/schemas";
import type { Transaction } from "@/lib/transactions";
import { updateTransaction } from "@/lib/transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type Props = {
  onSaved?: () => void;
  transaction?: Transaction | null;
  onClose?: () => void;
};

export default function TransactionFormModal({
  onSaved,
  transaction = null,
  onClose,
}: Props) {
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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    clearErrors,
    control,
  } = form;

  const watchedCurrency = (watch("currency") || "USD") as Currency;

  async function onSubmit(values: TransactionFormValues) {
    // values.amount is the integer cents thanks to the zod preprocess
    const amount_cents = Math.abs(values.amount as number);

    // mock rates to USD
    const rateToUSD: Record<string, number> = { USD: 1, EUR: 1.08, BRL: 0.19 };
    const exchange_rate =
      (rateToUSD[values.currency] ?? 1) / (rateToUSD["USD"] ?? 1);
    const converted_amount_cents = Math.round(
      amount_cents * (rateToUSD[values.currency] ?? 1),
    );
    const rate_timestamp = new Date().toISOString();

    try {
      if (transaction) {
        // update existing
        await updateTransaction(transaction.id, {
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
        toast.success("Transaction updated");
      } else {
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
        toast.success("Transaction created");
      }

      reset();
      setOpen(false);
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error(
        transaction
          ? "Failed to update transaction"
          : "Failed to create transaction",
        {
          icon: <XCircle style={{ color: "var(--destructive)" }} />,
        },
      );
    }
  }

  const trigger = (
    <Button onClick={() => setOpen(true)} variant="default">
      <Plus className="size-4" />
      New transaction
    </Button>
  );

  const currencySymbolMap: Record<Currency, string> = {
    USD: "$",
    EUR: "€",
    BRL: "R$",
  };

  useEffect(() => {
    // clear validation messages when modal opens
    if (transaction) {
      // if a transaction prop is provided, open and populate
      setOpen(true);
      clearErrors();
      reset({
        description: transaction.description || "",
        amount: (transaction.amount_cents || 0) / 100,
        category: transaction.category || "",
        type: transaction.type,
        currency: (transaction.currency as Currency) || "USD",
        date: transaction.date,
      } as any);
      return;
    }

    if (open && !transaction) {
      // if creating new, reset to defaults
      clearErrors();
      reset();
    }
  }, [transaction, open, clearErrors, reset]);

  const content = (
    <div>
      <DialogHeader>
        <DialogTitle>
          {transaction ? "Edit transaction" : "New transaction"}
        </DialogTitle>
      </DialogHeader>

      <div className="flex justify-center items-center gap-2 my-2">
        <CurrencySelector
          value={watchedCurrency}
          onChange={(v) => setValue("currency", v)}
        />
      </div>

      <div className="grid gap-3 py-2">
        <div className="relative">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => {
              const thousandSep =
                watchedCurrency === "BRL" || watchedCurrency === "EUR"
                  ? "."
                  : ",";
              const decimalSep =
                watchedCurrency === "BRL" || watchedCurrency === "EUR"
                  ? ","
                  : ".";

              return (
                <NumericFormat
                  {...field}
                  customInput={Input}
                  thousandSeparator={thousandSep}
                  decimalSeparator={decimalSep}
                  decimalScale={2}
                  allowNegative={false}
                  prefix={currencySymbolMap[watchedCurrency] || ""}
                  // numeric-proper changes (no suffix) provide floatValue
                  onValueChange={(values) => {
                    if (values.floatValue != null) {
                      // pass number to RHF so zod preprocess handles it
                      field.onChange(values.floatValue);
                      clearErrors("amount");
                    }
                  }}
                  // support shorthand like 1k, 1M — parse raw input before NumericFormat normalizes
                  onChange={(e: any) => {
                    const raw = String(e.target.value || "");

                    // allow both comma and dot while typing; keep digits, separators and suffix letters
                    const cleaned = raw.replace(/[^0-9,\.kKmM-]/g, "").trim();
                    const m = cleaned.match(/^(-?[0-9,\.]+)([kKmM])?$/);
                    if (m) {
                      let numStr = m[1];

                      // Decide if the last separator (dot or comma) is a decimal separator
                      const lastDot = numStr.lastIndexOf(".");
                      const lastComma = numStr.lastIndexOf(",");
                      const lastSepPos = Math.max(lastDot, lastComma);

                      if (lastSepPos !== -1) {
                        const digitsAfter = numStr.length - lastSepPos - 1;
                        // If there are 1 or 2 digits after the last separator, treat it as decimal
                        if (digitsAfter > 0 && digitsAfter <= 2) {
                          const intPart = numStr
                            .slice(0, lastSepPos)
                            .replace(/[.,]/g, "");
                          const fracPart = numStr
                            .slice(lastSepPos + 1)
                            .replace(/[.,]/g, "");
                          numStr = intPart + "." + fracPart;
                        } else {
                          // otherwise treat all separators as thousand separators -> remove them
                          numStr = numStr.replace(/[.,]/g, "");
                        }
                      } else {
                        numStr = numStr.replace(/[.,]/g, "");
                      }

                      const parsed = Number.parseFloat(numStr);
                      if (!Number.isNaN(parsed)) {
                        const suffix = m[2]?.toLowerCase();
                        let value = parsed;
                        if (suffix === "k") value = value * 1_000;
                        if (suffix === "m") value = value * 1_000_000;
                        field.onChange(value);
                        clearErrors("amount");
                      }
                    }
                  }}
                  className="pl-9"
                />
              );
            }}
          />
          <div className="absolute left-2 top-2 text-neutral-500">
            {currencySymbolMap[watchedCurrency] || "$"}
          </div>
          <div className="h-5 mt-1 text-sm text-red-400">
            {errors.amount?.message as string}
          </div>
        </div>

        <div className="relative">
          <Input
            placeholder="Description"
            {...register("description")}
            className="pl-9"
          />
          <FileText
            className="absolute left-2 top-2 size-4"
            style={{ color: "var(--input-placeholder)" }}
          />
          <div className="h-5 mt-1 text-sm text-red-400">
            {errors.description?.message as string}
          </div>
        </div>

        <div className="relative">
          <Input
            placeholder="Category / Label"
            {...register("category")}
            className="pl-9"
          />
          <Tag
            className="absolute left-2 top-2 size-4"
            style={{ color: "var(--input-placeholder)" }}
          />
          <div className="h-5 mt-1 text-sm text-red-400">
            {errors.category?.message as string}
          </div>
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
        <Button size="lg" className="w-full" onClick={handleSubmit(onSubmit)}>
          Save
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => {
            setOpen(false);
            reset();
            onClose?.();
          }}
        >
          Cancel
        </Button>
      </DialogFooter>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) onClose?.();
        }}
      >
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side="bottom" className="p-4">
          {content}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) onClose?.();
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
}
