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
                contextType: '../context#Context',

                useIndexSignature: true,
            },
        },
    },
};

export default config;