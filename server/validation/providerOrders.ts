import { z } from 'zod'

export const providerStatusUpdateSchema = z.object({
  status: z.enum(['CONFIRMED', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED']),
}).strict()
