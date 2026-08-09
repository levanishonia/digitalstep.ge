import { z } from 'zod'
export const createOrderSchema=z.object({serviceSlug:z.string().min(1).max(120),packageId:z.enum(['basic','standard','premium']),requirements:z.string().trim().min(10).max(5000),referenceLinks:z.array(z.url().max(1000)).max(2).optional()}).strict()
