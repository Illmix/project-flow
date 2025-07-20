import type {Resolvers} from '../../graphql/types.js';
import {authenticated} from "../../lib/permissions.js";

export const skillsResolvers: Resolvers = {
    Query: {
        /**
         * @description Fetches a list of all skills.
         */
        getSkills: authenticated(async (_parent, _args, context) => {
            return context.prisma.skill.findMany();
        }),
        /**
         * @description Fetches a single skill by ID.
         */
        getSkill: authenticated(async (_parent, { id }, context) => {
            return context.prisma.skill.findUnique({
                where: { id },
            });
        }),
    }
}