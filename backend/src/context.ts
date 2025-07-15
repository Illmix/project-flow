import { IncomingMessage } from 'http';
import {Employee, PrismaClient} from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

/**
 * @description Defines the shape of the context object that is passed to every resolver.
 */
export interface Context {
    prisma: PrismaClient;
    currentEmployee: Employee | null;
}

/**
 * @description This async function is called for each incoming GraphQL request.
 * It authenticates the user and provides the context object to the resolvers.
 * @param req The request object from Apollo Server, which includes headers.
 */
export const createContext = async ({ req }: { req: IncomingMessage }): Promise<Context> => {
    let currentEmployee: Employee | null = null;
    const token = req.headers.authorization?.split(' ')[1];

    // Check for the JWT secret in environment variables
    if (token && process.env.JWT_SECRET) {
        try {
            // Verify the token's signature and expiration
            const payload = jwt.verify(token, process.env.JWT_SECRET);

            // If the payload is valid, fetch the employee from the database
            if (payload && typeof payload !== 'string' && payload.userId) {
                currentEmployee = await prisma.employee.findUnique({
                    where: { id: payload.userId },
                });
            }
        } catch (error: any) {
            // If the token is invalid, the employee remains null
            console.error('Invalid JWT:', error.message);
        }
    }

    return {
        prisma,
        currentEmployee
    };
};