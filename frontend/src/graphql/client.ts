import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
const apiUrl = import.meta.env.VITE_GRAPHQL_API_URL

if (!apiUrl) {
    throw new Error("VITE_GRAPHQL_API_URL is not defined in your .env file");
}

const httpLink = createHttpLink({
    uri: apiUrl,
});

// Link to add the auth token to headers
const authLink = setContext((_, { headers }) => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');

    // Return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

// Error link to handle errors globally
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.error(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
    }
    if (networkError) {
        console.error(`[Network error]: ${networkError}`);
    }
});

// Apollo Client instance
export const client = new ApolloClient({
    // Chained links together
    link: from([errorLink, authLink, httpLink]),

    cache: new InMemoryCache({
        typePolicies: {
            Query: {
                fields: {
                    getProjects: {
                        merge(existing, incoming) {
                            return incoming ?? existing;
                        },
                    },
                },
            },
            Project: {
                keyFields: ['publicId'],
            },
            Task: {
                keyFields: ['publicId'],
                fields: {
                    requiredSkills: {
                        merge(existing, incoming) {
                            return incoming ?? existing;
                        },
                    },
                },
            },
            Employee: {
                keyFields: ['publicId'],
            },
            Skill: {
                keyFields: ['id'],
            },
        },
    }),
});

