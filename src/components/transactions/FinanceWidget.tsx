"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTransactions } from "@/contexts/TransactionsContext";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

type Props = {
  showDetails?: boolean;
  compact?: boolean;
};

export default function FinanceWidget({
  showDetails = false,
  compact = false,
}: Props) {
  const {
    incomes,
    expenses,
    balance,
    formatCurrency,
    filteredTransactions,
    loading,
  } = useTransactions();

  if (loading) {
    return (
      <Card className={compact ? "h-20" : ""}>
        <CardContent className={compact ? "p-4" : "p-6"}>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-6 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet
                className={`h-4 w-4 ${balance >= 0 ? "text-green-500" : "text-red-500"}`}
              />
              <span className="text-sm font-medium">Balance</span>
            </div>
            <span
              className={`font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(balance)}
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Income</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(incomes)}
          </div>
          {showDetails && (
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter((t) => t.type === "income").length}{" "}
              transactions
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(expenses)}
          </div>
          {showDetails && (
            <p className="text-xs text-muted-foreground">
              {filteredTransactions.filter((t) => t.type === "expense").length}{" "}
              transactions
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <Wallet
            className={`h-4 w-4 ${balance >= 0 ? "text-green-500" : "text-red-500"}`}
          />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${balance >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {formatCurrency(balance)}
          </div>
          {showDetails && (
            <p className="text-xs text-muted-foreground">
              Total of {filteredTransactions.length} transactions
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
