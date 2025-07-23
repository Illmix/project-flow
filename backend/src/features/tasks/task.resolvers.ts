import type {Resolvers} from '../../graphql/types.js';
import {authenticated} from "../../lib/permissions.js";
import {randomUUID} from "crypto";
import {Task} from "@prisma/client";


export const taskResolvers: Resolvers = {
    Query: {
        /**
         * @description Fetches a list of all tasks by project.
         */
        getTasksForProject: authenticated(async (_parent, {projectPublicId}, context): Promise<Task[] | null> => {
            return context.prisma.task.findMany({
                where: {project: {publicId: projectPublicId}},
                orderBy: {Name: 'asc'},
            });
        }),
        /**
         * @description Fetches a single task by its public ID.
         */
        getTask: authenticated(async (_parent, { publicId }, context): Promise<Task | null> => {
            return context.prisma.task.findUnique({ where: { publicId } });
        }),
    },
    Mutation: {
        createTask: authenticated(async (_parent, { input }, context): Promise<Task> => {
            const { projectPublicId, requiredSkillIds, ...taskData } = input;

            const project = await context.prisma.project.findUnique({
                where: { publicId: projectPublicId },
                select: { id: true }
            });
            if (!project) throw new Error("Project not found");

            return context.prisma.task.create({
                data: {
                    ...taskData,
                    publicId: randomUUID().slice(0, 8),
                    project_id: project.id,
                    ...(requiredSkillIds && {
                        requiredSkills: { connect: requiredSkillIds.map((id: number) => ({ id })) },
                    }),
                },
            });
        }),
        updateTask: authenticated(async (_parent, { publicId, input }, context) => {
            const { requiredSkillIds, ...taskData } = input;
            const dataToUpdate = { ...taskData };

            if (requiredSkillIds) {
                dataToUpdate.requiredSkills = { set: requiredSkillIds.map((id: number) => ({ id })) };
            }

            return context.prisma.task.update({ where: { publicId }, data: dataToUpdate });
        }),
    },
    Task: {
        project: (parent, _args, context) => {
            return context.loaders.projectForTask.load(parent.project_id);
        }
    }
}