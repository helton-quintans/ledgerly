import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { NextRequest } from 'next/server';

import { helloQuery } from './schema/queries/hello';
import { setMessageMutation } from './schema/mutations/setMessage';
import { messageType } from './schema/types/message';
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

const handler = startServerAndCreateNextHandler<NextRequest>(server);

export { handler as GET, handler as POST };
