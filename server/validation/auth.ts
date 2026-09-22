import { z } from 'zod'
import { passwordPolicy } from '../lib/password.js'

const email = z.string().trim().toLowerCase().email().max(254)
export const passwordSchema = z.string().min(passwordPolicy.minLength).max(passwordPolicy.maxLength)
export const loginSchema = z.object({ email, password: passwordSchema }).strict()
export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email,
  phone: z.string().trim().max(30).optional().transform(value => value || undefined),
  password: passwordSchema,
  role: z.enum(['CUSTOMER', 'PROVIDER']),
  preferredLocale: z.enum(['ka', 'en']),
  termsAccepted: z.literal(true),
}).strict()

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(1).max(80).optional(),
  lastName: z.string().trim().min(1).max(80).optional(),
  phone: z.string().trim().max(30).nullable().transform(value => value === '' ? null : value).optional(),
  preferredLocale: z.enum(['ka', 'en']).optional(),
}).strict().refine(value => Object.keys(value).length > 0)

export const changePasswordSchema = z.object({ currentPassword: passwordSchema, newPassword: passwordSchema }).strict()
