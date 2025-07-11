import { merge } from 'lodash';
import { authResolvers } from '../features/auth/auth.resolvers';
import { usersResolvers } from '../features/users/users.resolvers'; // Import the new resolvers

// Merge the new usersResolvers with your existing authResolvers.
export const resolvers = merge(authResolvers, usersResolvers);
