import { PrismaClient, Employee } from '@prisma/client';
import type { Context } from '../context.js';
import {createDataLoaders} from "../lib/dataLoaders.js";

/**
 * @description Creates a test user in the DB and returns a context object
 * as if that user were logged in.
 */
export async function createAuthenticatedContext(prisma: PrismaClient): Promise<{ context: Context; employee: Employee }> {
    const employee = await prisma.employee.create({
        data: {
            Name: 'Test User',
            Email: `test-${Date.now()}@example.com`,
            Password: 'irrelevant-for-this-test',
            publicId: `uuid-${Date.now()}`,
        },
    });

    const context: Context = {
        prisma,
        currentEmployee: employee,
        loaders: createDataLoaders(prisma),
    };

    return { context, employee };
}