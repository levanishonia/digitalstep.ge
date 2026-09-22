import type { NextFunction, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { canUseFeature, type StudioFeature } from '../../shared/subscriptions.js'

/** Enforces Studio access from the authenticated database user, never client state. */
export const requireStudioFeature = (feature: StudioFeature) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: request.auth!.userId }, select: { subscriptionPlan: true } })
    if (!user) return response.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
    if (!canUseFeature(user.subscriptionPlan, feature)) return response.status(403).json({ error: { code: 'STUDIO_FEATURE_REQUIRES_PAID_PLAN', feature } })
    next()
  } catch (error) { next(error) }
}
