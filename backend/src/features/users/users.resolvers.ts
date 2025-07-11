import type { Resolvers } from '../../graphql/types';

export const usersResolvers: Resolvers = {
    Employee: {
        created_at: (parent) => {
            // parent.created_at is a Date object. We convert it to a string.
            return parent.created_at.toString();
        },
    },
};