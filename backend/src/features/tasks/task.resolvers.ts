import type {CreateTaskInput, Resolvers} from '../../graphql/types.js';
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
        createTask: authenticated(async (_parent, { input }: {input: CreateTaskInput}, context): Promise<Task> => {
            const { projectPublicId, requiredSkillIds, blockedByTaskPublicIds, ...taskData } = input;

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
                        requiredSkills: {connect: requiredSkillIds.map((id: number) => ({id}))},
                    }),
                    ...(blockedByTaskPublicIds && {
                        blockedBy: {
                            connect: blockedByTaskPublicIds.map((publicId: string) => ({ publicId })),
                        },
                    }),
                },
            })
        }),
        updateTask: authenticated(async (_parent, { publicId, input }, context) => {
            const { requiredSkillIds, ...taskData } = input;
            const dataToUpdate = { ...taskData };

            if (requiredSkillIds) {
                dataToUpdate.requiredSkills = { set: requiredSkillIds.map((id: number) => ({ id })) };
            }

            return context.prisma.task.update({ where: { publicId }, data: dataToUpdate });
        }),
        deleteTask: authenticated(async (_parent, { publicId }, context) => {
            return context.prisma.task.delete({ where: { publicId } });
        }),

        assignTask: authenticated(async (_parent, { taskPublicId, employeePublicId }, context) => {
            return context.prisma.task.update({
                where: { publicId: taskPublicId },
                data: {
                    assignee: employeePublicId
                        ? { connect: { publicId: employeePublicId } }
                        : { disconnect: true },
                },
            });
        }),

        addDependency: authenticated(async (_parent, { blockingTaskPublicId, blockedTaskPublicId }, context) => {
            return context.prisma.task.update({
                where: { publicId: blockingTaskPublicId },
                data: { blocking: { connect: { publicId: blockedTaskPublicId } } },
            });
        }),

        removeDependency: authenticated(async (_parent, { blockingTaskPublicId, blockedTaskPublicId }, context) => {
            return context.prisma.task.update({
                where: { publicId: blockingTaskPublicId },
                data: { blocking: { disconnect: { publicId: blockedTaskPublicId } } },
            });
        }),
    },
    Task: {
        project: (parent, _args, context) => {
            return context.loaders.projectForTask.load(parent.project_id);
        },
        assignee: (parent, _args, context) => {
            if (!parent.assignee_id) return null
            return context.loaders.employeeForTask.load(parent.assignee_id);
        },
        requiredSkills: (parent, _args, context) => {
            return context.loaders.skillsForTask.load(parent.id);
        },
        blocking: (parent, _args, context) => {
            // Get tasks that this task is blocking
            return context.loaders.tasksBlocking.load(parent.id);
        },
        blockedBy: (parent, _args, context) => {
            // Get tasks that block this task
            return context.loaders.tasksBlockedBy.load(parent.id);
        },
    }
}