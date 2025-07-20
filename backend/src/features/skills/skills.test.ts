import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from '../../graphql/typeDefs.js';
import { resolvers } from '../../graphql/resolvers.js';
import { createAuthenticatedContext } from '../../tests/helpers.js';
import type { Context } from '../../context.js';
import {Skill} from "../../graphql/types.js";

const prisma = new PrismaClient();
const server = new ApolloServer<Context>({ typeDefs, resolvers });

describe('Skill Resolvers', () => {
    beforeEach(async () => {
        await prisma.skill.deleteMany();
        await prisma.employee.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should allow an authenticated user to create a skill', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);

        const response = await server.executeOperation(
            {
                query: `
          mutation CreateSkill($input: CreateSkillInput!) {
            createSkill(input: $input) {
              id
              Name
            }
          }
        `,
                variables: {
                    input: {
                        Name: "TypeScript"
                    }
                },
            },
            { contextValue }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }

        const responseData = response.body.singleResult.data?.createSkill as Skill;
        expect(responseData.Name).toBe('TypeScript');

        const dbSkill = await prisma.skill.findFirst({ where: { Name: 'TypeScript' } });
        expect(dbSkill).toBeDefined();
    });

    it('should allow an authenticated user to delete a skill', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);
        const newSkill = await contextValue.prisma.skill.create({
            data: {
                Name: 'Typescript',
            },
        });

        const response = await server.executeOperation({
                query: `
        mutation DeleteSkill($id: Int!)  {
          deleteSkill(id: $id) {
            Name
          }
        }
      `,
                variables: { id: newSkill.id },
            },
            {
                contextValue
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result, but got incremental response.');
        }

        const dbSkill = await prisma.skill.findFirst({ where: { Name: 'Typescript' } });
        expect(dbSkill).toBe(null);
    })

    it('should allow an authenticated user get all skills', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);
        await contextValue.prisma.skill.create({
            data: {
                Name: 'Typescript',
            },
        });

        const response = await server.executeOperation(
            {
                query: `
        query GetSkills {
            getSkills {
              Name
            }
          }
        `
            },
            {
                contextValue
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result, but got incremental response.');
        }

        const responseData = response.body.singleResult.data?.getSkills as [Skill];

        expect(responseData.length).toBe(1);
        expect(responseData[0].Name).toBe('Typescript');
    })

    it('should allow an authenticated user get one skill', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);
        const newSkill = await contextValue.prisma.skill.create({
            data: {
                Name: 'Typescript',
            },
        });

        const response = await server.executeOperation(
            {
                query: `
                query GetSkill($id: Int!) {
                    getSkill(id: $id) {
                        Name
                    }
                }
            `,
                variables: {
                    id: newSkill.id
                }
            },
            {
                contextValue
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result, but got incremental response.');
        }

        const responseData = response.body.singleResult.data?.getSkill as Skill;

        expect(responseData.Name).toBe('Typescript');
    })
    it('should allow an authenticated user to get skill employees', async () => {
        const { context: contextValue, employee: testEmployee } = await createAuthenticatedContext(prisma);
        const newSkill = await contextValue.prisma.skill.create({
            data: {
                Name: 'Typescript',
            },
        });

        await prisma.skill.update({
            where: { id: newSkill.id },
            data: {
                employees: {
                    connect: [{ id: testEmployee.id }],
                },
            },
        });

        const response = await server.executeOperation(
            {
                query: `
                query GetSkill($id: Int!) {
                    getSkill(id: $id) {
                        Name
                        employees {
                            Name
                        }
                    }
                }
            `,
                variables: {
                    id: newSkill.id
                }
            },
            {
                contextValue
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result, but got incremental response.');
        }

        const responseData = response.body.singleResult.data?.getSkill as Skill;

        expect(responseData.employees).toHaveLength(1);
        expect(responseData.employees).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ Name: 'Test User' }),
            ])
        );
    })
});