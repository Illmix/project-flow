import { PrismaClient, Employee } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @description Defines the shape of the context object that is passed to every resolver.
 */
export interface Context {
    prisma: PrismaClient;
}

export const createContext = async ({ req }): Promise<Context> => {
    return {
        prisma
    };
};