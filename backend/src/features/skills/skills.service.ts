import type { PrismaClient } from '@prisma/client';

/**
 * @description Checks a list of skills by their IDs and deletes any that are no longer
 * associated with any tasks OR employees.
 * @param skillIds An array of skill IDs to check.
 * @param prisma The Prisma client instance.
 */
export const checkAndRemoveUnusedSkills = async (
    skillIds: number[],
    prisma: PrismaClient
) => {
    // Find all skills from the list that have no tasks AND no employees linked to them.
    const unusedSkills = await prisma.skill.findMany({
        where: {
            id: { in: skillIds },
            AND: [
                { tasks: { none: {} } },
                { employees: { none: {} } }
            ],
        },
        select: {
            id: true,
        },
    });

    if (unusedSkills.length > 0) {
        const idsToDelete = unusedSkills.map((skill) => skill.id);

        await prisma.skill.deleteMany({
            where: {
                id: { in: idsToDelete },
            },
        });
    }
};