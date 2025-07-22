import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { createAuthenticatedContext } from '../../tests/helpers.js';
import { typeDefs } from '../../graphql/typeDefs.js';
import { resolvers } from '../../graphql/resolvers.js';
import type { Project } from '../../graphql/types.js';

const prisma = new PrismaClient();

const server = new ApolloServer({ typeDefs, resolvers });

describe('Project Resolvers', () => {
    beforeEach(async () => {
        await prisma.project.deleteMany();
        await prisma.employee.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new project for the authenticated user', async () => {
        const { context: contextValue, employee } = await createAuthenticatedContext(prisma);

        const response = await server.executeOperation(
            {
                query: `
                    mutation CreateProject($input: CreateProjectInput!) {
                        createProject(input: $input) {
                            publicId
                            Name
                            Description
                        }
                    }
                `,
                variables: {
                    input: {
                        Name: 'New Test Project',
                        Description: 'A project for testing.',
                    },
                },
            },
            { contextValue }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }

        const project = response.body.singleResult.data?.createProject as Project;

        expect(project.Name).toBe('New Test Project');
        expect(project.Description).toBe('A project for testing.');

        const dbProject = await prisma.project.findUnique({ where: { publicId: project.publicId } });
        expect(dbProject).toBeDefined();
        expect(dbProject?.createdById).toBe(employee.id); // Verify ownership
    });

    it('should fetch all projects', async () => {
        const { context: contextValue, employee } = await createAuthenticatedContext(prisma);
        await prisma.project.create({
            data: {
                Name: 'Fetchable Project',
                publicId: 'fetch-test-123',
                createdById: employee.id,
            },
        });

        const response = await server.executeOperation(
            {
                query: `
                    query GetProjects {
                        getProjects {
                            Name
                            publicId
                        }
                    }
                `,
            },
            { contextValue }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }

        const projects = response.body.singleResult.data?.getProjects as Project[];
        expect(projects).toHaveLength(1);
        expect(projects[0].Name).toBe('Fetchable Project');
    });

    it('should allow the project owner to update the project', async () => {
        const { context: contextValue, employee } = await createAuthenticatedContext(prisma);
        const project = await prisma.project.create({
            data: {
                Name: 'Original Name',
                publicId: 'update-test-123',
                createdById: employee.id,
            },
        });

        const response = await server.executeOperation(
            {
                query: `
                    mutation UpdateProject($publicId: String!, $input: UpdateProjectInput!) {
                        updateProject(publicId: $publicId, input: $input) {
                            Name
                        }
                    }
                `,
                variables: {
                    publicId: project.publicId,
                    input: { Name: 'Updated Name' },
                },
            },
            { contextValue }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }

        const updatedProject = response.body.singleResult.data?.updateProject as Project;
        expect(updatedProject.Name).toBe('Updated Name');
    });

    it('should FORBID a non-owner from updating the project', async () => {
        const owner = await prisma.employee.create({
            data: { Name: 'Owner', Email: 'owner@test.com', Password: '123', publicId: 'owner-1' },
        });
        const project = await prisma.project.create({
            data: { Name: 'Protected Project', publicId: 'protected-1', createdById: owner.id, created_at: new Date().toISOString() },
        });

        const { context: attackerContext } = await createAuthenticatedContext(prisma);

        const response = await server.executeOperation(
            {
                query: `
                    mutation UpdateProject($publicId: String!, $input: UpdateProjectInput!) {
                        updateProject(publicId: $publicId, input: $input) {
                            Name
                        }
                    }
                `,
                variables: {
                    publicId: project.publicId,
                    input: { Name: 'Attacker Name' },
                },
            },
            { contextValue: attackerContext }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }

        expect(response.body.singleResult.data).toBe(null);
        expect(response.body.singleResult.errors).toBeDefined();
        expect(response.body.singleResult.errors?.[0].extensions?.code).toBe('FORBIDDEN');
    });

    it('should allow the project owner to delete the project', async () => {
        const { context: contextValue, employee } = await createAuthenticatedContext(prisma);
        const project = await prisma.project.create({
            data: {
                Name: 'To Be Deleted',
                publicId: 'delete-test-123',
                createdById: employee.id,
                created_at: new Date().toISOString()
            },
        });

        await server.executeOperation(
            {
                query: `
                    mutation DeleteProject($publicId: String!) {
                        deleteProject(publicId: $publicId) {
                            publicId
                        }
                    }
                `,
                variables: { publicId: project.publicId },
            },
            { contextValue }
        );

        const dbProject = await prisma.project.findUnique({ where: { publicId: project.publicId } });
        expect(dbProject).toBeNull();
    });
});