import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'
import { type StudioFeature, type UsageMetric } from '../../shared/subscriptions.js'
import { billingProvider } from '../billing/provider.js'
import { getSubscriptionState } from '../billing/subscriptionService.js'
import { rateLimit } from 'express-rate-limit'
import { z } from 'zod'
import { sendTransactionalEmail } from '../email/service.js'
import { subscriptionRequestTemplate } from '../email/templates.js'

export const subscriptionRouter = Router()
subscriptionRouter.use(requireAuth)

const usageMap: Partial<Record<StudioFeature, UsageMetric>> = {
  AI_ASSISTANT:'AI_REQUESTS', POST_GENERATOR:'POST_GENERATIONS', CONTENT_IDEAS:'CONTENT_IDEA_GENERATIONS',
  MARKETING_PLANNER:'MARKETING_PLAN_GENERATIONS', BUSINESS_ANALYSIS:'BUSINESS_ANALYSIS_GENERATIONS',
}

subscriptionRouter.get('/', async (request,response,next) => {
  try {
    const state=await getSubscriptionState(request.auth!.userId)
    if(!state)return response.status(401).json({error:{code:'UNAUTHENTICATED'}})
    const period=new Date().toISOString().slice(0,7)
    const rows=await prisma.aIUsage.findMany({where:{userId:request.auth!.userId,periodKey:period},select:{feature:true,requestCount:true}})
    const used=new Map<string,number>(rows.map(row=>[row.feature,row.requestCount]))
    const {user,effective,definition}=state
    const usage=Object.entries(usageMap).map(([feature,metric])=>{
      const limit=definition.limits[metric!], count=used.get(feature)??0
      return {feature,used:count,limit,remaining:Math.max(0,limit-count)}
    })
    return response.json({data:{plan:effective.plan,source:effective.source,status:user.subscription?.status??(effective.source==='MANUAL_OVERRIDE'?'ACTIVE':'FREE'),billingEnabled:billingProvider.configured,provider:user.subscription?.billingProvider??null,currentPeriodStart:user.subscription?.currentPeriodStart??null,currentPeriodEnd:user.subscription?.currentPeriodEnd??null,cancelAtPeriodEnd:user.subscription?.cancelAtPeriodEnd??false,manualOverrideExpiresAt:user.manualPlanOverrideExpiresAt??null,period,features:Object.fromEntries(definition.features.map(feature=>[feature,true])),usage}})
  } catch(error){next(error)}
})

const requestLimiter=rateLimit({windowMs:15*60_000,limit:3,standardHeaders:true,legacyHeaders:false,message:{error:{code:'RATE_LIMITED'}}})
const requestSchema=z.object({plan:z.enum(['PRO','BUSINESS']),message:z.string().trim().max(1000).optional()})
subscriptionRouter.post('/upgrade-request',requestLimiter,async(request,response)=>{
  const parsed=requestSchema.safeParse(request.body)
  if(!parsed.success)return response.status(400).json({error:{code:'INVALID_UPGRADE_REQUEST'}})
  const recipient=process.env.SUBSCRIPTION_REQUEST_RECIPIENT_EMAIL
  if(!recipient)return response.status(503).json({error:{code:'UPGRADE_REQUEST_UNAVAILABLE'}})
  const [user,state]=await Promise.all([prisma.user.findUnique({where:{id:request.auth!.userId},select:{firstName:true,lastName:true,email:true}}),getSubscriptionState(request.auth!.userId)])
  if(!user||!state)return response.status(401).json({error:{code:'UNAUTHENTICATED'}})
  try{await sendTransactionalEmail({to:recipient,recipientName:'Digital Step',template:'studio-plan-request',content:subscriptionRequestTemplate({name:`${user.firstName} ${user.lastName}`,email:user.email,currentPlan:state.effective.plan,requestedPlan:parsed.data.plan,message:parsed.data.message,timestamp:new Date()})});return response.status(201).json({data:{received:true}})}
  catch{return response.status(502).json({error:{code:'UPGRADE_REQUEST_DELIVERY_FAILED'}})}
})
