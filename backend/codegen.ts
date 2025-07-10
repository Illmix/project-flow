import type { CodegenConfig } from '@graphql-codegen/cli';
/**
 * This file configures GraphQL types code generation.
 */
const config: CodegenConfig = {
    schema: 'src/features/**/*.graphql',

    generates: {
        'src/graphql/types.ts': {
            plugins: ['typescript', 'typescript-resolvers'],

            config: {
                // This is crucial: It tells the generator the exact path and name
                // of your context type, so your resolvers' context argument is correctly typed.
                contextType: '../src/context#Context',

                // This prevents errors if you haven't implemented every single resolver yet.
                useIndexSignature: true,
            },
        },
    },
};

export default config;