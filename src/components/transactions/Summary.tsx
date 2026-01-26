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
    <div className="mb-4 grid grid-cols-1 gap-4">
      {/* Mobile horizontal */}
      <div className="-mx-2 ml-[2px] flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 lg:hidden">
        <div className="relative flex min-w-72 shrink-0 snap-start items-center justify-between rounded-md border border-border bg-black p-4 text-white shadow-md dark:bg-[var(--primary)] dark:text-[var(--background)]">
          <div
            className="absolute inset-y-0 left-0 w-1 rounded-l-md bg-accent"
            style={{ color: "var(--input-placeholder)" }}
          />
          <div>
            <div className="font-medium text-sm">Total</div>
            <div className="mt-1 font-extrabold text-3xl">
              {hidden ? "......" : fmt(balance)}
            </div>
          </div>
          <DollarSign className="size-5" />
        </div>

        <div className="flex min-w-60 shrink-0 snap-start items-center justify-between rounded-md bg-muted p-4">
          <div>
            <div className="text-green-500 text-sm">In</div>
            <div className="mt-1 font-semibold text-2xl">
              {hidden ? "......" : fmt(incomes)}
            </div>
          </div>
          <ArrowUp className="size-5 text-green-500" />
        </div>

        <div className="flex min-w-60 shrink-0 snap-start items-center justify-between rounded-md bg-muted p-4">
          <div>
            <div className="text-red-500 text-sm">Out</div>
            <div className="mt-1 font-semibold text-2xl">
              {hidden ? "......" : fmt(expenses)}
            </div>
          </div>
          <ArrowDown className="size-5 text-red-600/80" />
        </div>
      </div>

      {/* Desktop aligned left */}
      <div className="hidden items-center justify-start gap-4 lg:col-span-3 lg:flex lg:flex-row">
        <div className="relative flex w-64 items-center justify-between rounded-md border border-border bg-black p-4 text-white shadow-md dark:bg-[var(--primary)] dark:text-[var(--background)]">
          <div className="absolute inset-y-0 left-0 w-1 rounded-l-md bg-accent" />
          <div>
            <div className="font-medium text-sm">Total</div>
            <div className="mt-1 font-extrabold text-xl">
              {hidden ? "......" : fmt(balance)}
            </div>
          </div>
          <DollarSign className="size-5" />
        </div>

        <div className="flex w-64 items-center justify-between rounded-md bg-muted p-4">
          <div>
            <div className="text-green-500 text-sm">In</div>
            <div className="mt-1 font-semibold text-xl">
              {hidden ? "......" : fmt(incomes)}
            </div>
          </div>
          <ArrowUp className="size-5 text-green-500" />
        </div>

        <div className="flex w-64 items-center justify-between rounded-md bg-muted p-4">
          <div>
            <div className="text-red-500 text-sm">Out</div>
            <div className="mt-1 font-semibold text-xl">
              {hidden ? "......" : fmt(expenses)}
            </div>
          </div>
          <ArrowDown className="size-5 text-red-500" />
        </div>
      </div>
    </div>
  );
}
