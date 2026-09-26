import type { StudioFeature,SubscriptionPlan } from '../../domain/subscriptions'
export interface SubscriptionUsage {feature:StudioFeature;used:number;limit:number;remaining:number}
export interface SubscriptionState {plan:SubscriptionPlan;source:'MANUAL_OVERRIDE'|'BILLING'|'FREE';status:'ACTIVE'|'FREE'|'INCOMPLETE'|'PAST_DUE'|'CANCELLED'|'EXPIRED';billingEnabled:boolean;provider:string|null;currentPeriodStart:string|null;currentPeriodEnd:string|null;cancelAtPeriodEnd:boolean;manualOverrideExpiresAt:string|null;period:string;features:Partial<Record<StudioFeature,boolean>>;usage:SubscriptionUsage[]}
export async function getSubscription():Promise<SubscriptionState>{
  const response=await fetch('/api/subscription',{credentials:'include'})
  const body=await response.json().catch(()=>null) as {data?:SubscriptionState}|null
  if(!response.ok||!body?.data)throw new Error('SUBSCRIPTION_UNAVAILABLE')
  return body.data
}
export async function createCheckout(plan:'PRO'|'BUSINESS'):Promise<{redirectUrl:string}> {
  const response=await fetch('/api/billing/checkout',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan})})
  const body=await response.json().catch(()=>null) as {data?:{redirectUrl:string};error?:{code?:string}}|null
  if(!response.ok||!body?.data)throw new Error(body?.error?.code??'CHECKOUT_CREATION_FAILED')
  return body.data
}
export async function requestPlan(plan:'PRO'|'BUSINESS',message:string):Promise<void>{
  const response=await fetch('/api/subscription/upgrade-request',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan,message:message.trim()||undefined})})
  if(!response.ok)throw new Error('UPGRADE_REQUEST_FAILED')
}
