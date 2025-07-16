import type {Resolvers} from '../../graphql/types.js';
import {GraphQLError} from 'graphql';
import {Context} from "../../context.js";

type Resolver = (parent: any, args: any, context: Context, info: any) => any;

const authenticated = (next: Resolver): Resolver => {
    // Return a new resolver function
    return (parent, args, context, info) => {
        // Check for the authenticated user in the context
        if (!context.currentEmployee) {
            throw new GraphQLError('You must be logged in to perform this action.', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        //  If the user is authenticated, call the original resolver.
        return next(parent, args, context, info);
    };
};

export const usersResolvers: Resolvers = {
    Query: {
        /**
         * @description Fetches a list of all employees in the system.
         */
        getEmployees: authenticated(async (_parent, _args, context) => {
            return context.prisma.employee.findMany();
        }),
        /**
         * @description Fetches a single employee by their public ID.
         */
        getEmployee: authenticated(async (_parent, { publicId }, context) => {
            return context.prisma.employee.findUnique({
                where: { publicId },
            });
        }),
        /**
         * @description Fetches authenticated employee
         */
        me: authenticated(async (_parent, _args, context) => {
            const currentEmployee = context.currentEmployee;

            if (!currentEmployee) return null

            return context.prisma.employee.findUnique({ where: { publicId: currentEmployee.publicId } });
        }),
    },
    Mutation: {
        /**
         * @description Updates selected employee
         */
        updateEmployee: authenticated(async (_parent, {publicId, input}, context) => {
            return context.prisma.employee.update({
                where: { publicId },
                data: {
                    ...input
                }
            });
        }),
        /**
         * @description Deletes authenticated employee
         */
        deleteMe: authenticated(async (_parent, _args, context) => {
            const currentEmployee = context.currentEmployee;

            if (!currentEmployee) return null

            return context.prisma.employee.delete({ where: { publicId: currentEmployee.publicId } });
        }),
    }
};