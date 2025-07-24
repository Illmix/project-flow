import {Context} from "../context.js";
import {GraphQLError} from "graphql/index.js";

export type GraphQLResolver  = (parent: any, args: any, context: Context, info: any) => any;

/**
 * @description A higher-order function that wraps a resolver to ensure the user is authenticated.
 * @param next The next resolver function to call if authentication is successful.
 * @returns A new resolver function with the authentication check.
 */
export const authenticated = (next: GraphQLResolver): GraphQLResolver => {
    return (parent, args, context, info) => {
        // Check for the authenticated employee in the context.
        if (!context.currentEmployee) {
            throw new GraphQLError('You must be logged in to perform this action.', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        // If authenticated, call the original resolver.
        return next(parent, args, context, info);
    };
}

/**
 * @description A permission checker that ensures the logged-in user is the owner of the project.
 * @param next The next resolver function to call if the permission check passes.
 * @returns A new resolver function with the ownership check.
 */
export const isProjectOwner = (next: GraphQLResolver): GraphQLResolver => {
    return authenticated(async (parent, args, context, info) => {
        const { publicId } = args;
        const { currentEmployee, prisma } = context;

        if (!publicId) {
            throw new GraphQLError('Project publicId must be provided.', {
                extensions: { code: 'BAD_USER_INPUT' },
            });
        }

        const project = await prisma.project.findUnique({
            where: { publicId },
        });

        if (!project || project.createdById !== currentEmployee?.id) {
            throw new GraphQLError("You are not authorized to perform this action.", {
                extensions: { code: 'FORBIDDEN' },
            });
        }

        return next(parent, args, context, info);
    });
};