import { ApolloServer } from '@apollo/server';
import { NextRequest, NextResponse } from 'next/server';

import { helloQuery } from './schema/queries/hello';
import { setMessageMutation } from './schema/mutations/setMessage';
import { hello } from './resolvers/queries/hello';
import { setMessage } from './resolvers/mutations/setMessage';

const typeDefs = `#graphql
  type Message {
    content: String!
  }
  type Query {
    ${helloQuery}
  }
  type Mutation {
    ${setMessageMutation}
  }
`;

const resolvers = {
  Query: {
    hello,
  },
  Mutation: {
    setMessage,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});


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
  const response = await server.executeOperation({
    query,
    variables,
    operationName,
  });

  if (response.body.kind === "single") {
    return NextResponse.json(response.body.singleResult);
  }
  
  return NextResponse.json(response.body);
}
