import { authResolvers } from '../features/auth/auth.resolvers.js';
import { usersResolvers } from '../features/users/users.resolvers.js';

export const resolvers = [authResolvers, usersResolvers];
