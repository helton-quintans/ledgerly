"use client";

import React from "react";
import { Transaction } from "@/lib/transactions";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

type Props = {
  items: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
};

export default function TransactionsTable({ items, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((t) => (
            <TableRow key={t.id}>
              <TableCell className={`${t.type === "income" ? "text-green-600" : "text-red-600"} text-left` }>
                {t.type === "income" ? "+" : "-"}{new Intl.NumberFormat(undefined, { style: "currency", currency: t.currency || "USD" }).format(t.amount)}
              </TableCell>
              <TableCell>{t.description || t.category}</TableCell>
              <TableCell>{new Date(t.date).toLocaleString()}</TableCell>
              <TableCell className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <Button size="icon" variant="ghost" onClick={() => onEdit(t)} aria-label="Edit">
                    <Edit className="size-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => onDelete(t.id)} aria-label="Delete">
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
