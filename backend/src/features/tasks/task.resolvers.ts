import type {CreateTaskInput, Resolvers} from '../../graphql/types.js';
import {authenticated} from "../../lib/permissions.js";
import {randomUUID} from "crypto";
import {Task} from "@prisma/client";


export const taskResolvers: Resolvers = {
    Query: {
        /**
         * Fetches a list of all tasks by project.
         * @returns List of tasks for the specified project, ordered by name.
         */
        getTasksForProject: authenticated(async (_parent, {projectPublicId}, context): Promise<Task[] | null> => {
            return context.prisma.task.findMany({
                where: {project: {publicId: projectPublicId}},
                orderBy: {Name: 'asc'},
            });
        }),
        /**
         * Fetches a single task by its public ID.
         * @returns The task with the specified public ID, or null if not found.
         */
        getTask: authenticated(async (_parent, { publicId }, context): Promise<Task | null> => {
            return context.prisma.task.findUnique({ where: { publicId } });
        }),
    },
    Mutation: {
        /**
         * Creates a new task within a project.
         * @returns The created task.
         */
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
                    projectId: project.id,
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
        /**
         * Updates an existing task by its public ID.
         * @returns The updated task.
         */
        updateTask: authenticated(async (_parent, { publicId, input }, context) => {
            const { requiredSkillIds, ...taskData } = input;
            const dataToUpdate = { ...taskData };

            if (requiredSkillIds) {
                dataToUpdate.requiredSkills = { set: requiredSkillIds.map((id: number) => ({ id })) };
            }

            return context.prisma.task.update({ where: { publicId }, data: dataToUpdate });
        }),
        /**
         * Deletes a task by its public ID.
         * @returns The deleted task.
         */
        deleteTask: authenticated(async (_parent, { publicId }, context) => {
            return context.prisma.task.delete({ where: { publicId } });
        }),

        /**
         * Assigns or unassigns an employee to a task.
         * @returns The updated task with new assignee.
         */
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

        /**
         * Adds a dependency: makes one task block another.
         * @returns The updated blocking task.
         */
        addDependency: authenticated(async (_parent, { blockingTaskPublicId, blockedTaskPublicId }, context) => {
            return context.prisma.task.update({
                where: { publicId: blockingTaskPublicId },
                data: { blocking: { connect: { publicId: blockedTaskPublicId } } },
            });
        }),

        /**
         * Removes a dependency: unblocks a task from another.
         * @returns The updated blocking task.
         */
        removeDependency: authenticated(async (_parent, { blockingTaskPublicId, blockedTaskPublicId }, context) => {
            return context.prisma.task.update({
                where: { publicId: blockingTaskPublicId },
                data: { blocking: { disconnect: { publicId: blockedTaskPublicId } } },
            });
        }),
    },
    Task: {
        /**
         * Resolves the project for a given task.
         * @returns The project associated with the task.
         */
        project: (parent, _args, context) => {
            return context.loaders.projectForTask.load(parent.projectId);
        },
        /**
         * Resolves the assignee (employee) for a given task.
         * @returns The employee assigned to the task, or null if none.
         */
        assignee: (parent, _args, context) => {
            if (!parent.assigneeId) return null
            return context.loaders.employeeForTask.load(parent.assigneeId);
        },
        /**
         * Resolves the required skills for a given task.
         * @returns List of skills required for the task.
         */
        requiredSkills: (parent, _args, context) => {
            return context.loaders.skillsForTask.load(parent.id);
        },
        /**
         * Gets tasks that this task is blocking.
         * @returns List of tasks that are blocked by this task.
         */
        blocking: (parent, _args, context) => {
            return context.loaders.tasksBlocking.load(parent.id);
        },
        /**
         * Gets tasks that block this task.
         * @returns List of tasks that block this task.
         */
        blockedBy: (parent, _args, context) => {
            return context.loaders.tasksBlockedBy.load(parent.id);
        },
    }
}