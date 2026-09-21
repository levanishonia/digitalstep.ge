import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { createNotification } from '../lib/notifications.js'

export const messagesRouter = Router()
messagesRouter.use(requireAuth)

const participantSelect = { id: true, firstName: true, lastName: true, providerSlug: true } as const
const orderSelect = { id: true, orderNumber: true, serviceTitleKa: true, serviceTitleEn: true, packageNameKa: true, packageNameEn: true, status: true } as const
const memberWhere = (userId: string) => ({ OR: [{ customerUserId: userId }, { providerUserId: userId }] })
const name = (user: { firstName: string; lastName: string }) => `${user.firstName} ${user.lastName}`.trim()

messagesRouter.get('/conversations', async (request, response, next) => {
  try {
    const userId = request.auth!.userId
    const conversations = await prisma.conversation.findMany({
      where: memberWhere(userId), orderBy: { updatedAt: 'desc' },
      include: {
        order: { select: orderSelect }, customer: { select: participantSelect }, provider: { select: participantSelect },
        messages: { orderBy: { createdAt: 'desc' }, take: 1, select: { content: true, createdAt: true } },
        _count: { select: { messages: { where: { readAt: null, senderUserId: { not: userId } } } } },
      },
    })
    return response.json({ data: { conversations: conversations.map((item) => {
      const other = item.customerUserId === userId ? item.provider : item.customer
      return { id: item.id, orderId: item.orderId, orderNumber: item.order.orderNumber, serviceTitle: { ka: item.order.serviceTitleKa, en: item.order.serviceTitleEn }, participant: { id: other.id, displayName: name(other), providerSlug: other.providerSlug }, lastMessage: item.messages[0]?.content ?? '', lastMessageAt: item.messages[0]?.createdAt ?? item.createdAt, unreadCount: item._count.messages, updatedAt: item.updatedAt }
    }) } })
  } catch (error) { next(error) }
})

messagesRouter.get('/unread-count', async (request, response, next) => {
  try {
    const userId = request.auth!.userId
    const count = await prisma.message.count({ where: { readAt: null, senderUserId: { not: userId }, conversation: memberWhere(userId) } })
    return response.json({ data: { count } })
  } catch (error) { next(error) }
})

messagesRouter.get('/conversations/:id', async (request, response, next) => {
  try {
    const userId = request.auth!.userId
    const conversation = await prisma.conversation.findFirst({ where: { id: request.params.id, ...memberWhere(userId) }, include: { order: { select: orderSelect }, customer: { select: participantSelect }, provider: { select: participantSelect }, messages: { orderBy: { createdAt: 'asc' }, select: { id: true, senderUserId: true, content: true, createdAt: true, readAt: true } } } })
    if (!conversation) return response.status(404).json({ error: { code: 'CONVERSATION_NOT_FOUND' } })
    const other = conversation.customerUserId === userId ? conversation.provider : conversation.customer
    return response.json({ data: { conversation: { id: conversation.id, orderId: conversation.orderId, customerUserId: conversation.customerUserId, providerUserId: conversation.providerUserId, participant: { id: other.id, displayName: name(other), providerSlug: other.providerSlug }, order: { id: conversation.order.id, orderNumber: conversation.order.orderNumber, serviceTitle: { ka: conversation.order.serviceTitleKa, en: conversation.order.serviceTitleEn }, packageName: { ka: conversation.order.packageNameKa, en: conversation.order.packageNameEn }, status: conversation.order.status }, messages: conversation.messages, createdAt: conversation.createdAt, updatedAt: conversation.updatedAt } } })
  } catch (error) { next(error) }
})

const messageSchema = z.object({ content: z.string().trim().min(1).max(3000) }).strict()
messagesRouter.post('/conversations/:id/messages', async (request, response, next) => {
  const parsed = messageSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: { code: 'INVALID_MESSAGE' } })
  try {
    const userId = request.auth!.userId
    const conversation = await prisma.conversation.findFirst({ where: { id: request.params.id, ...memberWhere(userId) }, select: { id: true, customerUserId: true, providerUserId: true } })
    if (!conversation) return response.status(404).json({ error: { code: 'CONVERSATION_NOT_FOUND' } })
    const message = await prisma.$transaction(async (tx) => {
      const saved = await tx.message.create({ data: { conversationId: conversation.id, senderUserId: userId, content: parsed.data.content }, select: { id: true, senderUserId: true, content: true, createdAt: true, readAt: true } })
      await tx.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } })
      return saved
    })
    const recipientId = conversation.customerUserId === userId ? conversation.providerUserId : conversation.customerUserId
    await createNotification({ userId: recipientId, type: 'NEW_MESSAGE', data: { conversationId: conversation.id, recipientPerspective: conversation.providerUserId === recipientId ? 'PROVIDER' : 'CUSTOMER' } })
    return response.status(201).json({ data: { message } })
  } catch (error) { next(error) }
})

const readSchema = z.object({ messageIds: z.array(z.string().min(1)).max(1000) }).strict()
messagesRouter.post('/conversations/:id/read', async (request, response, next) => {
  const parsed = readSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: { code: 'INVALID_MESSAGE' } })
  try {
    const userId = request.auth!.userId
    const conversation = await prisma.conversation.findFirst({ where: { id: request.params.id, ...memberWhere(userId) }, select: { id: true } })
    if (!conversation) return response.status(404).json({ error: { code: 'CONVERSATION_NOT_FOUND' } })
    if (parsed.data.messageIds.length > 0) {
      await prisma.message.updateMany({ where: { id: { in: parsed.data.messageIds }, conversationId: conversation.id, senderUserId: { not: userId }, readAt: null }, data: { readAt: new Date() } })
    }
    return response.json({ data: { success: true } })
  } catch (error) { next(error) }
})
