import {DateTimeResolver} from "graphql-scalars";
import { authResolvers } from '../features/auth/auth.resolvers.js';
import { usersResolvers } from '../features/users/users.resolvers.js';
import {skillsResolvers} from "../features/skills/skills.resolvers.js";

export const resolvers = [
    { DateTime: DateTimeResolver },
    authResolvers,
    usersResolvers,
    skillsResolvers
];
