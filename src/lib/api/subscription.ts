import type { StudioFeature,SubscriptionPlan } from '../../domain/subscriptions'
export interface SubscriptionUsage {feature:StudioFeature;used:number;limit:number;remaining:number}
export interface SubscriptionState {plan:SubscriptionPlan;status:'ACTIVE';billingEnabled:boolean;period:string;features:Partial<Record<StudioFeature,boolean>>;usage:SubscriptionUsage[]}
export async function getSubscription():Promise<SubscriptionState>{
  const response=await fetch('/api/subscription',{credentials:'include'})
  const body=await response.json().catch(()=>null) as {data?:SubscriptionState}|null
  if(!response.ok||!body?.data)throw new Error('SUBSCRIPTION_UNAVAILABLE')
  return body.data
}
