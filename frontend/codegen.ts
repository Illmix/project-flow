import type { CodegenConfig } from '@graphql-codegen/cli';
import 'dotenv/config';

const apiUrl = process.env.VITE_GRAPHQL_API_URL;

if (!apiUrl) {
    throw new Error("VITE_GRAPHQL_API_URL is not defined in your .env file");
}

const config: CodegenConfig = {
    schema: apiUrl,

    // Files where GraphQL operations (queries, mutations) are defined
    documents: ['src/graphql/**/*.ts'],

    ignoreNoDocuments: true,

    generates: {
        'src/types/': {
            preset: 'client-preset',
            presetConfig: {
                gqlTagName: 'gql',
            },
        },
    },
};

export default config;