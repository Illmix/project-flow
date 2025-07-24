import {ApolloServer} from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { createAuthenticatedContext } from '../../tests/helpers.js';
import { typeDefs } from '../../graphql/typeDefs.js';
import { resolvers } from '../../graphql/resolvers.js';
import type {Task} from "../../graphql/types.js";

const prisma = new PrismaClient();

const server = new ApolloServer({ typeDefs, resolvers });

describe('Task Resolvers', () => {
    beforeEach(async () => {
        await prisma.skill.deleteMany();
        await prisma.task.deleteMany();
        await prisma.project.deleteMany();
        await prisma.employee.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should fetch all tasks', async () => {
        const {context: contextValue, employee} = await createAuthenticatedContext(prisma);

        const project = await contextValue.prisma.project.create({
            data: {
                Name: 'Test Project',
                publicId: 'testproject-123',
                createdById: employee.id,
            },
        });

        await contextValue.prisma.task.create({
            data: {
                Name: 'Test task',
                Status: 'new',
                publicId: 'testtask-123',
                projectId: project.id,
            },
        });

        const response = await server.executeOperation(
            {
                query: `
                    query GetTasks($projectPublicId: String!) {
                        getTasksForProject(projectPublicId: $projectPublicId) {
                            Name
                            publicId
                        }
                    }
                `,
                variables: {
                    projectPublicId: project.publicId
                }
            },
            { contextValue }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }

        const tasks = response.body.singleResult.data?.getTasksForProject as Task[];
        expect(tasks).toHaveLength(1);
        expect(tasks[0].Name).toBe('Test task');
    })


    it('should create a new task in the project', async () => {
    const {context: contextValue, employee} = await createAuthenticatedContext(prisma);

    const project = await contextValue.prisma.project.create({
        data: {
            Name: 'Test Project',
            publicId: 'testproject-123',
            createdById: employee.id,
        },
    });

    const reactSkill = await prisma.skill.create({ data: { Name: 'React' } });
    const nodeSkill = await prisma.skill.create({ data: { Name: 'Node.js' } });

    const response = await server.executeOperation(
        {
            query: `
                mutation CreateTask($input: CreateTaskInput!) {
                    createTask(input: $input) {
                        publicId
                        Name
                        Description
                        Status
                        project {
                            Name
                        }
                        requiredSkills {
                            Name
                        }
                    }
                }
            `,
            variables: {
                input: {
                    Name: 'New Test Task',
                    Description: 'A task for testing.',
                    projectPublicId: project.publicId,
                    requiredSkillIds: [reactSkill.id, nodeSkill.id]
                },
            },
        },
        { contextValue }
    );

    if (response.body.kind !== 'single') {
        fail('Expected single result');
    }

    const task = response.body.singleResult.data?.createTask as Task

    expect(task.Name).toBe('New Test Task');
    expect(task.Description).toBe('A task for testing.');
    expect(task.project.Name).toBe('Test Project');
    expect(task.requiredSkills).toEqual(
        expect.arrayContaining([
                expect.objectContaining({ Name: 'React' }),
                expect.objectContaining({ Name: 'Node.js' }),
            ])
        );

        const dbTask = await prisma.task.findUnique({ where: { publicId: task.publicId } });
        expect(dbTask).toBeDefined();
        expect(dbTask?.projectId).toBe(project.id);
    })

    it('should update a task in the project', async () => {
        const {context: contextValue, employee} = await createAuthenticatedContext(prisma);

        const project = await contextValue.prisma.project.create({
            data: {
                Name: 'Test Project',
                publicId: 'testproject-123',
                createdById: employee.id,
            },
        });

        const typescriptSkill = await prisma.skill.create({ data: { Name: 'TypeScript' } });
        const pythonSkill = await prisma.skill.create({ data: { Name: 'Python' } });

        const task = await contextValue.prisma.task.create({
            data: {
                Name: 'Test task',
                Status: 'new',
                publicId: 'testtask-123',
                projectId: project.id,
                requiredSkills: {
                    connect: [{id: typescriptSkill.id}]
                }
            },
        });


        const response = await server.executeOperation(
            {
                query: `
                    mutation UpdateTask($publicId: String!, $input: UpdateTaskInput!) {
                        updateTask(publicId: $publicId, input: $input) {
                            publicId
                            Name
                            Description
                            Status
                            requiredSkills {
                                Name
                            }
                        }
                    }
                `,
                variables: {
                    publicId: task.publicId,
                    input: {
                        Name: 'Updated Task',
                        Status: "in_progress",
                        Description: 'Updated Task description',
                        requiredSkillIds: [pythonSkill.id]
                    },
                },
            },
            { contextValue }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }

        const updatedTask = response.body.singleResult.data?.updateTask as Task
        expect(updatedTask.Name).toBe('Updated Task');
        expect(updatedTask.Description).toBe('Updated Task description');
        expect(updatedTask.requiredSkills).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ Name: 'Python' }),
            ])
        );
    })
    it('should delete a task in the project', async () => {
        const {context: contextValue, employee} = await createAuthenticatedContext(prisma);

        const project = await contextValue.prisma.project.create({
            data: {
                Name: 'Test Project',
                publicId: 'testproject-123',
                createdById: employee.id,
            },
        });

        const task = await contextValue.prisma.task.create({
            data: {
                Name: 'Test task',
                Status: 'new',
                publicId: 'testtask-123',
                projectId: project.id,
            },
        });


        const response = await server.executeOperation(
            {
                query: `
                    mutation DeleteTask($publicId: String!) {
                        deleteTask(publicId: $publicId,) {
                            publicId
                        }
                    }
                `,
                variables: {
                    publicId: task.publicId,
                },
            },
            { contextValue }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }

        const deletedTask = response.body.singleResult.data?.deleteTask as Task
        expect(deletedTask.publicId).toBe(task.publicId);
    })

    it('should assign a task to an employee', async () => {
        const { context: contextValue, employee } = await createAuthenticatedContext(prisma);

        const project = await prisma.project.create({
            data: {
                Name: 'Assignment Project',
                publicId: 'assign-proj-1',
                createdById: employee.id,
            },
        });

        const taskToAssign = await prisma.task.create({
            data: {
                Name: 'A Task to be Assigned',
                Status: 'new',
                publicId: 'assign-task-1',
                projectId: project.id,
            },
        });

        const response = await server.executeOperation(
            {
                query: `
                    mutation AssignTask($taskPublicId: String!, $employeePublicId: String) {
                        assignTask(taskPublicId: $taskPublicId, employeePublicId: $employeePublicId) {
                            publicId
                            assignee {
                                publicId
                                Name
                            }
                        }
                    }
                `,
                variables: {
                    taskPublicId: taskToAssign.publicId,
                    employeePublicId: employee.publicId,
                },
            },
            { contextValue }
        );
        if (response.body.kind !== 'single') fail('Expected single result');

        const assignedTask = response.body.singleResult.data?.assignTask as Task;

        expect(assignedTask.assignee).toBeDefined();
        expect(assignedTask.assignee?.publicId).toBe(employee.publicId);
        expect(assignedTask.assignee?.Name).toBe('Test User');

        const dbTask = await prisma.task.findUnique({ where: { publicId: taskToAssign.publicId } });
        expect(dbTask?.assigneeId).toBe(employee.id);
    });
    it('should add a dependency between two tasks', async () => {
        const {context: contextValue, employee} = await createAuthenticatedContext(prisma);
        const project = await prisma.project.create({
            data: {
                Name: 'Dependency Project',
                publicId: 'dep-proj-1',
                createdById: employee.id,
            },
        });
        const blockingTask = await prisma.task.create({
            data: {Name: 'Task A (Blocking)', publicId: 'task-a', projectId: project.id},
        });
        const blockedTask = await prisma.task.create({
            data: {Name: 'Task B (Blocked)', publicId: 'task-b', projectId: project.id},
        });

        const response = await server.executeOperation(
            {
                query: `
                    mutation AddDependency($blockingTaskPublicId: String!, $blockedTaskPublicId: String!) {
                        addDependency(blockingTaskPublicId: $blockingTaskPublicId, blockedTaskPublicId: $blockedTaskPublicId) {
                            publicId
                            blocking {
                                publicId
                                Name
                            }
                        }
                    }
                `,
                variables: {
                    blockingTaskPublicId: blockingTask.publicId,
                    blockedTaskPublicId: blockedTask.publicId,
                },
            },
            {contextValue}
        );

        if (response.body.kind !== 'single') fail('Expected single result');

        const result = response.body.singleResult.data?.addDependency as Task;

        expect(result.blocking).toHaveLength(1);
        expect(result.blocking?.[0].publicId).toBe(blockedTask.publicId);


        const dbBlockedTask = await prisma.task.findUnique({
            where: { publicId: blockedTask.publicId },
            include: { blockedBy: true },
        });

        expect(dbBlockedTask?.blockedBy).toHaveLength(1);
        expect(dbBlockedTask?.blockedBy[0].publicId).toBe(blockingTask.publicId);
    })

    it('should remove a dependency between two tasks', async () => {
        const { context: contextValue, employee } = await createAuthenticatedContext(prisma);
        const project = await prisma.project.create({
            data: { Name: 'Dependency Project', publicId: 'dep-proj-2', createdById: employee.id, created_at: new Date().toISOString() },
        });
        const blockingTask = await prisma.task.create({
            data: { Name: 'Task A (Blocking)', publicId: 'task-a', projectId: project.id },
        });
        const blockedTask = await prisma.task.create({
            data: { Name: 'Task B (Blocked)', publicId: 'task-b', projectId: project.id },
        });
        // Create the initial dependency link directly in the DB
        await prisma.task.update({
            where: { id: blockingTask.id },
            data: { blocking: { connect: { id: blockedTask.id } } },
        });

        await server.executeOperation(
            {
                query: `
                    mutation RemoveDependency($blockingTaskPublicId: String!, $blockedTaskPublicId: String!) {
                        removeDependency(blockingTaskPublicId: $blockingTaskPublicId, blockedTaskPublicId: $blockedTaskPublicId) {
                            publicId
                        }
                    }
                `,
                variables: {
                    blockingTaskPublicId: blockingTask.publicId,
                    blockedTaskPublicId: blockedTask.publicId,
                },
            },
            { contextValue }
        );

        const dbBlockingTask = await prisma.task.findUnique({
            where: { publicId: blockingTask.publicId },
            include: { blocking: true },
        });
        expect(dbBlockingTask?.blocking).toHaveLength(0);
    });
})
