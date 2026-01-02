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
      {/* Mobile horizontal */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-2 -mx-2 ml-[2px] lg:hidden">
        <div className="min-w-72 shrink-0 rounded-md p-4 flex items-center justify-between snap-start relative shadow-md border border-border bg-black text-white dark:bg-[var(--primary)] dark:text-[var(--background)]">
          <div className="absolute left-0 inset-y-0 w-1 rounded-l-md bg-accent" style={{ color: "var(--input-placeholder)" }}/>
          <div>
            <div className="text-sm font-medium">Total</div>
            <div className="text-3xl font-extrabold mt-1">
              {hidden ? "......" : fmt(balance)}
            </div>
          </div>
          <DollarSign className="size-5" />
        </div>

        <div className="min-w-60 shrink-0 rounded-md p-4 bg-muted flex items-center justify-between snap-start">
          <div>
            <div className="text-sm text-green-500">In</div>
            <div className="text-2xl font-semibold mt-1">
              {hidden ? "......" : fmt(incomes)}
            </div>
          </div>
          <ArrowUp className="size-5 text-green-500" />
        </div>

        <div className="min-w-60 shrink-0 rounded-md p-4 bg-muted flex items-center justify-between snap-start">
          <div>
            <div className="text-sm text-red-500">Out</div>
            <div className="text-2xl font-semibold mt-1">
              {hidden ? "......" : fmt(expenses)}
            </div>
          </div>
          <ArrowDown className="size-5 text-red-600/80" />
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
