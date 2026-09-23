import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'
import { type StudioFeature, type UsageMetric } from '../../shared/subscriptions.js'
import { billingProvider } from '../billing/provider.js'
import { getSubscriptionState } from '../billing/subscriptionService.js'

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
