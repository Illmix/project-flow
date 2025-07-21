import DataLoader from 'dataloader';
import type {Employee, PrismaClient, Skill} from '@prisma/client';
import lodash from 'lodash';

export interface IDataLoaders {
    employeeSkills: DataLoader<string, Skill[]>;
    skillEmployees: DataLoader<number, Omit<Employee, 'id' | 'Password'>[]>;
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
    keys: readonly string[],
    items: T[],
    keyField: keyof T
) => {
    const grouped = lodash.groupBy(items, keyField);
    return keys.map((key) => grouped[key] || []);
};
/**
 * @description Batch function to get skills for many employees.
 */
const batchSkillsForEmployees = async (keys: readonly string[], prisma: PrismaClient) => {
    const employeeSkills = await prisma.employee.findMany({
        where: { publicId: { in: [...keys] } },
        select: {
            publicId: true,
            skills: true,
        },
    });

    // Flatten the result to make it easier to group
    const skillsWithEmployeeId = employeeSkills.flatMap(emp =>
        emp.skills.map(skill => ({ ...skill, employeeId: emp.publicId }))
    );

    return mapToKeys(keys, skillsWithEmployeeId, 'employeeId');
};

/**
 * @description A simple "assembler" to convert a full Prisma Employee
 * into a safe, public-facing Employee object for GraphQL.
 */
const toPublicEmployee = (employee: Employee): Omit<Employee, 'id' | 'Password'> => {
    return {
        publicId: employee.publicId,
        Name: employee.Name,
        Email: employee.Email,
        Position: employee.Position,
        created_at: employee.created_at,
    };
};


/**
 * @description Batch function to get employees for many skills.
 */
const batchEmployeesForSkills = async (keys: readonly number[], prisma: PrismaClient) => {
    const skills = await prisma.skill.findMany({
        where: { id: { in: [...keys] } },
        include: { employees: true },
    });

    const employeeMap = new Map<number, Omit<Employee, 'id' | 'Password'>[]>();
    skills.forEach(skill => {
        const publicEmployees = skill.employees.map(toPublicEmployee);
        employeeMap.set(skill.id, publicEmployees);
    });

    return keys.map(key => employeeMap.get(key) || []);
}

/**
 * @description Factory function to create new DataLoader instances for each request.
 * This ensures that caching is done on a per-request basis.
 */
export const createDataLoaders = (prisma: PrismaClient): IDataLoaders => {
    return {
        employeeSkills: new DataLoader<string, Skill[]>((keys) =>
            batchSkillsForEmployees(keys, prisma)
        ),
        skillEmployees: new DataLoader<number, Omit<Employee, 'id' | 'Password'>[]>((keys) =>
            batchEmployeesForSkills(keys, prisma)
        ),
    };
};