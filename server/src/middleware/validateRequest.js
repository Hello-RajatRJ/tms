import { z } from 'zod';
import mongoose from 'mongoose';

// ObjectId validation helper
export const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const validateObjectIdParam = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (!id || !isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid ID parameter: '${id}'. Must be a valid 24-character hexadecimal MongoDB ObjectId.`,
      });
    }
    next();
  };
};

// Team Member Schemas
export const createTeamMemberSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().trim().email('Invalid email address format'),
  role: z.string().trim().min(2, 'Role must be at least 2 characters'),
  department: z.string().trim().optional().default('Engineering'),
  avatar: z.string().trim().optional().default(''),
  phone: z.string().trim().optional().default(''),
  status: z.enum(['Active', 'Inactive', 'On Leave']).optional().default('Active'),
  skills: z.array(z.string()).optional().default([]),
});

export const updateTeamMemberSchema = createTeamMemberSchema.partial();

// Project Schemas
export const createProjectSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters').max(150, 'Title cannot exceed 150 characters'),
  description: z.string().trim().min(3, 'Description must be at least 3 characters').max(2000, 'Description cannot exceed 2000 characters'),
  status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold']).optional().default('Planning'),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional().default('Medium'),
  startDate: z.string().or(z.date()).optional(),
  dueDate: z.string().or(z.date()).refine((val) => !isNaN(new Date(val).getTime()), {
    message: 'Invalid dueDate format',
  }),
  budget: z.number().min(0, 'Budget cannot be negative').optional().default(0),
  spent: z.number().min(0, 'Spent cannot be negative').optional().default(0),
  progress: z.number().min(0).max(100, 'Progress must be between 0 and 100').optional().default(0),
  teamMembers: z.array(z.string().refine(isValidObjectId, { message: 'Invalid team member ID format' })).optional().default([]),
  category: z.string().trim().optional().default('Development'),
  tags: z.array(z.string()).optional().default([]),
});

export const updateProjectSchema = z.object({
  title: z.string().trim().min(2).max(150).optional(),
  description: z.string().trim().min(3).max(2000).optional(),
  status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  startDate: z.string().or(z.date()).optional(),
  dueDate: z.string().or(z.date()).optional(),
  budget: z.number().min(0).optional(),
  spent: z.number().min(0).optional(),
  progress: z.number().min(0).max(100).optional(),
  teamMembers: z.array(z.string().refine(isValidObjectId, { message: 'Invalid team member ID format' })).optional(),
  category: z.string().trim().optional(),
  tags: z.array(z.string()).optional(),
});

// Generic Zod validator middleware
export const validateBody = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      next(err);
    }
  };
};
