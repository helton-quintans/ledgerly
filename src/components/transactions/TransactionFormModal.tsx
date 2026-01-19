"use client";

import CategorySelector from "@/components/transactions/CategorySelector";
import CurrencySelector from "@/components/transactions/CurrencySelector";
import TransactionsTypeToggle from "@/components/transactions/TransactionsTypeToggle";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { convertCurrency } from "@/lib/exchange-rates";
import { useIsMobile } from "@/hooks/use-mobile";
import { createTransaction } from "@/lib/transactions";
import { FileText, Plus, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import transactionFormSchema, {
  type TransactionFormValues,
} from "@/lib/schemas/transaction";
import type { Currency } from "@/lib/schemas/transaction";
import type { Transaction } from "@/lib/transactions";
import { updateTransaction } from "@/lib/transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";

type TransactionFormModalProps = {
  onSaved?: () => void;
  transaction?: Transaction | null;
  onClose?: () => void;
};

export default function TransactionFormModal({
  onSaved,
  transaction = null,
  onClose,
}: TransactionFormModalProps) {
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
  const watchedType = watch("type");

  // Reset category when transaction type changes
  useEffect(() => {
    if (open && !transaction) {
      // Only reset category for new transactions (not when editing)
      setValue("category", "");
    }
  }, [watchedType, open, transaction, setValue]);

  async function onSubmit(values: TransactionFormValues) {
    // values.amount is the integer cents thanks to the zod preprocess
    const amount_cents = Math.abs(values.amount as number);

    try {
      const { convertedAmountCents, exchangeRate } = await convertCurrency(
        amount_cents,
        values.currency,
        "USD",
      );
      const rate_timestamp = new Date().toISOString();

      if (transaction) {
        // update existing
        await updateTransaction(transaction.id, {
          type: values.type,
          amount_cents,
          currency: values.currency,
          converted_amount_cents: convertedAmountCents,
          converted_currency: "USD",
          exchange_rate: exchangeRate,
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
          converted_amount_cents: convertedAmountCents,
          converted_currency: "USD",
          exchange_rate: exchangeRate,
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

      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label>Currency</Label>
          <CurrencySelector
            value={watchedCurrency}
            onChange={(v) => setValue("currency", v)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Type</Label>
          <TransactionsTypeToggle
            value={watch("type")}
            onChange={(value) => setValue("type", value)}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="amount">Amount</Label>
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
                    id="amount"
                    customInput={Input}
                    thousandSeparator={thousandSep}
                    decimalSeparator={decimalSep}
                    decimalScale={2}
                    allowNegative={false}
                    prefix={currencySymbolMap[watchedCurrency] || ""}
                    onValueChange={(values) => {
                      if (values.floatValue != null) {
                        field.onChange(values.floatValue);
                        clearErrors("amount");
                      }
                    }}
                    onChange={(e: any) => {
                      const raw = String(e.target.value || "");
                      
                      const withoutSymbol = raw.replace(currencySymbolMap[watchedCurrency] || "", "").trim();

                      const suffixMatch = withoutSymbol.match(/([0-9.,]+)\s*([kKmM])\s*$/);
                      
                      if (suffixMatch) {
                        let numStr = suffixMatch[1].replace(/[.,]/g, "");
                        const parsed = Number.parseFloat(numStr);
                        
                        if (!Number.isNaN(parsed)) {
                          const suffix = suffixMatch[2].toLowerCase();
                          let value = parsed;
                          if (suffix === "k") value = value * 1_000;
                          if (suffix === "m") value = value * 1_000_000;
                          field.onChange(value);
                          clearErrors("amount");
                        }
                        return;
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
          </div>
          {errors.amount?.message && (
            <p className="text-sm text-red-400">{errors.amount.message as string}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <CategorySelector
            value={watch("category") || ""}
            onChange={(v) => {
              setValue("category", v);
              clearErrors("category");
            }}
            type={watch("type")}
          />
          {errors.category?.message && (
            <p className="text-sm text-red-400">{errors.category.message as string}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description (optional)</Label>
          <div className="relative">
            <Input
              id="description"
              placeholder="e.g., Monthly groceries"
              {...register("description")}
              className="pl-9"
            />
            <FileText
              className="absolute left-2 top-2 size-4"
              style={{ color: "var(--input-placeholder)" }}
            />
          </div>
          {errors.description?.message && (
            <p className="text-sm text-red-400">{errors.description.message as string}</p>
          )}
        </div>
      </div>

      <DialogFooter className="flex flex-col gap-2 sm:flex-col mt-2">
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
