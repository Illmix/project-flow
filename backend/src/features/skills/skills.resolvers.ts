import type {
    Resolvers,
    QueryGetSkillArgs,
    MutationCreateSkillArgs
} from '../../graphql/types.js';
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
        getSkill: authenticated(async (_parent, args: QueryGetSkillArgs, context) => {
            const { id } = args;
            return context.prisma.skill.findUnique({
                where: { id },
            });
        }),
    },
    /**
     * @description Mutations for creating and managing skills.
     */
    Mutation: {
        createSkill: authenticated(async (_parent, args: MutationCreateSkillArgs, context) => {
            const { input } = args;
            return context.prisma.skill.create({ data: input });
        })
    },
    /**
     * @description Field resolvers for the Skill type, such as related employees.
     */
    Skill: {
        employees: (parent, _args, context) => {
            return context.loaders.skillEmployees.load(parent.id);
        },
        tasksCount: (parent, _args, context) => {
            return context.loaders.skillTaskCount.load(parent.id);
        },
    }
}