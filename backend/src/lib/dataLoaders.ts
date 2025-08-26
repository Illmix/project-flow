import DataLoader from 'dataloader';
import type {Employee, PrismaClient, Project as PrismaProject, Skill, Task} from '@prisma/client';
import lodash from 'lodash';

export interface IDataLoaders {
    employeeSkills: DataLoader<string, Skill[]>;
    skillEmployees: DataLoader<number, Omit<Employee, 'id' | 'Password'>[]>;
    projectForTask: DataLoader<number, PrismaProject>;
    skillsForTask: DataLoader<number, Skill[]>;
    employeeForTask: DataLoader<number, Employee>;
    tasksBlocking: DataLoader<number, Task[]>;
    tasksBlockedBy: DataLoader<number, Task[]>;
    projectTasks: DataLoader<number, Task[]>;
    skillTaskCount: DataLoader<number, number>;
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
    keys: readonly number[] | readonly string[],
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
        capacity_hours_per_week: employee.capacity_hours_per_week
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
 * @description Batch function to get a project for many tasks.
 */
const batchProjectsForTasks = async (keys: readonly number[], prisma: PrismaClient): Promise<(PrismaProject | Error)[]> => {
    const projects = await prisma.project.findMany({
        where: { id: { in: [...keys] } },
    });

    const projectMap = new Map<number, PrismaProject>();
    projects.forEach(project => {
        projectMap.set(project.id, project);
    });

    return keys.map(key => projectMap.get(key) || new Error(`No project found for ID ${key}`));
};

/**
 * @description Batch function to get tasks for many projects.
 */
const batchProjectTasks = async (keys: readonly number[], prisma: PrismaClient): Promise<Task[][]> => {
    const tasks = await prisma.task.findMany({
        where: {
            projectId: { in: [...keys] },
        },
    });


    return mapToKeys(keys, tasks, 'projectId');
};

/**
 * @description Batch function to get required skills for many tasks.
 */
const batchSkillsForTask = async (keys: readonly number[], prisma: PrismaClient): Promise<Skill[][]> => {
    const tasks = await prisma.task.findMany({
        where: { id: { in: [...keys] } },
        include: { requiredSkills: true },
    });

    const skillsMap = new Map<number, Skill[]>();
    tasks.forEach(task => {
        skillsMap.set(task.id, task.requiredSkills);
    });

    return keys.map(key => skillsMap.get(key) || []);
};

/**
 * @description Batch function to get assigned employee for many tasks.
 */
const batchEmployeesForTasks = async (keys: readonly number[], prisma: PrismaClient): Promise<(Employee | Error)[]> => {
    const employees = await prisma.employee.findMany({
        where: { id: { in: [...keys] } },
    });

    const employeeMap = new Map<number, Employee>();
    employees.forEach(employee => {
        employeeMap.set(employee.id, employee);
    });

    return keys.map(key => employeeMap.get(key) || new Error(`No employee found for ID ${key}`));
};

/**
 * @description Batch function to get the count of tasks for many skills.
 */
const batchTaskCountsForSkills = async (keys: readonly number[], prisma: PrismaClient): Promise<number[]> => {
    const skills = await prisma.skill.findMany({
        where: { id: { in: [...keys] } },
        include: {
            _count: {
                select: { tasks: true },
            },
        },
    });

    const countMap = new Map<number, number>();
    skills.forEach(skill => {
        countMap.set(skill.id, skill._count.tasks);
    });

    return keys.map(key => countMap.get(key) || 0);
};


/**
 * @description Batch function to get the tasks that a set of tasks are blocking.
 */
const batchTasksBlocking = async (keys: readonly number[], prisma: PrismaClient): Promise<Task[][]> => {
    const tasks = await prisma.task.findMany({
        where: { id: { in: [...keys] } },
        include: { blocking: true }, // Include the tasks that THIS task blocks
    });

    const blockingMap = new Map<number, Task[]>();
    tasks.forEach(task => {
        blockingMap.set(task.id, task.blocking);
    });

    return keys.map(key => blockingMap.get(key) || []);
};

/**
 * @description Batch function to get the tasks that block a set of tasks.
 */
const batchTasksBlockedBy = async (keys: readonly number[], prisma: PrismaClient): Promise<Task[][]> => {
    const tasks = await prisma.task.findMany({
        where: { id: { in: [...keys] } },
        include: { blockedBy: true }, // Include the tasks that block THIS task
    });

    const blockedByMap = new Map<number, Task[]>();
    tasks.forEach(task => {
        blockedByMap.set(task.id, task.blockedBy);
    });

    return keys.map(key => blockedByMap.get(key) || []);
};

/**
 * @description Factory function to create new DataLoader instances for each request.
 * This ensures that caching is done on a per-request basis.
 */
export const createDataLoaders = (prisma: PrismaClient): IDataLoaders => {
    return {
        employeeSkills: new DataLoader((keys) =>
            batchSkillsForEmployees(keys, prisma)
        ),
        skillEmployees: new DataLoader((keys) =>
            batchEmployeesForSkills(keys, prisma)
        ),
        projectForTask: new DataLoader((keys) =>
            batchProjectsForTasks(keys, prisma)
        ),
        skillsForTask: new DataLoader((keys) =>
            batchSkillsForTask(keys, prisma)
        ),
        employeeForTask: new DataLoader((keys) =>
            batchEmployeesForTasks(keys, prisma)
        ),
        tasksBlocking: new DataLoader<number, Task[]>((keys) =>
            batchTasksBlocking(keys, prisma)
        ),
        tasksBlockedBy: new DataLoader<number, Task[]>((keys) =>
            batchTasksBlockedBy(keys, prisma)
        ),
        projectTasks: new DataLoader<number, Task[]>((keys) =>
            batchProjectTasks(keys, prisma)
        ),
        skillTaskCount: new DataLoader<number, number>((keys) =>
            batchTaskCountsForSkills(keys, prisma)
        ),
    };
};