import { z } from 'zod';

export const projectSchema = z.object({
    Name: z.string()
        .min(1, { message: "Project name is required." })
        .max(30, { message: `Project name cannot exceed ${30} characters.` }),
    Description: z.string().optional(),
});

export const skillSchema = z.object({
    Name: z.string()
        .min(1, { message: "Skill name is required." })
        .max(16, { message: `Skill name cannot exceed ${16} characters.` }),
});

export const taskSchema = z.object({
    Name: z.string()
        .min(1, { message: "Task name is required." })
        .max(30, { message: `Task name cannot exceed ${30} characters.` }),
    Description: z.string().optional(),
    requiredSkillIds: z.array(z.number()).optional(),
});