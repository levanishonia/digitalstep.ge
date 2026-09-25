import { businessGoals } from '../../../shared/businessProfile'
type BusinessGoal = typeof businessGoals[number]
import type { StudioFeature } from '../../domain/subscriptions'
import type { Locale } from '../../i18n'

export const businessGoalLabels: Record<Locale, Record<BusinessGoal, string>> = {
  ka: { INCREASE_SALES:'გაყიდვების ზრდა', ACQUIRE_CUSTOMERS:'ახალი მომხმარებლების მოზიდვა', BRAND_AWARENESS:'ბრენდის ცნობადობა', SOCIAL_MEDIA_GROWTH:'სოციალური მედიის ზრდა', ONLINE_SALES:'ონლაინ გაყიდვები', LAUNCH_PRODUCT:'ახალი პროდუქტის გაშვება', AUTOMATE_PROCESSES:'პროცესების ავტომატიზაცია' },
  en: { INCREASE_SALES:'Increase Sales', ACQUIRE_CUSTOMERS:'Acquire Customers', BRAND_AWARENESS:'Brand Awareness', SOCIAL_MEDIA_GROWTH:'Social Media Growth', ONLINE_SALES:'Online Sales', LAUNCH_PRODUCT:'Launch a New Product', AUTOMATE_PROCESSES:'Automate Processes' },
}

export const studioFeatureLabels: Record<Locale, Record<StudioFeature, string>> = {
  ka: { AI_ASSISTANT:'AI ასისტენტი', POST_GENERATOR:'პოსტების გენერატორი', CONTENT_CALENDAR:'კონტენტის კალენდარი', CONTENT_IDEAS:'კონტენტის იდეები', MARKETING_PLANNER:'მარკეტინგის გეგმა', BUSINESS_ANALYSIS:'ბიზნესის ანალიზი' },
  en: { AI_ASSISTANT:'AI Assistant', POST_GENERATOR:'Post Generator', CONTENT_CALENDAR:'Content Calendar', CONTENT_IDEAS:'Content Ideas', MARKETING_PLANNER:'Marketing Plan', BUSINESS_ANALYSIS:'Business Analysis' },
}
