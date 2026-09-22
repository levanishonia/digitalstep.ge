import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

export const catalogRouter = Router()

// Public catalog presentation data only. Administrative attribution is never
// exposed from this endpoint.
catalogRouter.get('/overrides', async (_request, response, next) => {
  try {
    const overrides = await prisma.catalogServiceOverride.findMany({
      select: {
        serviceId: true,
        titleKa: true,
        titleEn: true,
        descriptionKa: true,
        descriptionEn: true,
        category: true,
        priceMinor: true,
        deliveryDays: true,
        status: true,
        packages: true,
      },
    })
    response.json({ data: { overrides } })
  } catch (error) {
    next(error)
  }
})
