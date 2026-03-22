import { GET_TRANSACTIONS } from "@/graphql/queries/transactions/transactions";
import {
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION,
} from "@/graphql/mutations/transactions/transactions";
import { print } from "graphql";
import type { DocumentNode } from "graphql";

// Utility function for GraphQL requests via fetch
async function graphqlFetch(query: string | DocumentNode, variables: any) {
  const queryString = typeof query === "string" ? query : print(query);
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: queryString, variables }),
    credentials: "same-origin",
  });
  const { data, errors } = await res.json();
  if (errors) throw errors;
  return data;
}

export async function getTransactions(params: any) {
  return graphqlFetch(GET_TRANSACTIONS, params).then(
    (data) => data.transactions
  );
}

export async function createTransaction(params: any) {
  return graphqlFetch(CREATE_TRANSACTION, params).then(
    (data) => data.createTransaction
  );
}

export async function updateTransaction(params: any) {
  return graphqlFetch(UPDATE_TRANSACTION, params).then(
    (data) => data.updateTransaction
  );
}

export async function deleteTransaction(params: any) {
  return graphqlFetch(DELETE_TRANSACTION, params).then(
    (data) => data.deleteTransaction
  );
}
