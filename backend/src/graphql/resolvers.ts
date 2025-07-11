import { authResolvers } from '../features/auth/auth.resolvers';
import { usersResolvers } from '../features/users/users.resolvers';

export const resolvers = [authResolvers, usersResolvers];
