import {
  CREATE_TRANSACTION,
  DELETE_TRANSACTION,
  UPDATE_TRANSACTION,
} from "@/graphql/mutations/transactions/transactions";
import { GET_TRANSACTIONS } from "@/graphql/queries/transactions/transactions";
import { type DocumentNode, print } from "graphql";

// Função utilitária para requisições GraphQL via fetch
async function graphqlFetch(query: string | DocumentNode, variables: any) {
  const queryString = typeof query === "string" ? query : print(query);
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: queryString, variables }),
    credentials: "include",
  });
  const { data, errors } = await res.json();
  if (errors) throw errors;
  return data;
}

export async function getTransactions(params: any) {
  return graphqlFetch(GET_TRANSACTIONS, params).then((data) => {
    const page = data.transactions;
    // map each transaction to include amount_cents and type expected by UI
    const mapped = (page.transactions || []).map((t: any) => ({
      ...t,
      amount_cents: Math.round(((t.amount as number) || 0) * 100),
      type: ((t.amount as number) || 0) >= 0 ? "income" : "expense",
      date: t.date, // keep string
    }));
    return { ...page, transactions: mapped };
  });
}

export async function createTransaction(params: any) {
  return graphqlFetch(CREATE_TRANSACTION, params).then((data) => {
    const t = data.createTransaction;
    return {
      ...t,
      amount_cents: Math.round(((t.amount as number) || 0) * 100),
      type: ((t.amount as number) || 0) >= 0 ? "income" : "expense",
      date: t.date,
    };
  });
}

export async function updateTransaction(params: any) {
  return graphqlFetch(UPDATE_TRANSACTION, params).then((data) => {
    const t = data.updateTransaction;
    return {
      ...t,
      amount_cents: Math.round(((t.amount as number) || 0) * 100),
      type: ((t.amount as number) || 0) >= 0 ? "income" : "expense",
      date: t.date,
    };
  });
}

export async function deleteTransaction(params: any) {
  return graphqlFetch(DELETE_TRANSACTION, params).then((data) => {
    const t = data.deleteTransaction;
    return {
      ...t,
      amount_cents: Math.round(((t.amount as number) || 0) * 100),
      type: ((t.amount as number) || 0) >= 0 ? "income" : "expense",
      date: t.date,
    };
  });
}
