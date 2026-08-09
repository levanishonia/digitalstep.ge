export type SubscriptionPlan = 'FREE' | 'PRO' | 'BUSINESS'
export type StudioFeature = 'AI_ASSISTANT'|'POST_GENERATOR'|'CONTENT_CALENDAR'|'CONTENT_IDEAS'|'MARKETING_PLANNER'|'BUSINESS_ANALYSIS'
export type UsageMetric = 'AI_REQUESTS'|'POST_GENERATIONS'|'CONTENT_IDEA_GENERATIONS'
export interface PlanDefinition { id:SubscriptionPlan; features:readonly StudioFeature[]; limits:Record<UsageMetric,number> }
// Provisional configuration; the backend must authoritatively enforce usage before AI launches.
export const planDefinitions:Record<SubscriptionPlan,PlanDefinition>={FREE:{id:'FREE',features:['AI_ASSISTANT','POST_GENERATOR','CONTENT_CALENDAR','CONTENT_IDEAS'],limits:{AI_REQUESTS:10,POST_GENERATIONS:3,CONTENT_IDEA_GENERATIONS:3}},PRO:{id:'PRO',features:['AI_ASSISTANT','POST_GENERATOR','CONTENT_CALENDAR','CONTENT_IDEAS','MARKETING_PLANNER','BUSINESS_ANALYSIS'],limits:{AI_REQUESTS:100,POST_GENERATIONS:30,CONTENT_IDEA_GENERATIONS:30}},BUSINESS:{id:'BUSINESS',features:['AI_ASSISTANT','POST_GENERATOR','CONTENT_CALENDAR','CONTENT_IDEAS','MARKETING_PLANNER','BUSINESS_ANALYSIS'],limits:{AI_REQUESTS:500,POST_GENERATIONS:100,CONTENT_IDEA_GENERATIONS:100}}}
export const canUseFeature=(plan:SubscriptionPlan,feature:StudioFeature)=>planDefinitions[plan].features.includes(feature)
export const getUsageLimit=(plan:SubscriptionPlan,metric:UsageMetric)=>planDefinitions[plan].limits[metric]
export const minimumPlanFor=(feature:StudioFeature):SubscriptionPlan=>canUseFeature('FREE',feature)?'FREE':'PRO'
