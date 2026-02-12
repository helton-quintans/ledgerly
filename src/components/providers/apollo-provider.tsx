"use client";
import { ApolloProvider } from "@apollo/client/react";
import { InMemoryCache, ApolloClient, HttpLink } from "@apollo/client";
import { ReactNode } from "react";

const client = new ApolloClient({
  link: new HttpLink({ uri: "/api/graphql", credentials: "same-origin" }),
  cache: new InMemoryCache(),
});

export function ApolloGraphQLProvider({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
