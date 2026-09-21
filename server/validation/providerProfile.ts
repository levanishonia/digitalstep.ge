import { z } from 'zod'

const optionalText = (maximum: number) => z.string().trim().max(maximum).nullable().optional()
export const providerProfileSchema = z.object({
  slug: z.string().trim().toLowerCase().min(3).max(60).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  displayName: z.string().trim().min(2).max(120),
  headline: optionalText(160), description: optionalText(2000), category: optionalText(100),
  website: z.string().trim().url().max(300).nullable().optional(),
  location: optionalText(160), languages: z.array(z.string().trim().min(1).max(50)).max(10),
  portfolioSummary: optionalText(1000),
  socialLinks: z.array(z.string().trim().url().max(300)).max(8),
}).strict()
