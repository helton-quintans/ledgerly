"use client";

import { Receipt, FileText } from "lucide-react";
import TransactionFormModal from "./TransactionFormModal";
import type { Transaction } from "@/lib/transactions";

type EmptyStateProps = {
  type: "no-transactions" | "no-results";
  onSaved?: () => void;
  onClose?: () => void;
  editing?: Transaction | null;
};

export default function EmptyState({ 
  type, 
  onSaved, 
  onClose, 
  editing 
}: EmptyStateProps) {
  if (type === "no-transactions") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Receipt className="size-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No transactions yet</h3>
        <p className="text-muted-foreground mb-6 max-w-md">
          Start tracking your finances by adding your first transaction. 
          Record income, expenses, and keep your budget organized.
        </p>
        {onSaved && onClose && (
          <TransactionFormModal
            onSaved={onSaved}
            transaction={editing}
            onClose={onClose}
            className="shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 font-medium"
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <FileText className="size-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold mb-2">No results found</h3>
      <p className="text-muted-foreground text-sm">
        Try adjusting your search terms or filters
      </p>
    </div>
  );
}