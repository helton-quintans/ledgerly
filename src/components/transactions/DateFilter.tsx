"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Transaction } from "@/lib/transactions";
import { useMemo } from "react";

type DateFilter = {
  year: number | null;
  month: number | null; // 0-11 (January is 0)
  preset: "all" | "this-month" | "last-month" | "this-year" | "custom";
};

type Props = {
  transactions: Transaction[];
  filter: DateFilter;
  onChange: (filter: DateFilter) => void;
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function DateFilter({ transactions, filter, onChange }: Props) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Get available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    transactions.forEach(t => {
      years.add(new Date(t.date).getFullYear());
    });
    // Add current year if no transactions exist
    if (years.size === 0) years.add(currentYear);
    return Array.from(years).sort((a, b) => b - a); // Newest first
  }, [transactions, currentYear]);

  // Count transactions per month for selected year
  const monthCounts = useMemo(() => {
    if (!filter.year) return {};
    
    const counts: Record<number, number> = {};
    transactions.forEach(t => {
      const date = new Date(t.date);
      if (date.getFullYear() === filter.year) {
        const month = date.getMonth();
        counts[month] = (counts[month] || 0) + 1;
      }
    });
    return counts;
  }, [transactions, filter.year]);

  const handlePresetChange = (preset: DateFilter["preset"]) => {
    const newFilter: DateFilter = { ...filter, preset };
    
    switch (preset) {
      case "all":
        newFilter.year = null;
        newFilter.month = null;
        break;
      case "this-month":
        newFilter.year = currentYear;
        newFilter.month = currentMonth;
        break;
      case "last-month":
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        newFilter.year = lastMonthYear;
        newFilter.month = lastMonth;
        break;
      case "this-year":
        newFilter.year = currentYear;
        newFilter.month = null;
        break;
      case "custom":
        // Keep current selections
        break;
    }
    
    onChange(newFilter);
  };

  const handleYearChange = (year: string) => {
    onChange({
      ...filter,
      year: parseInt(year),
      preset: "custom"
    });
  };

  const handleMonthChange = (month: number) => {
    onChange({
      ...filter,
      month: filter.month === month ? null : month, // Toggle selection
      preset: "custom"
    });
  };

  return (
    <div className="space-y-3 mt-8">
      <hr />
      {/* Quick filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter.preset === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetChange("all")}
        >
          All
        </Button>
        <Button
          variant={filter.preset === "this-month" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetChange("this-month")}
        >
          This Month
        </Button>
        <Button
          variant={filter.preset === "last-month" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetChange("last-month")}
        >
          Last Month
        </Button>
        <Button
          variant={filter.preset === "this-year" ? "default" : "outline"}
          size="sm"
          onClick={() => handlePresetChange("this-year")}
        >
          This Year
        </Button>
      </div>

      {/* Year selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Year:</span>
          <Select
            value={filter.year?.toString() || ""}
            onValueChange={handleYearChange}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {availableYears.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Month grid */}
        {filter.year && (
          <div className="space-y-1">
            <span className="text-sm font-medium">Month:</span>
            <div className="grid grid-cols-4 gap-1">
              {monthNames.map((name, index) => {
                const count = monthCounts[index] || 0;
                const isSelected = filter.month === index;
                const hasTransactions = count > 0;

                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : hasTransactions ? "outline" : "ghost"}
                    size="sm"
                    className={`h-9 px-2 flex flex-col items-center justify-center text-xs ${
                      !hasTransactions ? "opacity-50" : ""
                    }`}
                    onClick={() => handleMonthChange(index)}
                    disabled={!hasTransactions}
                  >
                    <span className="font-medium">{name}</span>
                    {hasTransactions && count > 0 && (
                      <span className="text-[10px] opacity-70 -mt-0.5">
                        {count}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}