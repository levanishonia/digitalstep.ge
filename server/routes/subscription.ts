import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { prisma } from '../lib/prisma.js'
import { billingEnabled, planDefinitions, type StudioFeature, type UsageMetric } from '../../shared/subscriptions.js'

export const subscriptionRouter = Router()
subscriptionRouter.use(requireAuth)

const usageMap: Partial<Record<StudioFeature, UsageMetric>> = {
  AI_ASSISTANT:'AI_REQUESTS', POST_GENERATOR:'POST_GENERATIONS', CONTENT_IDEAS:'CONTENT_IDEA_GENERATIONS',
  MARKETING_PLANNER:'MARKETING_PLAN_GENERATIONS', BUSINESS_ANALYSIS:'BUSINESS_ANALYSIS_GENERATIONS',
}

subscriptionRouter.get('/', async (request,response,next) => {
  try {
    const user=await prisma.user.findUnique({where:{id:request.auth!.userId},select:{subscriptionPlan:true}})
    if(!user)return response.status(401).json({error:{code:'UNAUTHENTICATED'}})
    const period=new Date().toISOString().slice(0,7)
    const rows=await prisma.aIUsage.findMany({where:{userId:request.auth!.userId,periodKey:period},select:{feature:true,requestCount:true}})
    const used=new Map<string,number>(rows.map(row=>[row.feature,row.requestCount]))
    const definition=planDefinitions[user.subscriptionPlan]
    const usage=Object.entries(usageMap).map(([feature,metric])=>{
      const limit=definition.limits[metric!], count=used.get(feature)??0
      return {feature,used:count,limit,remaining:Math.max(0,limit-count)}
    })
    return response.json({data:{plan:user.subscriptionPlan,status:'ACTIVE',billingEnabled,period,features:Object.fromEntries(definition.features.map(feature=>[feature,true])),usage}})
  } catch(error){next(error)}
})
