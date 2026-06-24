import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../../../../../../generated/prisma/client";
import type { TransactionArgs } from "@/app/api/graphql/schema/types/transaction.types";

interface ValidatedTransactionArgs extends Omit<TransactionArgs, "currency"> {
  currency?: Prisma.TransactionWhereInput["currency"];
}

export async function transactions(_: unknown, args: ValidatedTransactionArgs) {
  const { year, currency, quickFilter, page = 1, pageSize = 10 } = args;
  const where: Prisma.TransactionWhereInput = {};

  if (year) {
    where.date = {
      gte: new Date(`${year}-01-01`),
      lte: new Date(`${year}-12-31`),
    };
  }

  if (currency) {
    where.currency = currency;
  }

  if (quickFilter) {
    const now = new Date();
    if (quickFilter === "this month") {
      where.date = {
        gte: new Date(now.getFullYear(), now.getMonth(), 1),
        lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    }
    if (quickFilter === "last month") {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const year = lastMonth === 11 ? now.getFullYear() - 1 : now.getFullYear();
      where.date = {
        gte: new Date(year, lastMonth, 1),
        lte: new Date(year, lastMonth + 1, 0),
      };
    }
    if (quickFilter === "this year") {
      where.date = {
        gte: new Date(now.getFullYear(), 0, 1),
        lte: new Date(now.getFullYear(), 11, 31),
      };
    }
  }

  const total = await prisma.transaction.count({ where });
  
  // Busca os dados brutos do banco
  const rawTransactions = await prisma.transaction.findMany({
    where,
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: { date: "desc" },
  });

  const transactions = rawTransactions.map((t) => ({
    ...t,
    amount_cents: Math.round((t.amount ?? 0) * 100),
    type: (t.amount ?? 0) >= 0 ? "income" : "expense",
    date: t.date instanceof Date ? t.date.toISOString() : t.date,
  }));

  return {
    transactions,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}