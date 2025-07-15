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
                contextType: '../context.js#Context',
                useIndexSignature: true,
                mappers: {
                    // This tells codegen to find the 'Employee' type
                    // exported from the '@prisma/client' package.
                    Employee: '@prisma/client#Employee as PrismaEmployee',
                },
            },
        },
    },
};

export default config;