import { planDefinitions, type StudioFeature, type SubscriptionPlan, type UsageMetric } from './subscriptions'
import type { Locale } from '../i18n'

export const featureMetric:Partial<Record<StudioFeature,UsageMetric>>={AI_ASSISTANT:'AI_REQUESTS',POST_GENERATOR:'POST_GENERATIONS',CONTENT_IDEAS:'CONTENT_IDEA_GENERATIONS',MARKETING_PLANNER:'MARKETING_PLAN_GENERATIONS',BUSINESS_ANALYSIS:'BUSINESS_ANALYSIS_GENERATIONS'}
const featureLabels={ka:{AI_ASSISTANT:'AI ასისტენტი',POST_GENERATOR:'პოსტების გენერატორი',CONTENT_CALENDAR:'კონტენტის კალენდარი',CONTENT_IDEAS:'კონტენტის იდეები',MARKETING_PLANNER:'მარკეტინგის გეგმა',BUSINESS_ANALYSIS:'ბიზნესის ანალიზი'},en:{AI_ASSISTANT:'AI Assistant',POST_GENERATOR:'Post Generator',CONTENT_CALENDAR:'Content Calendar',CONTENT_IDEAS:'Content Ideas',MARKETING_PLANNER:'Marketing Plan',BUSINESS_ANALYSIS:'Business Analysis'}} as const
const descriptions={ka:{FREE:'Studio-ს გასაცნობად და AI ასისტენტის გამოსაყენებლად.',PRO:'მცირე ბიზნესისა და აქტიური კონტენტის მართვისთვის.',BUSINESS:'ბიზნესისთვის, რომელსაც მეტი AI შესაძლებლობა და მაღალი ლიმიტები სჭირდება.'},en:{FREE:'Explore Studio and use the AI Assistant.',PRO:'For small businesses and active content management.',BUSINESS:'For businesses that need more AI capabilities and higher limits.'}} as const
export const getPlanLabel=(plan:SubscriptionPlan)=>plan
export const getFeatureLabel=(feature:StudioFeature,locale:Locale)=>featureLabels[locale][feature]
export const getPlanDescription=(plan:SubscriptionPlan,locale:Locale)=>descriptions[locale][plan]
export type SubscriptionStatus='ACTIVE'|'FREE'|'INCOMPLETE'|'PAST_DUE'|'CANCELLED'|'EXPIRED'
const statusLabels={ka:{ACTIVE:'აქტიური',FREE:'უფასო',INCOMPLETE:'დაუსრულებელი',PAST_DUE:'გადახდა ვადაგადაცილებულია',CANCELLED:'გაუქმებული',EXPIRED:'ვადაგასული'},en:{ACTIVE:'Active',FREE:'Free',INCOMPLETE:'Incomplete',PAST_DUE:'Payment past due',CANCELLED:'Cancelled',EXPIRED:'Expired'}} as const
export const getSubscriptionStatusLabel=(status:SubscriptionStatus,locale:Locale)=>statusLabels[locale][status]
export function formatFeatureAllowance(plan:SubscriptionPlan,feature:StudioFeature,locale:Locale){if(!planDefinitions[plan].features.includes(feature))return locale==='ka'?'არ შედის':'Not included';const metric=featureMetric[feature];if(!metric)return locale==='ka'?'შედის':'Included';const value=planDefinitions[plan].limits[metric];const unit=feature==='AI_ASSISTANT'?(locale==='ka'?'კითხვა':'questions'):(locale==='ka'?'გენერაცია':'generations');return `${value} ${unit} / ${locale==='ka'?'თვე':'month'}`}
