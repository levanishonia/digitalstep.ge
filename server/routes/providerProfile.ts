import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { providerProfileSchema } from '../validation/providerProfile.js'

export const providerProfileRouter = Router()
const profileSelect = { slug: true, displayName: true, headline: true, description: true, category: true, website: true, location: true, languages: true, portfolioSummary: true, socialLinks: true, createdAt: true, updatedAt: true } as const

providerProfileRouter.get('/public/:slug', async (request, response, next) => {
  try {
    const profile = await prisma.providerProfile.findFirst({ where: { slug: request.params.slug.toLowerCase(), user: { role: 'PROVIDER', providerStatus: 'VERIFIED' } }, select: profileSelect })
    if (!profile) return response.status(404).json({ error: { code: 'PROVIDER_PROFILE_NOT_FOUND' } })
    return response.json({ data: { profile: { ...profile, socialLinks: Array.isArray(profile.socialLinks) ? profile.socialLinks : [] } } })
  } catch (error) { next(error) }
})

providerProfileRouter.use(requireAuth, requireRole('PROVIDER'))
providerProfileRouter.get('/me', async (request, response, next) => {
  try {
    const account = await prisma.user.findUnique({ where: { id: request.auth!.userId }, select: { firstName: true, lastName: true, providerStatus: true, providerProfile: { select: profileSelect } } })
    if (!account) return response.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
    return response.json({ data: { status: account.providerStatus, profile: account.providerProfile ? { ...account.providerProfile, socialLinks: Array.isArray(account.providerProfile.socialLinks) ? account.providerProfile.socialLinks : [] } : null, defaults: { displayName: `${account.firstName} ${account.lastName}`.trim() } } })
  } catch (error) { next(error) }
})

providerProfileRouter.put('/me', async (request, response, next) => {
  const parsed = providerProfileSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR' } })
  try {
    const { socialLinks, ...values } = parsed.data
    const profile = await prisma.$transaction(async transaction => {
      const existing = await transaction.providerProfile.findUnique({ where: { userId: request.auth!.userId }, select: { slug: true } })
      const conflict = await transaction.providerProfile.findFirst({ where: { slug: values.slug, userId: { not: request.auth!.userId } }, select: { id: true } })
      if (conflict) throw new Error('SLUG_TAKEN')
      const saved = await transaction.providerProfile.upsert({ where: { userId: request.auth!.userId }, create: { userId: request.auth!.userId, ...values, socialLinks }, update: { ...values, socialLinks }, select: profileSelect })
      if (!existing || existing.slug !== saved.slug) await transaction.user.update({ where: { id: request.auth!.userId }, data: { providerSlug: saved.slug } })
      return saved
    })
    return response.json({ data: { profile: { ...profile, socialLinks: Array.isArray(profile.socialLinks) ? profile.socialLinks : [] } } })
  } catch (error) {
    if ((error instanceof Error && error.message === 'SLUG_TAKEN') || (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')) return response.status(409).json({ error: { code: 'SLUG_TAKEN' } })
    next(error)
  }
})
