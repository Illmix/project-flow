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