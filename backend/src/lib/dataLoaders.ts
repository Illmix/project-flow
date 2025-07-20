import DataLoader from 'dataloader';
import type {Employee, PrismaClient, Skill} from '@prisma/client';
import { groupBy } from 'lodash';

export interface IDataLoaders {
    employeeSkills: DataLoader<number, Skill[]>;
    skillEmployees: DataLoader<number, Skill[]>;
}

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
/**
 * @description Batch function to get skills for many employees.
 */
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
 * @description Batch function to get employees for many skills.
 */
const batchEmployeesForSkills = async (keys: readonly number[], prisma: PrismaClient): Promise<Employee[][]> => {
    const skills = await prisma.skill.findMany({
        where: {
            id: { in: [...keys] }
        },
        include: {
            employees: true,
        },
    });

    const employeeMap = new Map<number, Employee[]>();
    skills.forEach(skill => {
        employeeMap.set(skill.id, skill.employees);
    });

    return keys.map(key => employeeMap.get(key) || []);
}

/**
 * @description Factory function to create new DataLoader instances for each request.
 * This ensures that caching is done on a per-request basis.
 */
export const createDataLoaders = (prisma: PrismaClient): IDataLoaders => {
    return {
        employeeSkills: new DataLoader<number, Skill[]>((keys) =>
            batchSkillsForEmployees(keys, prisma)
        ),
        skillEmployees: new DataLoader<number, Employee[]>((keys) =>
            batchEmployeesForSkills(keys, prisma)
        ),
    };
};