import { z } from 'zod'

const email = z.string().trim().toLowerCase().email().max(254)
export const loginSchema = z.object({ email, password: z.string().min(8).max(128) }).strict()
export const registerSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email,
  phone: z.string().trim().max(30).optional().transform(value => value || undefined),
  password: z.string().min(8).max(128),
  role: z.enum(['CUSTOMER', 'PROVIDER']),
  preferredLocale: z.enum(['ka', 'en']),
}).strict()
