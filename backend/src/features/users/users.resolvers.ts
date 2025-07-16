import type {Resolvers} from '../../graphql/types.js';
import {GraphQLError} from 'graphql';

export const usersResolvers: Resolvers = {
    Query: {
        /**
         * @description Fetches a list of all employees in the system.
         * Requires the user to be authenticated.
         */
        getEmployees: async (_parent, _args, context) => {
            // Authorization: Check if a user is logged in via the context.
            if (!context.currentEmployee) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            return context.prisma.employee.findMany();
        },
        getEmployee: async (_parent, { publicId }, context) => {
            // Authorization: Check if a user is logged in via the context.
            if (!context.currentEmployee) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            return context.prisma.employee.findUnique({
                where: { publicId },
            });
        },
        me: async (_parent, _args, context) => {
            // Authorization: Check if a user is logged in via the context.
            const currentEmployee = context.currentEmployee;
            if (!currentEmployee) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            return context.prisma.employee.findUnique({ where: { publicId: currentEmployee.publicId } });
        },
        deleteMe: async (_parent, _args, context) => {
            // Authorization: Check if a user is logged in via the context.
            const currentEmployee = context.currentEmployee;
            if (!currentEmployee) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            return context.prisma.employee.delete({ where: { publicId: currentEmployee.publicId } });
        },
    },
    Mutation: {
        updateEmployee: async (_parent, {publicId, input}, context) => {
            // Authorization: Check if a user is logged in via the context.
            if (!context.currentEmployee) {
                throw new GraphQLError('You must be logged in to perform this action.', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            return context.prisma.employee.update({
                where: { publicId },
                data: input
            });
        },
    }
};