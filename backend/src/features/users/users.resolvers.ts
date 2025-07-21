import type { Prisma } from '@prisma/client';
import type {Resolvers} from '../../graphql/types.js';
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
        getEmployee: authenticated(async (_parent, { publicId }, context) => {
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
        updateEmployee: authenticated(async (_parent, {input}, context) => {
            const currentEmployee = context.currentEmployee;

            if (!currentEmployee) return null

            const { skillIds, ...otherData } = input;
            const dataToUpdate: Prisma.EmployeeUpdateInput = {
                ...otherData,
            };
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
        deleteMe: authenticated(async (_parent, _args, context) => {
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