"use client";

import { useSearch } from "@/components/search-context";
import { Button } from "@/components/ui/button";
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
import type { Transaction } from "@/lib/transactions";
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
    label: true,
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
    setPage(1);
  }, [activeQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

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
                className="capitalize"
                checked={!!columnVisibility[col]}
                onCheckedChange={(value) =>
                  setColumnVisibility((prev) => ({
                    ...prev,
                    [col]: !!value,
                  }))
                }
              >
                {col}
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
              {columnVisibility.label && (
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Tag className="size-4" />
                    <span>Label</span>
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
                    <MoreHorizontal className="size-4" />
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
                    {new Intl.NumberFormat(undefined, {
                      style: "currency",
                      currency: t.currency || "USD",
                    }).format(t.amount)}
                  </TableCell>
                )}

                {columnVisibility.description && (
                  <TableCell>{t.description || t.category}</TableCell>
                )}

                {columnVisibility.label && <TableCell>{t.category}</TableCell>}

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
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => onDelete(t.id)}
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
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
        {Array.from({ length: totalPages }).map((_, i) => (
          <Button
            key={i}
            variant={page === i + 1 ? "default" : "ghost"}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
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
