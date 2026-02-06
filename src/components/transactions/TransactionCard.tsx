"use client";

import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/confirm-modal";
import type { Currency } from "@ledgerly/schemas";
import type { Transaction } from "@/lib/transactions";
import { formatCurrencyFromCents, formatDateByCurrency } from "@ledgerly/utils";
import {
  Calendar,
  Edit,
  FileText,
  Tag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

type TransactionCardProps = {
  transaction: Transaction;
  displayCurrency: Currency;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  columnVisibility: Record<string, boolean>;
};

export default function TransactionCard({
  transaction: t,
  displayCurrency,
  onEdit,
  onDelete,
  columnVisibility,
}: TransactionCardProps) {
  return (
    <div className="rounded-lg border bg-card p-3 space-y-2">
      {/* Header with amount and type */}
      <div className="flex items-center justify-between">
        {columnVisibility.amount && (
          <div
            className={`text-lg font-semibold ${
              t.type === "income" ? "text-green-600" : "text-red-600"
            }`}
          >
            {t.type === "income" ? "+" : "-"}
            {formatCurrencyFromCents(
              t.amount_cents || 0,
              (t.currency ?? "USD") as Currency,
            )}
          </div>
        )}
        {columnVisibility.actions && (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(t)}
              className="h-8 w-8 p-0"
            >
              <Edit className="size-3" />
            </Button>
            <ConfirmModal
              title="Delete Transaction"
              description="Are you sure you want to delete this transaction? This action cannot be undone."
              confirmLabel="Delete"
              cancelLabel="Cancel"
              onConfirm={async () => {
                try {
                  await Promise.resolve(onDelete(t.id));
                  toast.success("Transaction deleted");
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to delete transaction");
                }
              }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="size-3" />
              </Button>
            </ConfirmModal>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="space-y-1 text-sm">
        {columnVisibility.description && (t.description || t.category) && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileText className="size-4" />
            <span>{t.description || t.category}</span>
          </div>
        )}
        {columnVisibility.label && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="size-4" />
            <span>{t.category}</span>
          </div>
        )}
        {columnVisibility.date && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="size-4" />
            <span>{formatDateByCurrency(new Date(t.date), displayCurrency)}</span>
          </div>
        )}
      </div>
    </div>
  );
}