import DataLoader from 'dataloader';
import type { PrismaClient } from '@prisma/client';
import { groupBy } from 'lodash';

/**
 * @description Generic helper to map an array of items to an array of keys,
 * ensuring the output order matches the input key order.
 * @param keys The array of keys to map to.
 * @param items The array of items fetched from the database.
 * @param keyField The field on the items to group by.
 * @returns An array of item arrays, ordered by the input keys.
 */
const mapToKeys = <T extends { [key: string]: any }>(
    keys: readonly number[],
    items: T[],
    keyField: keyof T
) => {
    const grouped = groupBy(items, keyField);
    return keys.map((key) => grouped[key] || []);
};

const batchSkillsForEmployees = async (keys: readonly number[], prisma: PrismaClient) => {
    const employeeSkills = await prisma.employee.findMany({
        where: { id: { in: [...keys] } },
        select: {
            id: true,
            skills: true,
        },
    });

    // Flatten the result to make it easier to group
    const skillsWithEmployeeId = employeeSkills.flatMap(emp =>
        emp.skills.map(skill => ({ ...skill, employeeId: emp.id }))
    );

    return mapToKeys(keys, skillsWithEmployeeId, 'employeeId');
};

/**
 * @description Factory function to create new DataLoader instances for each request.
 * This ensures that caching is done on a per-request basis.
 */
export const createDataLoaders = (prisma: PrismaClient) => {
    return {
        employeeSkills: new DataLoader((keys: readonly number[]) =>
            batchSkillsForEmployees(keys, prisma)
        ),
    };
};