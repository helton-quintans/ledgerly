"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Transaction } from "@/lib/transactions";
import { useIsMobile } from "@ledgerly/hooks/use-mobile";
import { Calendar, ChevronDown, Filter } from "lucide-react";
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
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function DateFilter({ transactions, filter, onChange }: Props) {
  const isMobile = useIsMobile();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Get available years from transactions
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    transactions.forEach((t) => {
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
    transactions.forEach((t) => {
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
        const lastMonthYear =
          currentMonth === 0 ? currentYear - 1 : currentYear;
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
      year: Number.parseInt(year),
      preset: "custom",
    });
  };

  const handleMonthChange = (month: number) => {
    // When selecting a month, ensure we have a year selected
    const targetYear = filter.year || currentYear;

    onChange({
      year: targetYear,
      month: filter.month === month ? null : month, // Toggle selection
      preset: "custom",
    });
  };

  const getFilterDisplayText = () => {
    switch (filter.preset) {
      case "all":
        return "All Transactions";
      case "this-month":
        return "This Month";
      case "last-month":
        return "Last Month";
      case "this-year":
        return "This Year";
      case "custom":
        if (filter.year && filter.month !== null) {
          return `${monthNames[filter.month]} ${filter.year}`;
        }
        if (filter.year) {
          return `Year ${filter.year}`;
        }
        return "Custom Filter";
      default:
        return "Select Filter";
    }
  };

  return (
    <div className="space-y-3">
      {isMobile ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 flex-1">
                  <Calendar className="h-4 w-4" />
                  Year: {filter.year || "Select"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {availableYears.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => handleYearChange(year.toString())}
                  >
                    {year} {year === currentYear && "(Current)"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick filters dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 flex-1">
                  <Filter className="h-4 w-4" />
                  <span className="truncate">{getFilterDisplayText()}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => handlePresetChange("all")}>
                  All Transactions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePresetChange("this-month")}
                >
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePresetChange("last-month")}
                >
                  Last Month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePresetChange("this-year")}
                >
                  This Year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filter.year && (
            <div className="flex gap-1 overflow-x-auto pb-1">
              {monthNames.map((name, index) => {
                const count = monthCounts[index] || 0;
                const isSelected = filter.month === index;
                const hasTransactions = count > 0;
                const isCurrentMonth =
                  filter.year === currentYear && index === currentMonth;

                return (
                  <Button
                    key={index}
                    variant={
                      isSelected
                        ? "default"
                        : hasTransactions
                          ? "outline"
                          : "ghost"
                    }
                    size="sm"
                    className={`h-7 px-2 text-xs shrink-0 min-w-[44px] ${
                      !hasTransactions ? "opacity-50" : ""
                    } ${
                      isCurrentMonth && !isSelected
                        ? "ring-2 ring-primary/20 border-primary/40 font-semibold"
                        : ""
                    }`}
                    onClick={() => handleMonthChange(index)}
                    disabled={!hasTransactions}
                  >
                    <span
                      className={`font-medium ${isCurrentMonth ? "font-semibold" : ""}`}
                    >
                      {name}
                    </span>
                    {hasTransactions && count > 0 && (
                      <span className="ml-1 text-[10px] opacity-70">
                        {count}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // Desktop layout
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  Year: {filter.year || "Select"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {availableYears.map((year) => (
                  <DropdownMenuItem
                    key={year}
                    onClick={() => handleYearChange(year.toString())}
                  >
                    {year} {year === currentYear && "(Current)"}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  {getFilterDisplayText()}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => handlePresetChange("all")}>
                  All Transactions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePresetChange("this-month")}
                >
                  This Month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePresetChange("last-month")}
                >
                  Last Month
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handlePresetChange("this-year")}
                >
                  This Year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {filter.year && (
            <div className="flex flex-wrap gap-1">
              {monthNames.map((name, index) => {
                const count = monthCounts[index] || 0;
                const isSelected = filter.month === index;
                const hasTransactions = count > 0;
                const isCurrentMonth =
                  filter.year === currentYear && index === currentMonth;

                return (
                  <Button
                    key={index}
                    variant={
                      isSelected
                        ? "default"
                        : hasTransactions
                          ? "outline"
                          : "ghost"
                    }
                    size="sm"
                    className={`h-8 px-2 text-xs ${
                      !hasTransactions ? "opacity-50" : ""
                    } ${
                      isCurrentMonth && !isSelected
                        ? "ring-2 ring-primary/20 border-primary/40 font-semibold"
                        : ""
                    }`}
                    onClick={() => handleMonthChange(index)}
                    disabled={!hasTransactions}
                  >
                    <span
                      className={`font-medium ${isCurrentMonth ? "font-semibold" : ""}`}
                    >
                      {name}
                    </span>
                    {hasTransactions && count > 0 && (
                      <span className="ml-1 text-[10px] opacity-70">
                        {count}
                      </span>
                    )}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
