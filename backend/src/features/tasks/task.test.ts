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
                project_id: project.id,
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
                    Status: "new",
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
        expect(dbTask?.project_id).toBe(project.id);
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
                project_id: project.id,
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
                project_id: project.id,
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
})
