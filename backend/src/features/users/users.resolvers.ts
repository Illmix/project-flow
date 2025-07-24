import type { Prisma } from '@prisma/client';
import type {
    Resolvers,
    QueryGetEmployeeArgs,
    MutationUpdateEmployeeArgs
} from '../../graphql/types.js';
import {authenticated} from "../../lib/permissions.js";

export const usersResolvers: Resolvers = {
    Query: {
        /**
         * @description Fetches a list of all employees in the system.
         */
        getEmployees: authenticated(async (_parent, _args, context) => {
            return context.prisma.employee.findMany();
        }),
        /**
         * @description Fetches a single employee by their public ID.
         */
        getEmployee: authenticated(async (_parent, args: QueryGetEmployeeArgs, context) => {
            const { publicId } = args;
            return context.prisma.employee.findUnique({
                where: { publicId },
            });
        }),
        /**
         * @description Fetches authenticated employee
         */
        me: authenticated(async (_parent, _args, context) => {
            const currentEmployee = context.currentEmployee;

            if (!currentEmployee) return null

            return context.prisma.employee.findUnique({ where: { publicId: currentEmployee.publicId } });
        }),
    },
    Mutation: {
        /**
         * @description Updates selected employee
         */
        updateEmployee: authenticated(async (_parent, args: MutationUpdateEmployeeArgs, context) => {
            const currentEmployee = context.currentEmployee;

            if (!currentEmployee) return null

            const { skillIds, ...otherData } = args.input;
            const dataToUpdate: Prisma.EmployeeUpdateInput = {};
            if (otherData.Name != null) dataToUpdate.Name = otherData.Name;
            if (otherData.Email != null) dataToUpdate.Email = otherData.Email;
            if (otherData.Position != null) dataToUpdate.Position = otherData.Position;
            if (skillIds) {
                dataToUpdate.skills = {
                    set: skillIds.map((id: number) => ({ id })),
                };
            }
            return context.prisma.employee.update({
                where: { publicId: currentEmployee.publicId },
                data: dataToUpdate
            });
        }),
        /**
         * @description Deletes authenticated employee
         */
        deleteMe: authenticated(async (_parent, _args: unknown, context) => {
            const currentEmployee = context.currentEmployee;

            if (!currentEmployee) return null

            return context.prisma.employee.delete({ where: { publicId: currentEmployee.publicId } });
        }),
    },
    Employee: {
        skills: (parent, _args, context) => {
            return context.loaders.employeeSkills.load(parent.publicId);
        },
    },
};