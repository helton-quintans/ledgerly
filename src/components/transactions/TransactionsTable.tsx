"use client";

import { useSearch } from "@/components/search-context";
import { Button } from "@/components/ui/button";
import ConfirmModal from "@/components/ui/confirm-modal";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Currency } from "@/lib/schemas/transaction";
import type { Transaction } from "@/lib/transactions";
import { getCategoryByLabel } from "@/lib/categories";
import { formatCurrencyFromCents } from "@/lib/utils";
import {
  Calendar,
  ChevronDown,
  DollarSign,
  Edit,
  FileText,
  MoreHorizontal,
  Search,
  Tag,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type Props = {
  items: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
};

export default function TransactionsTable({ items, onEdit, onDelete }: Props) {
  const { query, setQuery } = useSearch();
  const activeQuery = query ?? "";
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    amount: true,
    description: true,
    category: true,
    date: true,
    actions: true,
  });

  const filtered = useMemo(() => {
    const normalized = (activeQuery ?? "").trim().toLowerCase();
    if (!normalized) return items;
    return items.filter((it) => {
      return (
        (it.description || "").toLowerCase().includes(normalized) ||
        (it.category || "").toLowerCase().includes(normalized) ||
        (it.currency || "").toLowerCase().includes(normalized)
      );
    });
  }, [items, activeQuery]);

  useEffect(() => {
    if (typeof activeQuery === "string") {
      setPage(1);
    }
  }, [activeQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  const columnIcons: Record<string, React.ReactNode> = {
    amount: <DollarSign className="size-4" />,
    description: <FileText className="size-4" />,
    category: <Tag className="size-4" />,
    date: <Calendar className="size-4" />,
    actions: <MoreHorizontal className="size-4" />,
  };

  const columnLabels: Record<string, string> = {
    amount: "Amount",
    description: "Description",
    category: "Category",
    date: "Date",
    actions: "Actions",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            placeholder="Search"
            value={activeQuery}
            onChange={(e) => setQuery(e.target.value)}
            className="max-w-sm pl-9"
          />
          <Search
            className="absolute left-2 top-2 size-4"
            style={{ color: "var(--input-placeholder)" }}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Columns</DropdownMenuLabel>
            {(
              Object.keys(columnVisibility) as (keyof typeof columnVisibility)[]
            ).map((col) => (
              <DropdownMenuCheckboxItem
                key={col}
                checked={!!columnVisibility[col]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    [col]: !!value,
                  }))
                }
              >
                <div className="flex items-center gap-2">
                  {columnIcons[col]}
                  <span>{columnLabels[col]}</span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="text-sm text-muted-foreground">
          {filtered.length} results
        </div>
      </div>
      <div className="overflow-hidden rounded-md border accent-shadow">
        <Table>
          <TableHeader>
            <TableRow>
              {columnVisibility.amount && (
                <TableHead className="text-left">
                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4" />
                    <span>Amount</span>
                  </div>
                </TableHead>
              )}
              {columnVisibility.description && (
                <TableHead>
                  <div className="flex items-center gap-2">
                    <FileText className="size-4" />
                    <span>Description</span>
                  </div>
                </TableHead>
              )}
              {columnVisibility.category && (
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Tag className="size-4" />
                    <span>Category</span>
                  </div>
                </TableHead>
              )}
              {columnVisibility.date && (
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4" />
                    <span>Date</span>
                  </div>
                </TableHead>
              )}
              {columnVisibility.actions && (
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span>Actions</span>
                  </div>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageItems.map((t) => (
              <TableRow key={t.id}>
                {columnVisibility.amount && (
                  <TableCell
                    className={`${t.type === "income" ? "text-green-600/80" : "text-red-600/80"} text-left`}
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrencyFromCents(
                      t.amount_cents || 0,
                      (t.currency ?? "USD") as Currency,
                    )}
                  </TableCell>
                )}

                {columnVisibility.description && (
                  <TableCell>{t.description || t.category}</TableCell>
                )}

                {columnVisibility.category && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {getCategoryByLabel(t.category)?.icon || "📦"}
                      </span>
                      <span>{t.category}</span>
                    </div>
                  </TableCell>
                )}

                {columnVisibility.date && (
                  <TableCell>{new Date(t.date).toLocaleString()}</TableCell>
                )}

                {columnVisibility.actions && (
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onEdit(t)}
                        aria-label="Edit"
                      >
                        <Edit className="size-4" />
                      </Button>
                      <ConfirmModal
                        title="Delete transaction"
                        description="This action cannot be undone. Are you sure you want to delete this transaction?"
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
                          size="icon"
                          variant="destructive"
                          aria-label="Delete"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </ConfirmModal>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-center gap-2 mt-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          aria-label="Prev"
        >
          ◀
        </Button>
        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNumber = i + 1;
          return (
            <Button
              key={`page-${pageNumber}`}
              variant={page === pageNumber ? "default" : "ghost"}
              onClick={() => setPage(pageNumber)}
            >
              {pageNumber}
            </Button>
          );
        })}
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          aria-label="Next"
        >
          ▶
        </Button>
      </div>
    </div>
  );
}
