import type {Resolvers} from '../../graphql/types.js';
import {authenticated, isProjectOwner} from "../../lib/permissions.js";
import {randomUUID} from "crypto";


export const projectsResolvers: Resolvers = {
    Query: {
        /**
         * @description Fetches a list of all projects.
         */
        getProjects: authenticated(async (_parent, _args, context) => {
            return context.prisma.project.findMany({
                orderBy: {created_at: 'desc'},
            });
        }),
        /**
         * @description Fetches a single project by its public ID.
         */
        getProject: authenticated(async (_parent, { publicId }, context) => {
            return context.prisma.project.findUnique({
                where: { publicId },
            });
        }),
    },
    Mutation: {
        /**
         * @description Creates a new project.
         */
        createProject: authenticated(async (_parent, { input }, context) => {
            const currentEmployee = context.currentEmployee;

            return context.prisma.project.create({
                data: {
                    ...input,
                    publicId: randomUUID().slice(0, 8),
                    createdById: currentEmployee?.id
                },
            });
        }),
        /**
         * @description Updates an existing project.
         */
        updateProject: isProjectOwner(async (_parent, { publicId, input }, context) => {
            return context.prisma.project.update({
                where: {publicId},
                data: {...input},
            });
        }),
        /**
         * @description Deletes a project.
         */
        deleteProject: isProjectOwner(async (_parent, { publicId }, context) => {
            return context.prisma.project.delete({
                where: {publicId},
            });
        }),
    },
}