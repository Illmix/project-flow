import type {
    Resolvers,
    QueryGetProjectArgs,
    MutationCreateProjectArgs,
    MutationUpdateProjectArgs,
    MutationDeleteProjectArgs
} from '../../graphql/types.js';
import {authenticated, isProjectOwner} from "../../lib/permissions.js";
import {randomUUID} from "crypto";
import type { Prisma } from '@prisma/client';


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
        getProject: authenticated(async (_parent, args: QueryGetProjectArgs, context) => {
            const { publicId } = args;
            return context.prisma.project.findUnique({
                where: { publicId },
            });
        }),
    },
    Mutation: {
        /**
         * @description Creates a new project.
         */
        createProject: authenticated(async (_parent, args: MutationCreateProjectArgs, context) => {
            const { input } = args;
            const currentEmployee = context.currentEmployee;
            if (!currentEmployee) return null
            return context.prisma.project.create({
                data: {
                    ...input,
                    publicId: randomUUID().slice(0, 8),
                    createdById: currentEmployee.id
                },
            });
        }),
        /**
         * @description Updates an existing project.
         */
        updateProject: isProjectOwner(async (_parent, args: MutationUpdateProjectArgs, context) => {
            const { publicId, input } = args;
            // Only include fields if they are not undefined/null
            const data: Prisma.ProjectUpdateInput = {
                ...(input.Name != null ? { Name: input.Name } : {}),
                ...(input.Description != null ? { Description: input.Description } : {}),
            };
            return context.prisma.project.update({
                where: {publicId},
                data,
            });
        }),
        /**
         * @description Deletes a project.
         */
        deleteProject: isProjectOwner(async (_parent, args: MutationDeleteProjectArgs, context) => {
            const { publicId } = args;
            return context.prisma.project.delete({
                where: {publicId},
            });
        }),
    },
    Project: {
        /**
         * Resolves tasks for the project.
         * @returns The tasks associated with the project.
         */
        tasks: (parent, _args, context) => {
            return context.loaders.projectTasks.load(parent.id);
        },
    },
}