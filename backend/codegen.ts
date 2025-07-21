import type { CodegenConfig } from '@graphql-codegen/cli';
/**
 * This file configures GraphQL types code generation.
 */
const config: CodegenConfig = {
    schema: [
        'src/graphql/base.graphql',
        'src/features/**/*.graphql'
    ],


    generates: {
        'src/graphql/types.ts': {
            plugins: ['typescript', 'typescript-resolvers'],

            config: {
                contextType: '../context.js#Context',
                useIndexSignature: true,
                scalars: {
                    DateTime: 'Date',
                },
            },
        },
    },
};

export default config;