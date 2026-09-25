import { randomBytes } from 'node:crypto'
import { Router } from 'express'
import { prisma } from '../lib/prisma.js'
import { requireAuth } from '../middleware/auth.js'
import { createOrderSchema } from '../validation/orders.js'
import { findOrderService, type OrderCatalogPackage, type OrderCatalogService } from '../../shared/orderCatalog.js'
import { createNotification } from '../lib/notifications.js'
export const ordersRouter=Router()
ordersRouter.use(requireAuth)
interface StoredOrder{id:string;orderNumber:string;serviceId:string;serviceSlug:string;serviceTitleKa:string;serviceTitleEn:string;serviceSource:'DIGITAL_STEP'|'VERIFIED_PROVIDER';providerSlug:string;providerName:string;packageId:string;packageNameKa:string;packageNameEn:string;priceMinor:number;currency:string;status:string;paymentStatus:string;requirementsText:string;referenceLinks:unknown;deliveryDate:Date;createdAt:Date;updatedAt:Date}
const safe=(o:StoredOrder)=>({id:o.id,orderNumber:o.orderNumber,serviceId:o.serviceId,serviceSlug:o.serviceSlug,serviceTitle:{ka:o.serviceTitleKa,en:o.serviceTitleEn},providerSlug:o.providerSlug,providerName:o.providerName,serviceSource:o.serviceSource,packageId:o.packageId,packageName:{ka:o.packageNameKa,en:o.packageNameEn},priceMinor:o.priceMinor,currency:o.currency,status:o.status,paymentStatus:o.paymentStatus,requirements:o.requirementsText,referenceLinks:Array.isArray(o.referenceLinks)?o.referenceLinks:[],deliveryDate:o.deliveryDate,createdAt:o.createdAt,updatedAt:o.updatedAt})
ordersRouter.post('/',async(req,res,next)=>{
 const parsed=createOrderSchema.safeParse(req.body)
 if(!parsed.success)return res.status(400).json({error:{code:'INVALID_ORDER_REQUEST'}})
 try{
  const staticService=findOrderService(parsed.data.serviceSlug)
  const override=staticService?await prisma.catalogServiceOverride.findUnique({where:{serviceId:staticService.id}}):await prisma.catalogServiceOverride.findFirst({where:{slug:parsed.data.serviceSlug,isCustom:true}})
  if(override&&override.status!=='ACTIVE')return res.status(404).json({error:{code:'SERVICE_NOT_FOUND'}})
  const storedPackages=Array.isArray(override?.packages)?override.packages as Array<{key:string;nameKa:string;nameEn:string;priceMinor:number;deliveryDays:number;features:{textKa:string;textEn:string}[]}>:null
  let service:OrderCatalogService|undefined=staticService
  if(!service&&override?.isCustom&&override.slug){
   const packages:OrderCatalogPackage[]=(storedPackages??[]).map(pack=>({id:pack.key,name:{ka:pack.nameKa,en:pack.nameEn},priceMinor:pack.priceMinor,deliveryDays:pack.deliveryDays,features:pack.features.map(feature=>({ka:feature.textKa,en:feature.textEn}))}))
   service={id:override.serviceId,slug:override.slug,title:{ka:override.titleKa,en:override.titleEn},providerName:'Digital Step Team',providerSlug:'digital-step-team',serviceSource:'DIGITAL_STEP',status:override.status,packages}
  }
  if(!service)return res.status(404).json({error:{code:'SERVICE_NOT_FOUND'}})
  const basePack=service.packages.find(pack=>pack.id===parsed.data.packageId)
  if(!basePack)return res.status(404).json({error:{code:'PACKAGE_NOT_FOUND'}})
  const packageIndex=service.packages.findIndex(pack=>pack.id===parsed.data.packageId),packageOverride=storedPackages?.[packageIndex]
  const pack=packageOverride?{...basePack,name:{ka:packageOverride.nameKa,en:packageOverride.nameEn},priceMinor:packageOverride.priceMinor,deliveryDays:packageOverride.deliveryDays}:parsed.data.packageId==='basic'&&override?{...basePack,priceMinor:override.priceMinor,deliveryDays:override.deliveryDays}:basePack
  const resolvedService=override&&!override.statusOnly?{...service,title:{ka:override.titleKa,en:override.titleEn}}:service
  const deliveryDate=new Date();deliveryDate.setUTCDate(deliveryDate.getUTCDate()+pack.deliveryDays)
  const provider=resolvedService.serviceSource==='VERIFIED_PROVIDER'?await prisma.user.findFirst({where:{providerSlug:resolvedService.providerSlug,role:'PROVIDER',providerStatus:'VERIFIED'},select:{id:true}}):null
  if(resolvedService.serviceSource==='VERIFIED_PROVIDER'&&!provider)return res.status(503).json({error:{code:'INTERNAL_PROVIDER_UNAVAILABLE'}})
  const order=await prisma.order.create({data:{orderNumber:`DS-${randomBytes(6).toString('hex').toUpperCase()}`,customerId:req.auth!.userId,providerUserId:provider?.id,serviceId:resolvedService.id,serviceSlug:resolvedService.slug,serviceTitleKa:resolvedService.title.ka,serviceTitleEn:resolvedService.title.en,serviceSource:resolvedService.serviceSource,providerSlug:resolvedService.providerSlug,providerName:resolvedService.providerName,packageId:pack.id,packageNameKa:pack.name.ka,packageNameEn:pack.name.en,priceMinor:pack.priceMinor,paymentStatus:'NOT_REQUIRED',requirementsText:parsed.data.requirements,referenceLinks:parsed.data.referenceLinks??[],deliveryDate}})
  await Promise.all([createNotification({userId:req.auth!.userId,type:'ORDER_CREATED',data:{orderId:order.id,orderNumber:order.orderNumber,recipientPerspective:'CUSTOMER'}}),...(provider?[createNotification({userId:provider.id,type:'ORDER_CREATED' as const,data:{orderId:order.id,orderNumber:order.orderNumber,recipientPerspective:'PROVIDER'}})]:[])])
  return res.status(201).json({data:{order:safe(order)}})
 }catch(e){next(e)}
})
ordersRouter.get('/',async(req,res,next)=>{try{const orders=await prisma.order.findMany({where:{customerId:req.auth!.userId},orderBy:{createdAt:'desc'}});res.json({data:{orders:orders.map(safe)}})}catch(e){next(e)}})
ordersRouter.post('/:id/conversation',async(req,res,next)=>{try{const userId=req.auth!.userId;const order=await prisma.order.findUnique({where:{id:req.params.id},select:{id:true,customerId:true,providerUserId:true}});if(!order)return res.status(404).json({error:{code:'ORDER_NOT_FOUND'}});if(order.customerId!==userId&&order.providerUserId!==userId)return res.status(403).json({error:{code:'FORBIDDEN'}});if(!order.providerUserId)return res.status(409).json({error:{code:'PROVIDER_NOT_ASSIGNED'}});const conversation=await prisma.conversation.upsert({where:{orderId:order.id},update:{customerUserId:order.customerId,providerUserId:order.providerUserId},create:{orderId:order.id,customerUserId:order.customerId,providerUserId:order.providerUserId},select:{id:true,orderId:true}});return res.json({data:{conversation}})}catch(e){next(e)}})
ordersRouter.get('/:id',async(req,res,next)=>{try{const order=await prisma.order.findFirst({where:{id:req.params.id,customerId:req.auth!.userId}});if(!order)return res.status(404).json({error:{code:'ORDER_NOT_FOUND'}});res.json({data:{order:safe(order)}})}catch(e){next(e)}})
