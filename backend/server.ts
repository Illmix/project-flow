import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './src/graphql/typeDefs.js';
import { resolvers } from './src/graphql/resolvers.js';

import { createContext } from './src/context.js';

const PORT = parseInt(process.env.PORT || '4000', 10);

async function startApolloServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
    });

    const { url } = await startStandaloneServer(server, {
        context: createContext,

        listen: { port: PORT },
    });

    console.log(`Server started on url : ${url}`);
}

startApolloServer().then(r => console.log());