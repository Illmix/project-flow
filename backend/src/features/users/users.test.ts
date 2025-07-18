import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from '../../graphql/typeDefs.js';
import { resolvers } from '../../graphql/resolvers.js';
import {AuthPayload, Employee} from "../../graphql/types.js";
import {buildContext} from "../../lib/testContext.js";

const prisma = new PrismaClient();
const server = new ApolloServer({ typeDefs, resolvers });

describe('User & Auth Resolvers', () => {
    let employeeData = {token: "", publicId: ""}
    beforeAll(async () => {
        await prisma.employee.deleteMany();
        employeeData = {token: "", publicId: ""}
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should create a new employee and return a token on signup', async () => {
        const contextValue = await buildContext({});
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
        const contextValue = await buildContext({});

        const response = await server.executeOperation({
                query: `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
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

        const responseData = response.body.singleResult.data?.login as AuthPayload;

        expect(responseData.token).toBeDefined();

        employeeData.token = responseData.token;
    });

    it('should get information of logged in user and return his publicId', async () => {
        const contextValue = await buildContext({
            authorization: 'Bearer ' + employeeData.token,
        });
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

        expect(responseData.Name).toBe('Test User');
        expect(responseData.Email).toBe('test@example.com');
        expect(responseData.publicId).toBeDefined();
        expect(responseData.created_at).toBeDefined();

        employeeData.publicId = responseData.publicId;
    })

    it('should get all employees', async () => {
        const contextValue = await buildContext({
            authorization: 'Bearer ' + employeeData.token,
        });

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
        expect(responseData[0].Name).toBe('Test User');
        expect(responseData[0].Email).toBe('test@example.com');
    })

    it('should get one employee by publicId', async () => {
        const contextValue = await buildContext({
            authorization: 'Bearer ' + employeeData.token,
        });

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
                    publicId: employeeData.publicId
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

        expect(employee.Name).toBe('Test User');
        expect(employee.Email).toBe('test@example.com');
    });

    it('should update the employee by publicId', async () => {
        const contextValue = await buildContext({
            authorization: 'Bearer ' + employeeData.token,
        });

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
                    publicId: employeeData.publicId,
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
        expect(updated.publicId).toBe(employeeData.publicId);
    })

    it('should delete logged in employee', async () => {
        const contextValue = await buildContext({
            authorization: 'Bearer ' + employeeData.token,
        });

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

        const deleted = response.body.singleResult.data?.deleteMe as Employee;

        expect(deleted.publicId).toBe(employeeData.publicId);
    })
});