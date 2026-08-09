import { Router } from 'express'
import type { OrderStatus, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { canProviderTransitionOrderStatus } from '../lib/providerOrderStatus.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { providerStatusUpdateSchema } from '../validation/providerOrders.js'

export const providerOrdersRouter = Router()
providerOrdersRouter.use(requireAuth, requireRole('PROVIDER'))

const customerSelect = { firstName: true, lastName: true } as const
const include = { customer: { select: customerSelect } } as const
type ProviderOrder = Prisma.OrderGetPayload<{ include: typeof include }>
const safe = (order: ProviderOrder) => ({
  id: order.id, orderNumber: order.orderNumber, serviceId: order.serviceId,
  serviceSlug: order.serviceSlug, serviceTitle: { ka: order.serviceTitleKa, en: order.serviceTitleEn },
  providerSlug: order.providerSlug, providerName: order.providerName, packageId: order.packageId,
  packageName: { ka: order.packageNameKa, en: order.packageNameEn }, priceMinor: order.priceMinor,
  currency: order.currency, status: order.status, paymentStatus: order.paymentStatus,
  requirements: order.requirementsText, referenceLinks: Array.isArray(order.referenceLinks) ? order.referenceLinks : [],
  deliveryDate: order.deliveryDate, createdAt: order.createdAt, updatedAt: order.updatedAt,
  customer: order.customer ? { firstName: order.customer.firstName, lastName: order.customer.lastName } : null,
})

providerOrdersRouter.get('/', async (request, response, next) => {
  try {
    const status = typeof request.query.status === 'string' ? request.query.status : undefined
    const allowed: OrderStatus[] = ['PENDING','CONFIRMED','IN_PROGRESS','IN_REVIEW','COMPLETED','CANCELLED']
    if (status && !allowed.includes(status as OrderStatus)) return response.status(400).json({ error: { code: 'INVALID_STATUS' } })
    const orders = await prisma.order.findMany({ where: { providerUserId: request.auth!.userId, ...(status ? { status: status as OrderStatus } : {}) }, include, orderBy: { createdAt: 'desc' } })
    return response.json({ data: { orders: orders.map(safe) } })
  } catch (error) { next(error) }
})

providerOrdersRouter.get('/:id', async (request, response, next) => {
  try {
    const order = await prisma.order.findFirst({ where: { id: request.params.id, providerUserId: request.auth!.userId }, include })
    if (!order) return response.status(404).json({ error: { code: 'ORDER_NOT_FOUND' } })
    return response.json({ data: { order: safe(order) } })
  } catch (error) { next(error) }
})

providerOrdersRouter.patch('/:id/status', async (request, response, next) => {
  const parsed = providerStatusUpdateSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: { code: 'INVALID_STATUS_TRANSITION' } })
  try {
    const current = await prisma.order.findFirst({ where: { id: request.params.id, providerUserId: request.auth!.userId }, select: { status: true } })
    if (!current) return response.status(404).json({ error: { code: 'ORDER_NOT_FOUND' } })
    if (!canProviderTransitionOrderStatus(current.status, parsed.data.status)) return response.status(409).json({ error: { code: 'INVALID_STATUS_TRANSITION' } })
    const order = await prisma.order.update({ where: { id: request.params.id }, data: { status: parsed.data.status }, include })
    return response.json({ data: { order: safe(order) } })
  } catch (error) { next(error) }
})
