import type { NextFunction, Request, Response } from 'express'
import { canUseFeature, type StudioFeature } from '../../shared/subscriptions.js'
import { getSubscriptionState } from '../billing/subscriptionService.js'

/** Enforces Studio access from the authenticated database user, never client state. */
export const requireStudioFeature = (feature: StudioFeature) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const state = await getSubscriptionState(request.auth!.userId)
    if (!state) return response.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
    if (!canUseFeature(state.effective.plan, feature)) return response.status(403).json({ error: { code: 'STUDIO_FEATURE_REQUIRES_PAID_PLAN', feature } })
    next()
  } catch (error) { next(error) }
}
