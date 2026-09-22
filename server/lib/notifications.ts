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

/** Creates one threshold notification per feature and calendar month. */
export async function notifyAIUsageThreshold(input: { userId:string; feature:string; period:string; used:number; limit:number }) {
  const nearLimit=Math.ceil(input.limit*.8)
  const threshold=input.used===input.limit?'AI_USAGE_LIMIT_REACHED':input.used===nearLimit?'AI_USAGE_NEAR_LIMIT':null
  if(!threshold)return
  await createNotification({userId:input.userId,type:threshold,data:{feature:input.feature,period:input.period},dedupeKey:`${threshold}:${input.userId}:${input.feature}:${input.period}`})
}
