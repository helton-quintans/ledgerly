"use client";

import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";

type Props = {
  incomes: number;
  expenses: number;
  balance: number;
  hidden: boolean;
  fmt: (v: number) => string;
};

export default function Summary({
  incomes,
  expenses,
  balance,
  hidden,
  fmt,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 mb-4">
      <div className="lg:hidden">
        <div className="rounded-md p-3 flex items-center justify-between relative shadow-md border border-border bg-black text-white dark:bg-[var(--primary)] dark:text-[var(--background)] mb-3">
          <div
            className="absolute left-0 inset-y-0 w-1 rounded-l-md bg-accent"
            style={{ color: "var(--input-placeholder)" }}
          />
          <div>
            <div className="text-sm font-medium">Total</div>
            <div className="text-2xl font-extrabold mt-1">
              {hidden ? "......" : fmt(balance)}
            </div>
          </div>
          <DollarSign className="size-5" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-md p-3 bg-muted flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-xs text-green-500 font-medium">In</div>
              <div className="text-lg font-semibold mt-0.5 truncate">
                {hidden ? "......" : fmt(incomes)}
              </div>
            </div>
            <ArrowUp className="size-4 text-green-500 shrink-0 ml-1" />
          </div>

          <div className="rounded-md p-3 bg-muted flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-xs text-red-500 font-medium">Out</div>
              <div className="text-lg font-semibold mt-0.5 truncate">
                {hidden ? "......" : fmt(expenses)}
              </div>
            </div>
            <ArrowDown className="size-4 text-red-500 shrink-0 ml-1" />
          </div>
        </div>
      </div>

      {/* Desktop aligned left */}
      <div className="hidden lg:flex gap-4 lg:flex-row lg:col-span-3 justify-start items-center">
        <div className="w-64 rounded-md p-4 flex items-center justify-between relative shadow-md border border-border bg-black text-white dark:bg-[var(--primary)] dark:text-[var(--background)]">
          <div className="absolute left-0 inset-y-0 w-1 rounded-l-md bg-accent" />
          <div>
            <div className="text-sm font-medium">Total</div>
            <div className="text-xl font-extrabold mt-1">
              {hidden ? "......" : fmt(balance)}
            </div>
          </div>
          <DollarSign className="size-5" />
        </div>

        <div className="w-64 rounded-md p-4 bg-muted flex items-center justify-between">
          <div>
            <div className="text-sm text-green-500">In</div>
            <div className="text-xl font-semibold mt-1">
              {hidden ? "......" : fmt(incomes)}
            </div>
          </div>
          <ArrowUp className="size-5 text-green-500" />
        </div>

        <div className="w-64 rounded-md p-4 bg-muted flex items-center justify-between">
          <div>
            <div className="text-sm text-red-500">Out</div>
            <div className="text-xl font-semibold mt-1">
              {hidden ? "......" : fmt(expenses)}
            </div>
          </div>
          <ArrowDown className="size-5 text-red-500" />
        </div>
      </div>
    </div>
  );
}
