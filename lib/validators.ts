import { z } from 'zod';

/**
 * Authentication Schemas
 */

export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must not exceed 100 characters')
    .optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required'),
});

export const passwordResetSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .toLowerCase()
    .trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

/**
 * Todo Schemas
 */

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters'),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.string().datetime().optional(),
});

export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .optional(),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  dueDate: z.string().datetime().optional(),
});

/**
 * Activity Schemas
 */

export const createActivitySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters'),
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .optional(),
  category: z
    .string()
    .min(1, 'Category is required')
    .max(100, 'Category must not exceed 100 characters'),
  duration: z
    .number()
    .int('Duration must be a whole number')
    .positive('Duration must be positive'),
  date: z.string().datetime('Date must be a valid ISO 8601 datetime'),
  evidence: z.string().optional(),
});

/**
 * Type exports for use in API routes
 */

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type EmailVerificationInput = z.infer<typeof emailVerificationSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>;
export type CreateActivityInput = z.infer<typeof createActivitySchema>;
