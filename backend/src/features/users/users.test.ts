import { ApolloServer } from '@apollo/server';
import { PrismaClient } from '@prisma/client';
import { typeDefs } from '../../graphql/typeDefs.js';
import { resolvers } from '../../graphql/resolvers.js';
import {AuthPayload, Employee} from "../../graphql/types.js";
import { createContext } from '../../context.js'
import {IncomingMessage} from "http";

const buildContext = async (headers?: IncomingMessage['headers']) => {
    const req = { headers } as IncomingMessage;
    return await createContext({ req });
};

const prisma = new PrismaClient();
const server = new ApolloServer({ typeDefs, resolvers });

describe('User & Auth Resolvers', () => {
    let token = ""
    beforeAll(async () => {
        await prisma.employee.deleteMany();
        token = ""
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

        token = responseData.token;
    });

    it('should get information of logged in user', async () => {
        const contextValue = await buildContext({
            authorization: 'Bearer ' + token,
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
    })
});