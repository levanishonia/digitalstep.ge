import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { aiConfig } from '../ai/config.js'
import { AIProviderError } from '../ai/types.js'
import { AIService } from '../ai/service.js'
import { openAIProvider } from '../ai/openAIProvider.js'
import { buildBusinessContext, type BusinessProfile } from '../../shared/businessProfile.js'
import { canUseFeature, getUsageLimit, type SubscriptionPlan } from '../../src/domain/subscriptions.js'

export const studioAssistantRouter = Router()
studioAssistantRouter.use(requireAuth)
const aiService = new AIService(openAIProvider)
const periodKey = (date = new Date()) => date.toISOString().slice(0, 7)
const messageSchema = z.object({ conversationId: z.string().cuid().optional(), message: z.string().trim().min(1).max(aiConfig.maxMessageCharacters), retryMessageId: z.string().cuid().optional(), locale: z.enum(['ka', 'en']).default('ka') }).strict()
const idSchema = z.string().cuid()
const limiter = rateLimit({ windowMs: 60_000, limit: 12, standardHeaders: true, legacyHeaders: false, handler: (_req, res) => res.status(429).json({ error: { code: 'RATE_LIMITED' } }) })

async function userAccess(userId: string) {
  return prisma.user.findUnique({ where: { id: userId }, select: { subscriptionPlan: true, businessProfile: true } })
}
async function usage(userId: string, plan: SubscriptionPlan) {
  const period = periodKey(), limit = getUsageLimit(plan, 'AI_REQUESTS')
  const row = await prisma.aIUsage.findUnique({ where: { userId_feature_periodKey: { userId, feature: 'AI_ASSISTANT', periodKey: period } } })
  const used = row?.requestCount ?? 0
  return { plan, feature: 'AI_ASSISTANT' as const, used, limit, remaining: Math.max(0, limit - used), period }
}
async function reserve(userId: string, limit: number) {
  const period = periodKey()
  return prisma.$transaction(async tx => {
    const lockKey = `${userId}:AI_ASSISTANT:${period}`
    await tx.$queryRaw`SELECT pg_advisory_xact_lock(hashtextextended(${lockKey}, 0))`
    await tx.aIUsageReservation.deleteMany({ where: { expiresAt: { lte: new Date() } } })
    const usageRow = await tx.aIUsage.upsert({ where: { userId_feature_periodKey: { userId, feature: 'AI_ASSISTANT', periodKey: period } }, create: { userId, feature: 'AI_ASSISTANT', periodKey: period }, update: {} })
    const activeReservations = await tx.aIUsageReservation.count({ where: { userId, feature: 'AI_ASSISTANT', periodKey: period, expiresAt: { gt: new Date() } } })
    if (usageRow.requestCount + activeReservations >= limit) return null
    return tx.aIUsageReservation.create({ data: { userId, feature: 'AI_ASSISTANT', periodKey: period, expiresAt: new Date(Date.now() + aiConfig.reservationLeaseMs) }, select: { id: true, periodKey: true } })
  })
}
const release = (reservationId: string, userId: string) => prisma.aIUsageReservation.deleteMany({ where: { id: reservationId, userId } })

