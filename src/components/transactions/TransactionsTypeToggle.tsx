"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

type TransactionsTypeToggleProps = {
  value: "income" | "expense";
  onChange: (value: "income" | "expense") => void;
};

export default function TransactionsTypeToggle({ value, onChange }: TransactionsTypeToggleProps) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded cursor-pointer border ${
          value === "income"
            ? "bg-green-200 text-green-800 border-green-300"
            : "text-green-600 border-neutral-200"
        }`}
        onClick={() => onChange("income")}
      >
        <ArrowUp className="size-4" />
        <span>In</span>
      </button>

      <button
        type="button"
        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded cursor-pointer border ${
          value === "expense"
            ? "bg-red-200 text-red-800 border-red-300"
            : "text-red-400 border-neutral-200"
        }`}
        onClick={() => onChange("expense")}
      >
        <ArrowDown className="size-4" />
        <span>Out</span>
      </button>
    </div>
  );
}
