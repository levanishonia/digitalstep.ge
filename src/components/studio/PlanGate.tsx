import { useEffect,useState,type ReactNode } from 'react'
import { LockKeyhole } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { canUseFeature,minimumPlanFor,type StudioFeature,type SubscriptionPlan } from '../../domain/subscriptions'
import { localePath,type Locale } from '../../i18n'
import { getSubscription } from '../../lib/api/subscription'
import { getFeatureLabel,getPlanLabel } from '../../domain/subscriptionPresentation'

const copy={ka:{loading:'წვდომა მოწმდება…',current:'შენი მიმდინარე გეგმა',requires:'ეს ფუნქცია ხელმისაწვდომია {plan} გეგმიდან.',plans:'გეგმების ნახვა'},en:{loading:'Checking access…',current:'Your current plan',requires:'This feature is available from the {plan} plan.',plans:'View Plans'}} as const
export function PlanGate({locale,feature,children}:{locale:Locale;feature:StudioFeature;children:ReactNode}){const {user}=useAuth(),[effective,setEffective]=useState<SubscriptionPlan>(),[loaded,setLoaded]=useState(false);useEffect(()=>{getSubscription().then(x=>setEffective(x.plan)).catch(()=>setEffective(user?.subscriptionPlan)).finally(()=>setLoaded(true))},[user?.subscriptionPlan]);const c=copy[locale];if(!loaded)return <section className="locked-feature" aria-live="polite"><p>{c.loading}</p></section>;if(!user||canUseFeature(effective??user.subscriptionPlan,feature))return <>{children}</>;const required=minimumPlanFor(feature);return <section className="locked-feature" role="region" aria-labelledby="locked-title"><LockKeyhole aria-hidden="true"/><p className="section-eyebrow">Digital Step Studio</p><h1 id="locked-title">{getFeatureLabel(feature,locale)}</h1><p>{c.requires.replace('{plan}',getPlanLabel(required))}</p><small>{c.current}: <strong>{getPlanLabel(effective??user.subscriptionPlan)}</strong></small><a className="studio-button" href={localePath(locale,`/pricing?from=${feature.toLowerCase().replaceAll('_','-')}`)}>{c.plans}</a></section>}
