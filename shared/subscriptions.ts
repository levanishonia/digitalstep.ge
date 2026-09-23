export const subscriptionPlans = ['FREE', 'PRO', 'BUSINESS'] as const
export type SubscriptionPlan = typeof subscriptionPlans[number]
export const studioFeatures = ['AI_ASSISTANT','POST_GENERATOR','CONTENT_CALENDAR','CONTENT_IDEAS','MARKETING_PLANNER','BUSINESS_ANALYSIS'] as const
export type StudioFeature = typeof studioFeatures[number]
export type UsageMetric = 'AI_REQUESTS'|'POST_GENERATIONS'|'CONTENT_IDEA_GENERATIONS'|'MARKETING_PLAN_GENERATIONS'|'BUSINESS_ANALYSIS_GENERATIONS'

export interface PlanDefinition {
  id: SubscriptionPlan
  descriptionKey: 'free'|'pro'|'business'
  features: readonly StudioFeature[]
  limits: Record<UsageMetric, number>
  highlighted: boolean
  billingProductKey: string|null
  priceMinor: number|null
  currency: 'GEL'
  purchasable: boolean
}

/** Product and enforcement policy shared by the API and UI. Billing is intentionally unavailable. */
export const planDefinitions: Record<SubscriptionPlan, PlanDefinition> = {
  FREE: { id:'FREE', descriptionKey:'free', highlighted:false, billingProductKey:null, priceMinor:0, currency:'GEL', purchasable:false, features:['AI_ASSISTANT'], limits:{AI_REQUESTS:10,POST_GENERATIONS:0,CONTENT_IDEA_GENERATIONS:0,MARKETING_PLAN_GENERATIONS:0,BUSINESS_ANALYSIS_GENERATIONS:0} },
  // Paid prices are deliberately null until the product owner and payment provider define them.
  PRO: { id:'PRO', descriptionKey:'pro', highlighted:true, billingProductKey:'pro', priceMinor:null, currency:'GEL', purchasable:false, features:['AI_ASSISTANT','POST_GENERATOR','CONTENT_CALENDAR','CONTENT_IDEAS','MARKETING_PLANNER'], limits:{AI_REQUESTS:100,POST_GENERATIONS:30,CONTENT_IDEA_GENERATIONS:30,MARKETING_PLAN_GENERATIONS:10,BUSINESS_ANALYSIS_GENERATIONS:0} },
  BUSINESS: { id:'BUSINESS', descriptionKey:'business', highlighted:false, billingProductKey:'business', priceMinor:null, currency:'GEL', purchasable:false, features:[...studioFeatures], limits:{AI_REQUESTS:500,POST_GENERATIONS:100,CONTENT_IDEA_GENERATIONS:100,MARKETING_PLAN_GENERATIONS:30,BUSINESS_ANALYSIS_GENERATIONS:20} },
}
export const canUseFeature=(plan:SubscriptionPlan,feature:StudioFeature)=>planDefinitions[plan].features.includes(feature)
export const getUsageLimit=(plan:SubscriptionPlan,metric:UsageMetric)=>planDefinitions[plan].limits[metric]
export const minimumPlanFor=(feature:StudioFeature):SubscriptionPlan=>canUseFeature('FREE',feature)?'FREE':canUseFeature('PRO',feature)?'PRO':'BUSINESS'
