import { Router } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'

export const notificationsRouter = Router()
notificationsRouter.use(requireAuth)

notificationsRouter.get('/', async (request, response, next) => {
  const parsed = z.object({ unread: z.enum(['true', 'false']).optional(), limit: z.coerce.number().int().min(1).max(50).default(30) }).safeParse(request.query)
  if (!parsed.success) return response.status(400).json({ error: { code: 'INVALID_NOTIFICATION_QUERY' } })
  try {
    const userId = request.auth!.userId
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where: { userId, ...(parsed.data.unread === 'true' ? { readAt: null } : {}) }, orderBy: { createdAt: 'desc' }, take: parsed.data.limit }),
      prisma.notification.count({ where: { userId, readAt: null } }),
    ])
    return response.json({ data: { notifications, unreadCount } })
  } catch (error) { next(error) }
})

notificationsRouter.get('/unread-count', async (request, response, next) => {
  try { return response.json({ data: { count: await prisma.notification.count({ where: { userId: request.auth!.userId, readAt: null } }) } }) } catch (error) { next(error) }
})

notificationsRouter.patch('/:id/read', async (request, response, next) => {
  try {
    const userId = request.auth!.userId
    const existing = await prisma.notification.findFirst({ where: { id: request.params.id, userId } })
    if (!existing) return response.status(404).json({ error: { code: 'NOTIFICATION_NOT_FOUND' } })
    const notification = existing.readAt ? existing : await prisma.notification.update({ where: { id: existing.id }, data: { readAt: new Date() } })
    return response.json({ data: { notification } })
  } catch (error) { next(error) }
})

notificationsRouter.post('/read-all', async (request, response, next) => {
  try {
    const result = await prisma.notification.updateMany({ where: { userId: request.auth!.userId, readAt: null }, data: { readAt: new Date() } })
    return response.json({ data: { updatedCount: result.count } })
  } catch (error) { next(error) }
})
