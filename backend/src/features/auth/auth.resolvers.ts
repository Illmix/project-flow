import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { GraphQLError } from 'graphql';
import type { Resolvers } from '../../graphql/types.js';
import type { Context } from '../../context.js';

// Get the JWT secret from environment variables.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL ERROR: JWT_SECRET is not defined in environment variables.');
}

// This object contains resolvers specific to the 'auth' feature.
export const authResolvers: Resolvers = {
    Mutation: {
        /**
         * @description Registers a new employee, hashes their password, and returns a JWT.
         */
        signup: async (_parent, { input }, context: Context) => {
            if (!input) {
                throw new GraphQLError('Input is required.', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            // 1. Hash the user's password.
            const hashedPassword = await bcrypt.hash(input.Password, 10);

            // 2. Create the new employee in the database.
            const newEmployee = await context.prisma.employee.create({
                data: {
                    Name: input.Name,
                    Email: input.Email,
                    Password: hashedPassword,
                    publicId: randomUUID(),
                },
            });

            // 3. Sign a new JWT containing the employee's ID.
            const token = jwt.sign({ userId: newEmployee.id }, JWT_SECRET, {
                expiresIn: '7d',
            });

            // 4. Return the token and employee data.
            return {
                token,
                employee: newEmployee
            };
        },

        /**
         * @description Logs in an existing employee and returns a JWT.
         */
        login: async (_parent, { input }, context: Context) => {
            if (!input) {
                throw new GraphQLError('Input is required.', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            // 1. Find the employee in the database by their email.
            const employee = await context.prisma.employee.findUnique({
                where: { Email: input.Email },
            });

            if (!employee) {
                throw new GraphQLError('No employee found with that email address', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            // 2. Compare the provided password with the stored hash.
            const isValid = await bcrypt.compare(input.Password, employee.Password);
            if (!isValid) {
                throw new GraphQLError('Invalid password', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            // 3. Sign a new JWT containing the employee's ID.
            const token = jwt.sign({ userId: employee.id }, JWT_SECRET, {
                expiresIn: '7d',
            });

            // 4. Return the token and employee data.
            return {
                token,
                employee,
            };
        },
    },
};