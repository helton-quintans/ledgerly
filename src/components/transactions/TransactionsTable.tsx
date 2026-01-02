"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Transaction } from "@/lib/transactions";
import { Edit, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type Props = {
  items: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
};

export default function TransactionsTable({ items, onEdit, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      return (
        (it.description || "").toLowerCase().includes(q) ||
        (it.category || "").toLowerCase().includes(q) ||
        (it.currency || "").toLowerCase().includes(q)
      );
    });
  }, [items, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          placeholder="Search transactions"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          className="rounded border px-3 py-2 flex-1"
        />
        <div className="text-sm text-muted-foreground">
          {filtered.length} results
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Label</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((t) => (
            <TableRow key={t.id}>
              <TableCell
                className={`${t.type === "income" ? "text-green-600" : "text-red-600"} text-left`}
              >
                {t.type === "income" ? "+" : "-"}
                {new Intl.NumberFormat(undefined, {
                  style: "currency",
                  currency: t.currency || "USD",
                }).format(t.amount)}
              </TableCell>
              <TableCell>{t.description || t.category}</TableCell>
              <TableCell>{t.category}</TableCell>
              <TableCell>{new Date(t.date).toLocaleString()}</TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
