import type { Prisma, SubscriptionPlan } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { planDefinitions } from '../../shared/subscriptions.js'

export const subscriptionUserSelect={
  subscriptionPlan:true, manualPlanOverride:true, manualPlanOverrideExpiresAt:true,
  subscription:{select:{id:true,plan:true,status:true,billingProvider:true,currentPeriodStart:true,currentPeriodEnd:true,cancelAtPeriodEnd:true}},
} satisfies Prisma.UserSelect

type BillingUser=Prisma.UserGetPayload<{select:typeof subscriptionUserSelect}>
export function resolveEffectivePlan(user:BillingUser,now=new Date()):{plan:SubscriptionPlan;source:'MANUAL_OVERRIDE'|'BILLING'|'FREE'}{
  const overrideValid=user.manualPlanOverride&&(!user.manualPlanOverrideExpiresAt||user.manualPlanOverrideExpiresAt>now)
  if(overrideValid)return {plan:user.manualPlanOverride!,source:'MANUAL_OVERRIDE'}
  const paid=user.subscription
  const periodValid=!paid?.currentPeriodEnd||paid.currentPeriodEnd>now
  if(paid?.status==='ACTIVE'&&paid.plan!=='FREE'&&periodValid)return {plan:paid.plan,source:'BILLING'}
  return {plan:'FREE',source:'FREE'}
}
export async function getSubscriptionState(userId:string){
  const user=await prisma.user.findUnique({where:{id:userId},select:subscriptionUserSelect})
  if(!user)return null
  const effective=resolveEffectivePlan(user),definition=planDefinitions[effective.plan]
  return {user,effective,definition}
}
