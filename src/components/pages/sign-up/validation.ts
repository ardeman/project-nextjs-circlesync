import * as z from 'zod'
export const schema = z
  .object({
    displayName: z.string().min(1, { message: 'Display name is required' }),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
