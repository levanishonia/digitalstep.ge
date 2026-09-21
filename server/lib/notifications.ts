import type { NotificationType, Prisma } from '@prisma/client'
import { prisma } from './prisma.js'

type SafeNotificationData = {
  orderId?: string
  orderNumber?: string
  conversationId?: string
  serviceId?: string
  feature?: string
  period?: string
  recipientPerspective?: 'CUSTOMER' | 'PROVIDER'
}

/** Notifications are non-critical: a successful domain action is never undone if this write fails. */
export async function createNotification(input: { userId: string; type: NotificationType; data?: SafeNotificationData; dedupeKey?: string }) {
  try {
    return await prisma.notification.create({ data: { userId: input.userId, type: input.type, data: input.data as Prisma.InputJsonValue | undefined, dedupeKey: input.dedupeKey } })
  } catch (error) {
    console.error('Notification creation failed', { type: input.type, userId: input.userId, error: error instanceof Error ? error.message : 'Unknown error' })
    return null
  }
}
