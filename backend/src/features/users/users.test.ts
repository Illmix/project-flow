import { ApolloServer } from '@apollo/server';
import {PrismaClient, Skill} from '@prisma/client';
import { typeDefs } from '../../graphql/typeDefs.js';
import { resolvers } from '../../graphql/resolvers.js';
import {AuthPayload, Employee} from "../../graphql/types.js";
import {createAuthenticatedContext} from "../../tests/helpers.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const server = new ApolloServer({ typeDefs, resolvers });

describe('User & Auth Resolvers', () => {
    beforeEach(async () => {
        await prisma.employee.deleteMany();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new employee and return a token on signup', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);
        const response = await server.executeOperation({
                query: `
        mutation Signup($input: SignUpInput!) {
          signup(input: $input) {
            token
            employee {
              publicId
              Name
              Email
            }
          }
        }
      `,
                variables: {
                    input: {
                        Name: 'Test User',
                        Email: 'test@example.com',
                        Password: 'password123',
                    },
                },
            },
            {
                contextValue
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result, but got incremental response.');
        }

        const responseData = response.body.singleResult.data?.signup as AuthPayload;

        expect(responseData.token).toBeDefined();
        expect(responseData.employee.Name).toBe('Test User');
        expect(responseData.employee.Email).toBe('test@example.com');


        const dbUser = await prisma.employee.findUnique({ where: { Email: 'test@example.com' } });
        expect(dbUser).toBeDefined();
        expect(dbUser?.Name).toBe('Test User');
    });

    it('should login a new employee and return a token on login', async () => {
        const hashedPassword = await bcrypt.hash('password123', 10);
        const testEmployee = await prisma.employee.create({
            data: {
                Name: 'Login User',
                Email: 'login@example.com',
                Password: hashedPassword,
                publicId: 'login-test-uuid',
            },
        });

        const response = await server.executeOperation({
            query: `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            token
            employee {
              publicId
              Email
            }
          }
        }
      `,
            variables: {
                input: {
                    Email: 'login@example.com',
                    Password: 'password123',
                },
            },
        },
            {
                contextValue: {prisma}
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result');
        }
        const responseData = response.body.singleResult.data?.login as AuthPayload;

        expect(responseData.token).toBeDefined();
        expect(typeof responseData.token).toBe('string');
        expect(responseData.employee.Email).toBe('login@example.com');

        const decodedToken = jwt.verify(responseData.token, process.env.JWT_SECRET!) as { userId: number };
        expect(decodedToken.userId).toBe(testEmployee.id);
    });

    it('should get information of logged in user and return his publicId', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);
        const response = await server.executeOperation(
            {
                query: `
        query GetMe {
            me {
              Name
              Email
              publicId
              created_at
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

        const responseData = response.body.singleResult.data?.me as Employee;

        expect(responseData.Name).toBe(contextValue.currentEmployee?.Name);
        expect(responseData.Email).toBe(contextValue.currentEmployee?.Email);
        expect(responseData.publicId).toBeDefined();
        expect(responseData.created_at).toBeDefined();
    })

    it('should get all employees', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);

        const response = await server.executeOperation(
            {
                query: `
        query GetEmployees {
            getEmployees {
              Name
              Email
              publicId
              created_at
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

        const responseData = response.body.singleResult.data?.getEmployees as [Employee];

        expect(responseData.length).toBe(1);
        expect(responseData[0].Name).toBe(contextValue.currentEmployee?.Name);
        expect(responseData[0].Email).toBe(contextValue.currentEmployee?.Email);
    })

    it('should get one employee by publicId', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);

        const response = await server.executeOperation(
            {
                query: `
                query GetEmployee($publicId: String!) {
                    getEmployee(publicId: $publicId) {
                        Name
                        Email
                        publicId
                        created_at
                    }
                }
            `,
                variables: {
                    publicId: contextValue.currentEmployee?.publicId
                }
            },
            {
                contextValue
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result, but got incremental response.');
        }

        const employee = response.body.singleResult.data?.getEmployee as Employee;

        expect(employee.Name).toBe(contextValue.currentEmployee?.Name);
        expect(employee.Email).toBe(contextValue.currentEmployee?.Email);
    });

    it('should update the employee by publicId', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);

        const response = await server.executeOperation({
                query: `
        mutation UpdateEmployee($publicId: String!, $input: UpdateEmployeeInput!) {
          updateEmployee(publicId: $publicId, input: $input) {
            Name
            Email
            publicId
          }
        }
      `,
                variables: {
                    publicId: contextValue.currentEmployee?.publicId,
                    input: {
                        Name: 'Updated User',
                        Email: 'updated@example.com',
                    },
                },
            },
            {
                contextValue
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result, but got incremental response.');
        }

        const updated = response.body.singleResult.data?.updateEmployee as Employee;

        expect(updated.Name).toBe('Updated User');
        expect(updated.Email).toBe('updated@example.com');
        expect(updated.publicId).toBe(contextValue.currentEmployee?.publicId);

        const dbUser = await prisma.employee.findUnique({ where: { publicId: contextValue.currentEmployee?.publicId } });
        expect(dbUser?.Name).toBe('Updated User');
    })

    it('should get an employee with their associated skills', async () => {
        const { context: contextValue, employee: testEmployee } = await createAuthenticatedContext(prisma);

        const reactSkill = await prisma.skill.create({ data: { Name: 'React' } });
        const nodeSkill = await prisma.skill.create({ data: { Name: 'Node.js' } });

        await prisma.employee.update({
            where: { id: testEmployee.id },
            data: {
                skills: {
                    connect: [{ id: reactSkill.id }, { id: nodeSkill.id }],
                },
            },
        });

        const response = await server.executeOperation(
            {
                query: `
                query GetEmployeeWithSkills($publicId: String!) {
                    getEmployee(publicId: $publicId) {
                        Name
                        skills {
                            Name
                        }
                    }
                }
            `,
                variables: { publicId: testEmployee.publicId },
            },
            {
                contextValue,
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result, but got incremental response.');
        }

        const employee = response.body.singleResult.data?.getEmployee as Employee;

        expect(employee.skills).toHaveLength(2);
        expect(employee.skills).toEqual(
            expect.arrayContaining([
                expect.objectContaining({ Name: 'React' }),
                expect.objectContaining({ Name: 'Node.js' }),
            ])
        );
    });

    it('should delete logged in employee', async () => {
        const { context: contextValue } = await createAuthenticatedContext(prisma);

        const response = await server.executeOperation({
                query: `
        mutation {
          deleteMe {
            publicId
          }
        }
      `,
            },
            {
                contextValue
            }
        );

        if (response.body.kind !== 'single') {
            fail('Expected single result, but got incremental response.');
        }

        const dbUser = await prisma.employee.findUnique({ where: { publicId: contextValue.currentEmployee?.publicId } });
        expect(dbUser).toBe(null);
    })
});