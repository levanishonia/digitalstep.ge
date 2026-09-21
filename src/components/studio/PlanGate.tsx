import type { ReactNode } from 'react'
import { LockKeyhole } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { canUseFeature,minimumPlanFor,type StudioFeature } from '../../domain/subscriptions'
import { localePath,type Locale } from '../../i18n'

const copy={ka:{locked:'ეს შესაძლებლობა ჩაკეტილია',current:'შენი მიმდინარე გეგმა',requires:{PRO:'საჭიროა Pro გეგმა',BUSINESS:'საჭიროა Business გეგმა'},upgrade:'გეგმის განახლება'},en:{locked:'This feature is locked',current:'Your Current Plan',requires:{PRO:'Requires Pro',BUSINESS:'Requires Business'},upgrade:'Upgrade Plan'}} as const
export function PlanGate({locale,feature,children}:{locale:Locale;feature:StudioFeature;children:ReactNode}){const {user}=useAuth();if(!user||canUseFeature(user.subscriptionPlan,feature))return <>{children}</>;const required=minimumPlanFor(feature) as 'PRO'|'BUSINESS',c=copy[locale];return <section className="locked-feature" role="region" aria-labelledby="locked-title"><LockKeyhole/><h1 id="locked-title">{c.locked}</h1><p>{c.current}: <strong>{user.subscriptionPlan}</strong></p><p>{c.requires[required]}</p><a className="studio-button" href={localePath(locale,`/pricing?from=${feature.toLowerCase().replaceAll('_','-')}`)}>{c.upgrade}</a></section>}
