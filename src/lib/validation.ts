import { z } from 'zod';

export const submissionSchema = z.object({
  full_name: z.string().trim().min(2, 'Full name is required').max(120, 'Name is too long'),
  address: z.string().trim().min(4, 'Address is required').max(220, 'Address is too long'),
  phone: z.string().trim().max(40, 'Phone is too long').optional().or(z.literal('')),
  comments: z.string().trim().max(1500, 'Comments are too long').optional().or(z.literal('')),
  wants_contact: z.boolean().default(true),
  accepted_christ: z.boolean().default(false)
});

export const loginSchema = z.object({
  username: z.string().trim().min(3, 'Username is required').max(40, 'Username is too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(120, 'Password is too long')
});

export type SubmissionInput = z.infer<typeof submissionSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
