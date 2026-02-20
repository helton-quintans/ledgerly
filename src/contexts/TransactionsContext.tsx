"use client";

import type { Transaction } from "@/lib/transactions";
import {
  getTransactions,
  createTransaction as svcCreateTransaction,
  updateTransaction as svcUpdateTransaction,
  deleteTransaction as svcDeleteTransaction,
} from "@/services/transactionsService";
import type { Currency } from "@ledgerly/schemas";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

type DateFilter = {
  year: number | null;
  month: number | null;
  preset: "all" | "this-month" | "last-month" | "this-year" | "custom";
};

type TransactionsContextType = {
  // Data
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  
  // Loading states
  loading: boolean;
  error: string | null;
  
  // Filters
  dateFilter: DateFilter;
  searchQuery: string;
  displayCurrency: Currency;
  
  // Editing state
  editing: Transaction | null;
  
  // Filter setters
  setDateFilter: (filter: DateFilter) => void;
  setSearchQuery: (query: string) => void;
  setDisplayCurrency: (currency: Currency) => void;
  setEditing: (transaction: Transaction | null) => void;
  
  // Operations
  createTransaction: (data: any) => Promise<void>;
  updateTransaction: (id: string, data: any) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
  
  // Computed values
  incomes: number;
  expenses: number;
  balance: number;
  formatCurrency: (amount: number) => string;
  
  // Legacy totals (for backward compatibility)
  totals: {
    income: number;
    expenses: number;
    balance: number;
  };
};

const TransactionsContext = createContext<TransactionsContextType | null>(null);

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error("useTransactions must be used within TransactionsProvider");
  }
  return context;
}

type Props = {
  children: React.ReactNode;
};

export function TransactionsProvider({ children }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Transaction | null>(null);
  
  // Filters
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    year: new Date().getFullYear(),
    month: null,
    preset: "this-year"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCurrency, setDisplayCurrency] = useState<Currency>("USD");
  
  // Mock conversion rates
  const rateToUSD: Record<Currency, number> = { USD: 1, EUR: 1.08, BRL: 0.19 };
  
  function convert(amount: number, from: Currency | undefined, to: Currency) {
    const f = rateToUSD[from || "USD"] ?? 1;
    const t = rateToUSD[to] ?? 1;
    return (amount * f) / t;
  }
  
  // Load transactions
  const refreshTransactions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTransactions({});
      // data is expected to be a TransactionPage { transactions: Transaction[] }
      const items = Array.isArray(data.transactions) ? data.transactions : [];
      setTransactions(items as Transaction[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Initial load
  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);
  
  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    // Date filter
    if (dateFilter.preset !== "all") {
      const itemDate = new Date(transaction.date);
      const itemYear = itemDate.getFullYear();
      const itemMonth = itemDate.getMonth();
      
      if (dateFilter.year && itemYear !== dateFilter.year) return false;
      if (dateFilter.month !== null && itemMonth !== dateFilter.month) return false;
    }
    
    // Search filter
    if (searchQuery) {
      const normalized = searchQuery.trim().toLowerCase();
      if (!((transaction.description || "").toLowerCase().includes(normalized) ||
            (transaction.category || "").toLowerCase().includes(normalized) ||
            (transaction.currency || "").toLowerCase().includes(normalized))) {
        return false;
      }
    }
    
    return true;
  });
  
  // Calculate totals
  const getAmountCents = (transaction: Transaction) => {
    return transaction.amount_cents ?? Math.round(((transaction as any).amount ?? 0) * 100);
  };

  const incomes = filteredTransactions.reduce((acc, transaction) => {
    // Determine numeric amount in display currency
    let amtInDisplay = 0;
    if (transaction.converted_currency === displayCurrency && typeof transaction.converted_amount_cents === "number") {
      amtInDisplay = (transaction.converted_amount_cents || 0) / 100;
    } else {
      amtInDisplay = convert(
        getAmountCents(transaction) / 100,
        transaction.currency as Currency | undefined,
        displayCurrency,
      );
    }

    // Count only positive amounts as incomes
    return acc + (amtInDisplay > 0 ? Math.abs(amtInDisplay) : 0);
  }, 0);
  
  const expenses = filteredTransactions.reduce((acc, transaction) => {
    // Determine numeric amount in display currency
    let amtInDisplay = 0;
    if (transaction.converted_currency === displayCurrency && typeof transaction.converted_amount_cents === "number") {
      amtInDisplay = (transaction.converted_amount_cents || 0) / 100;
    } else {
      amtInDisplay = convert(
        getAmountCents(transaction) / 100,
        transaction.currency as Currency | undefined,
        displayCurrency,
      );
    }

    // Count only negative amounts as expenses (use absolute value)
    return acc + (amtInDisplay < 0 ? Math.abs(amtInDisplay) : 0);
  }, 0);
  
  const balance = incomes - expenses;
  
  const totals = {
    income: incomes,
    expenses: expenses,
    balance: balance
  };
  
  const queryClient = useQueryClient();

  // Operations
  const handleCreateTransaction = useCallback(async (data: any) => {
    await svcCreateTransaction(data);
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    await refreshTransactions();
  }, [refreshTransactions, queryClient]);
  
  const handleUpdateTransaction = useCallback(async (id: string, data: any) => {
    await svcUpdateTransaction({ id, ...data });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    await refreshTransactions();
  }, [refreshTransactions, queryClient]);
  
  const handleDeleteTransaction = useCallback(async (id: string) => {
    await svcDeleteTransaction({ id });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
    await refreshTransactions();
  }, [refreshTransactions, queryClient]);
  
  // Currency formatting
  const formatCurrency = useCallback((amount: number) => {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: displayCurrency || "USD",
    }).format(amount);
  }, [displayCurrency]);
  
  const value: TransactionsContextType = useMemo(() => ({
    transactions,
    filteredTransactions,
    loading,
    error,
    editing,
    dateFilter,
    searchQuery,
    displayCurrency,
    setDateFilter,
    setSearchQuery,
    setDisplayCurrency,
    setEditing,
    createTransaction: handleCreateTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
    refreshTransactions,
    incomes,
    expenses,
    balance,
    formatCurrency,
    totals,
  }), [
    transactions,
    filteredTransactions,
    loading,
    error,
    editing,
    dateFilter,
    searchQuery,
    displayCurrency,
    setDateFilter,
    setSearchQuery,
    setDisplayCurrency,
    setEditing,
    handleCreateTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
    refreshTransactions,
    incomes,
    expenses,
    balance,
    formatCurrency,
    totals,
  ]);
  
  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}