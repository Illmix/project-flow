import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { createAuthenticatedContext } from '../../tests/helpers.js';
import { typeDefs } from '../../graphql/typeDefs.js';
import { resolvers } from '../../graphql/resolvers.js';
import type {Task} from "../../graphql/types.js";

const prisma = new PrismaClient();

const server = new ApolloServer({ typeDefs, resolvers });

describe('Project Resolvers', () => {
    beforeEach(async () => {
        await prisma.project.deleteMany();
        await prisma.employee.deleteMany();
        await prisma.task.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });


    it('should create a new task in the project', async () => {
        const {context: contextValue, employee} = await createAuthenticatedContext(prisma);

        const project = await prisma.project.create({
            data: {
                Name: 'Test Project',
                publicId: 'testproject-123',
                createdById: employee.id,
            },
        });

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
                        }
                    }
                `,
                variables: {
                    input: {
                        Name: 'New Test Task',
                        Description: 'A task for testing.',
                        projectPublicId: project.publicId
                    },
                },
            },
            { contextValue }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }

        const task = response.body.singleResult.data?.createProject as Task

        expect(task.Name).toBe('New Test Task');
        expect(task.Description).toBe('A task for testing.');
        expect(task.project.Name).toBe('Test Project');

        const dbTask = await prisma.task.findUnique({ where: { publicId: task.publicId } });
        expect(dbTask).toBeDefined();
        expect(dbTask?.project_id).toBe(employee.id);
    })
})
