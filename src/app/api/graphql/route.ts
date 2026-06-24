import { ApolloServer } from "@apollo/server";
import { type NextRequest, NextResponse } from "next/server";

import { recurringResolvers } from "./resolvers/recurring";
import { transactionResolvers } from "./resolvers/transaction";
import { recurringType } from "./schema/recurring";
import { transactionSchema } from "./schema/transaction";

const typeDefs = `${transactionSchema}\n${recurringType}`;

const resolvers = {
  Query: {
    ...(transactionResolvers.Query || {}),
    ...(recurringResolvers.Query || {}),
  },
  Mutation: {
    ...(transactionResolvers.Mutation || {}),
    ...(recurringResolvers.Mutation || {}),
  },
};

let apolloServer: ApolloServer | null = null;

async function getApolloServer() {
  if (!apolloServer) {
    apolloServer = new ApolloServer({
      typeDefs,
      resolvers,
    });
    await apolloServer.start();
  }
  return apolloServer;
}

export async function POST(req: NextRequest) {
  const server = await getApolloServer();
  const { query, variables, operationName } = await req.json();

  const { getToken } = await import("next-auth/jwt");
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  const token = await getToken({ req, secret });
  if (!token) {
    // Dev-only debug: help trace why authentication is missing when calling GraphQL
    // eslint-disable-next-line no-console
    console.debug("[graphql/route] auth token not found for request", {
      cookie: req.headers.get("cookie")?.slice(0, 200),
      authorization: req.headers.get("authorization") ? "present" : "missing",
      operationName,
    });
  }
  const response = await server.executeOperation(
    { query, variables, operationName },
    { contextValue: { user: token } },
  );

  if (response.body.kind === "single") {
    return NextResponse.json(response.body.singleResult);
  }

  return NextResponse.json(response.body);
}