studioAssistantRouter.get('/usage', async (req, res) => {
  const access = await userAccess(req.auth!.userId)
  if (!access) return res.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
  return res.json({ data: await usage(req.auth!.userId, access.subscriptionPlan) })
})
studioAssistantRouter.get('/assistant/conversations', async (req, res) => {
  const conversations = await prisma.aIConversation.findMany({ where: { userId: req.auth!.userId }, select: { id: true, title: true, createdAt: true, updatedAt: true }, orderBy: { updatedAt: 'desc' } })
  return res.json({ data: { conversations } })
})
studioAssistantRouter.get('/assistant/conversations/:id', async (req, res) => {
  if (!idSchema.safeParse(req.params.id).success) return res.status(404).json({ error: { code: 'CONVERSATION_NOT_FOUND' } })
  const conversation = await prisma.aIConversation.findFirst({ where: { id: req.params.id, userId: req.auth!.userId }, select: { id: true, title: true, createdAt: true, updatedAt: true, messages: { select: { id: true, role: true, content: true, createdAt: true }, orderBy: { createdAt: 'asc' } } } })
  return conversation ? res.json({ data: { conversation } }) : res.status(404).json({ error: { code: 'CONVERSATION_NOT_FOUND' } })
})
studioAssistantRouter.delete('/assistant/conversations/:id', async (req, res) => {
  if (!idSchema.safeParse(req.params.id).success) return res.status(404).json({ error: { code: 'CONVERSATION_NOT_FOUND' } })
  const result = await prisma.aIConversation.deleteMany({ where: { id: req.params.id, userId: req.auth!.userId } })
  return result.count ? res.status(204).end() : res.status(404).json({ error: { code: 'CONVERSATION_NOT_FOUND' } })
})
studioAssistantRouter.post('/assistant/chat', limiter, async (req, res) => {
  const parsed = messageSchema.safeParse(req.body)
  if (!parsed.success) return res.status(400).json({ error: { code: 'INVALID_MESSAGE' } })
  const userId = req.auth!.userId, access = await userAccess(userId)
  if (!access) return res.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
  if (!canUseFeature(access.subscriptionPlan, 'AI_ASSISTANT')) return res.status(403).json({ error: { code: 'FORBIDDEN' } })
  let conversation = parsed.data.conversationId ? await prisma.aIConversation.findFirst({ where: { id: parsed.data.conversationId, userId } }) : null
  if (parsed.data.conversationId && !conversation) return res.status(404).json({ error: { code: 'CONVERSATION_NOT_FOUND' } })
  if (!conversation) conversation = await prisma.aIConversation.create({ data: { userId, title: parsed.data.message.slice(0, 50) } })
  let userMessage = parsed.data.retryMessageId ? await prisma.aIMessage.findFirst({ where: { id: parsed.data.retryMessageId, conversationId: conversation.id, role: 'USER', content: parsed.data.message } }) : null
  if (parsed.data.retryMessageId && !userMessage) return res.status(400).json({ error: { code: 'INVALID_MESSAGE' } })
  if (!userMessage) userMessage = await prisma.aIMessage.create({ data: { conversationId: conversation.id, role: 'USER', content: parsed.data.message } })
  const limit = getUsageLimit(access.subscriptionPlan, 'AI_REQUESTS')
  const reservation = await reserve(userId, limit)
  if (!reservation) return res.status(429).json({ error: { code: 'AI_USAGE_LIMIT_REACHED', retryMessageId: userMessage.id, conversationId: conversation.id } })
  try {
    const history = await prisma.aIMessage.findMany({ where: { conversationId: conversation.id }, orderBy: { createdAt: 'desc' }, take: aiConfig.historyMessageLimit })
    const profile = access.businessProfile as unknown as BusinessProfile | null
    const result = await aiService.generateChatResponse({ locale: parsed.data.locale, businessContext: profile ? buildBusinessContext(profile) : null, messages: history.reverse().map(message => ({ role: message.role === 'USER' ? 'user' : 'assistant', content: message.content })) })
    const assistantMessage = await prisma.$transaction(async tx => {
      const created = await tx.aIMessage.create({ data: { conversationId: conversation!.id, role: 'ASSISTANT', content: result.content } })
      await tx.aIConversation.update({ where: { id: conversation!.id }, data: { updatedAt: new Date() } })
      const consumed = await tx.aIUsageReservation.deleteMany({ where: { id: reservation.id, userId, periodKey: reservation.periodKey } })
      if (consumed.count !== 1) throw new Error('AI usage reservation expired')
      await tx.aIUsage.update({ where: { userId_feature_periodKey: { userId, feature: 'AI_ASSISTANT', periodKey: reservation.periodKey } }, data: { requestCount: { increment: 1 } } })
      return created
    })
    return res.json({ data: { conversation: { id: conversation.id, title: conversation.title }, userMessage, assistantMessage, usage: await usage(userId, access.subscriptionPlan) } })
  } catch (error) {
    await release(reservation.id, userId).catch(() => undefined)
    const code = error instanceof AIProviderError ? error.kind === 'NOT_CONFIGURED' ? 'AI_NOT_CONFIGURED' : error.kind === 'RATE_LIMITED' ? 'RATE_LIMITED' : 'AI_PROVIDER_ERROR' : 'INTERNAL_ERROR'
    console.error('AI assistant generation failed', error instanceof AIProviderError ? error.kind : 'UnknownError')
    return res.status(code === 'RATE_LIMITED' ? 429 : code === 'AI_NOT_CONFIGURED' ? 503 : 502).json({ error: { code, retryMessageId: userMessage.id, conversationId: conversation.id } })
  }
})
