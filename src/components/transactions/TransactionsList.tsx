"use client";

import { useTransactions } from "@ledgerly/hooks/transactions/useTransactions";
import { Button } from "@/components/ui/button";
import { LogoSpinner } from "@ledgerly/ui/components/logo";
import ConfirmModal from "@/components/ui/confirm-modal";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/search-input";
import { useIsMobile } from "@ledgerly/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Currency } from "@ledgerly/schemas";
import type { Transaction } from "@/lib/transactions";
import { formatCurrencyFromCents, formatDateByCurrency } from "@ledgerly/utils";
import {
  Calendar,
  ChevronDown,
  DollarSign,
  Edit,
  FileText,
  Tag,
  Trash2,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Zap,
  Heart,
  GraduationCap,
  Plane,
  ShoppingCart,
  Briefcase,
  Laptop,
  TrendingUp,
  Gift,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import TransactionCard from "./TransactionCard";
import TransactionFormModal from "./TransactionFormModal";
import EmptyState from "./EmptyState";
import { Skeleton } from "../ui/skeleton";

// Category icons mapping
const getCategoryIcon = (category: string) => {
  const categoryMap: Record<string, React.ReactNode> = {
    "Food & Dining": <UtensilsCrossed className="size-4" />,
    "Food": <UtensilsCrossed className="size-4" />,
    "Transportation": <Car className="size-4" />,
    "Shopping": <ShoppingBag className="size-4" />,
    "Entertainment": <Film className="size-4" />,
    "Bills & Utilities": <Zap className="size-4" />,
    "Healthcare": <Heart className="size-4" />,
    "Education": <GraduationCap className="size-4" />,
    "Travel": <Plane className="size-4" />,
    "Groceries": <ShoppingCart className="size-4" />,
    "Salary": <Briefcase className="size-4" />,
    "Freelance": <Laptop className="size-4" />,
    "Investment": <TrendingUp className="size-4" />,
    "Gift": <Gift className="size-4" />,
    "Other": <FileText className="size-4" />,
  };

  return categoryMap[category] || <FileText className="size-4" />;
};

type Props = {
  displayCurrency: Currency;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
  editing?: Transaction | null;
  onSaved?: () => void;
  onClose?: () => void;
  items?: Transaction[];
};

export default function TransactionsList({
  displayCurrency,
  onEdit,
  onDelete,
  editing,
  onSaved,
  onClose,
  items,
}: Props) {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [remoteSearch, setRemoteSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;
  // debounce remote search (avoid request per keypress)
  useEffect(() => {
    const id = setTimeout(() => setRemoteSearch(searchQuery.trim()), 300);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const {
    data,
    isLoading,
    error
  } = !items ? useTransactions({
    page,
    pageSize: perPage,
    search: remoteSearch
  }) : { data: undefined, isLoading: false, error: undefined } as any;
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >({
    amount: true,
    description: true,
    category: true,
    date: true,
    actions: true,
  });

  const getColumnIcon = (columnName: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      amount: <DollarSign className="size-3" />,
      description: <FileText className="size-3" />,
      category: <Tag className="size-3" />,
      date: <Calendar className="size-3" />,
      actions: <Edit className="size-3" />,
    };
    return iconMap[columnName] || null;
  };

  // Determine source items: prefer `items` prop (client-side), otherwise use server data
  const sourceItems: Transaction[] = items ?? (data?.transactions ?? []);

  // If `items` provided, apply local search (immediate). Otherwise server already filtered.
  const filtered = items
    ? sourceItems.filter((t) => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return true;
        return (
          (t.description || "").toLowerCase().includes(q) ||
          (t.category || "").toLowerCase().includes(q) ||
          (t.currency || "").toLowerCase().includes(q)
        );
      })
    : sourceItems;

  const totalPages = items ? Math.max(1, Math.ceil((filtered.length || 0) / perPage)) : (data?.totalPages ?? 1);
  const pageItems = items ? filtered.slice((page - 1) * perPage, page * perPage) : filtered;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 flex-1 lg:flex-initial">
          <SearchInput
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 lg:max-w-md"
          />
          <div className="text-sm text-muted-foreground">
            {data?.total ?? 0} results
          </div>
        </div>

        <div className="flex items-center gap-2 justify-between">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {isMobile ? "Card Fields" : "Columns"} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{isMobile ? "Card Fields" : "Columns"}</DropdownMenuLabel>
              {(
                Object.keys(columnVisibility) as (keyof typeof columnVisibility)[]
              ).map((col) => (
                <DropdownMenuCheckboxItem
                  key={col}
                  className="capitalize"
                  checked={!!columnVisibility[col]}
                  onCheckedChange={(value) =>
                    setColumnVisibility((prev) => ({
                      ...prev,
                      [col]: !!value,
                    }))
                  }
                >
                  <div className="flex items-center gap-2">
                    {getColumnIcon(col)}
                    <span>{col}</span>
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {onSaved && onClose && (
            <TransactionFormModal
              onSaved={onSaved}
              transaction={editing}
              onClose={onClose}
            />
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col justify-center items-center ">
          <Skeleton className="w-full h-10 mb-1" />
          <Skeleton className="w-full h-72" />
        </div>
      ) : (
        <>
          {error && <div>Error loading transactions.</div>}
          {filtered.length === 0 && (
            <EmptyState
              type={data?.total === 0 ? "no-transactions" : "no-results"}
              onSaved={onSaved}
              onClose={onClose}
              editing={editing}
            />
          )}

          {/* Mobile Cards Layout */}
          {isMobile && filtered.length > 0 && (
            <div className="space-y-3">
              {pageItems.map((t: Transaction) => (
                <TransactionCard
                  key={t.id}
                  transaction={t}
                  displayCurrency={displayCurrency}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  columnVisibility={columnVisibility}
                />
              ))}
            </div>
          )}

          {/* Desktop Table Layout */}
          {!isMobile && filtered.length > 0 && (
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
                  {pageItems.map((t: Transaction) => (
                    <TableRow key={t.id}>
                      {columnVisibility.amount && (
                        <TableCell
                          className={`${(t.amount_cents ?? Math.round(((t as any).amount ?? 0) * 100)) >= 0 ? "text-success/80" : "text-destructive/80"} text-left`}
                        >
                          {(() => {
                            const amountCents = t.amount_cents ?? Math.round(((t as any).amount ?? 0) * 100);
                            return (amountCents >= 0 ? "+" : "-");
                          })()}
                          {formatCurrencyFromCents(
                            Math.abs(t.amount_cents ?? Math.round(((t as any).amount ?? 0) * 100)),
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
                            {getCategoryIcon(t.category)}
                            <span>{t.category}</span>
                          </div>
                        </TableCell>
                      )}

                      {columnVisibility.date && (
                        <TableCell>{formatDateByCurrency(new Date(t.date), displayCurrency)}</TableCell>
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
                                  await onDelete(t.id);
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
          )}

          {/* Pagination - compartilhada entre mobile e desktop */}
          {filtered.length > 0 && (
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
          )}
        </>
      )}
    </div>
  );
}
