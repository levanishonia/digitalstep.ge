import type { OrderStatus } from '@prisma/client'

export const providerOrderTransitions: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'IN_PROGRESS',
  IN_PROGRESS: 'IN_REVIEW',
  IN_REVIEW: 'COMPLETED',
}

export function canProviderTransitionOrderStatus(current: OrderStatus, next: OrderStatus) {
  return providerOrderTransitions[current] === next
}
