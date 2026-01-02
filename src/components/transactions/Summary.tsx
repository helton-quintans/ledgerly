"use client";

import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";

type Props = {
  incomes: number;
  expenses: number;
  balance: number;
  hidden: boolean;
  fmt: (v: number) => string;
};

export default function Summary({ incomes, expenses, balance, hidden, fmt }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-4">
      {/* Mobile horizontal */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-2 -mx-2 lg:hidden">
        <div className="min-w-60 shrink-0 rounded-md p-4 bg-accent text-accent-foreground flex items-center justify-between snap-start">
          <div>
            <div className="text-sm">Total</div>
            <div className="text-2xl font-semibold mt-1">{hidden ? "......" : fmt(balance)}</div>
          </div>
          <DollarSign className="size-5 opacity-70" />
        </div>

        <div className="min-w-60 shrink-0 rounded-md p-4 bg-muted flex items-center justify-between snap-start">
          <div>
            <div className="text-sm text-muted-foreground">In</div>
            <div className="text-2xl font-semibold mt-1">{hidden ? "......" : fmt(incomes)}</div>
          </div>
          <ArrowUp className="size-5 opacity-70" />
        </div>

        <div className="min-w-60 shrink-0 rounded-md p-4 bg-muted flex items-center justify-between snap-start">
          <div>
            <div className="text-sm text-muted-foreground">Out</div>
            <div className="text-2xl font-semibold mt-1">{hidden ? "......" : fmt(expenses)}</div>
          </div>
          <ArrowDown className="size-5 opacity-70" />
        </div>
      </div>

      {/* Desktop centered */}
      <div className="hidden lg:flex gap-4 lg:flex-row lg:col-span-3 justify-center items-center">
        <div className="w-64 rounded-md p-4 bg-accent text-accent-foreground flex items-center justify-between">
          <div>
            <div className="text-sm">Total</div>
            <div className="text-2xl font-semibold mt-1">{hidden ? "......" : fmt(balance)}</div>
          </div>
          <DollarSign className="size-5 opacity-70" />
        </div>

        <div className="w-64 rounded-md p-4 bg-muted flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">In</div>
            <div className="text-2xl font-semibold mt-1">{hidden ? "......" : fmt(incomes)}</div>
          </div>
          <ArrowUp className="size-5 opacity-70" />
        </div>

        <div className="w-64 rounded-md p-4 bg-muted flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Out</div>
            <div className="text-2xl font-semibold mt-1">{hidden ? "......" : fmt(expenses)}</div>
          </div>
          <ArrowDown className="size-5 opacity-70" />
        </div>
      </div>
    </div>
  );
}
