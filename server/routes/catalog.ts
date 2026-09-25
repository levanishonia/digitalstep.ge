import { Router } from 'express'
import { prisma } from '../lib/prisma.js'

export const catalogRouter = Router()

// Public catalog presentation data only. Administrative attribution is never
// exposed from this endpoint.
catalogRouter.get('/overrides', async (_request, response, next) => {
  try {
    const records = await prisma.catalogServiceOverride.findMany({
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
        isCustom: true,
        statusOnly: true,
        slug: true,
        serviceSource: true,
        isFeatured: true,
        isPopular: true,
        media: { orderBy: { sortOrder: 'asc' }, select: { id:true,type:true,url:true,width:true,height:true,duration:true,sortOrder:true,isPrimary:true } },
      },
    })
    // Custom unpublished services are omitted entirely. Code-owned services need
    // only their status marker so clients can suppress the built-in catalog row.
    const overrides:unknown[]=[]
    for(const record of records){if(record.status==='ACTIVE')overrides.push(record);else if(!record.isCustom)overrides.push({serviceId:record.serviceId,status:record.status,statusOnly:true,isCustom:false})}
    response.json({ data: { overrides } })
  } catch (error) {
    next(error)
  }
})
