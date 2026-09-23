import { useEffect, useState } from 'react'
import { MarketplaceShell } from './components/MarketplaceShell'
import { resolveLocale } from './i18n'
import { AuthLayout } from './components/auth/AuthLayout'
import { ForgotPasswordPage, LoginPage, RegisterPage } from './components/auth/AuthPages'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { DashboardOverview, OrderDetailPage, OrdersPage, ProfilePage } from './components/dashboard/DashboardPages'
import { FavoritesPlaceholder, SettingsPage } from './components/dashboard/SettingsPage'
import { MessagesPage } from './components/dashboard/MessagesPage'
import { RequireAuth } from './auth/RequireAuth'
import { RequireRole } from './auth/RequireRole'
import { ProviderLayout } from './components/provider/ProviderLayout'
import { ProviderDashboard, ProviderOrderDetail, ProviderOrders, ProviderProfile } from './components/provider/ProviderPages'
import { BusinessAnalysisPage, MarketingPlannerPage, StudioHome, StudioLayout } from './components/studio/StudioPages'
import {ContentIdeasPage} from './components/studio/ContentIdeasPage'
import {ContentCalendarPage} from './components/studio/ContentCalendarPage'
import {PostGeneratorPage} from './components/studio/PostGeneratorPage'
import { BusinessPage, PricingPage } from './components/studio/BusinessAndPricing'
import { AssistantPage } from './components/studio/AssistantPage'
import { PlanGate } from './components/studio/PlanGate'
import { AdminLayout } from './components/admin/AdminLayout'
import { AdminAIUsage, AdminOrders, AdminOverview, AdminProviders, AdminServices, AdminSubscriptions, AdminUsers } from './components/admin/AdminPages'
import { NotFoundPage } from './components/NotFoundPage'
import { locales, localePath } from './i18n'
import { loadCatalogOverrides } from './lib/catalogOverrides'

export function App() {
  const [catalogReady,setCatalogReady]=useState(false)
  const locale = resolveLocale(window.location.pathname)
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  useEffect(()=>{loadCatalogOverrides().catch(()=>undefined).finally(()=>setCatalogReady(true))},[])
  if(!catalogReady)return <main className="main-content" aria-busy="true" aria-live="polite">{locale==='ka'?'იტვირთება…':'Loading…'}</main>
  const allSegments=window.location.pathname.split('/').filter(Boolean)
  if (!locales.includes(allSegments[0] as 'ka' | 'en')) {
    window.location.replace(localePath('ka', `${window.location.pathname}${window.location.search}${window.location.hash}`))
    return null
  }
  const segments=allSegments.slice(1)
  const authPage=segments[0]==='login'?<LoginPage locale={locale}/>:segments[0]==='register'?<RegisterPage locale={locale}/>:segments[0]==='forgot-password'?<ForgotPasswordPage locale={locale}/>:null
  if(authPage&&segments.length===1)return <AuthLayout locale={locale}>{authPage}</AuthLayout>
  if(segments[0]==='admin'){
    const page=segments.length===1?<AdminOverview locale={locale}/>:segments.length===2&&segments[1]==='users'?<AdminUsers locale={locale}/>:segments.length===2&&segments[1]==='providers'?<AdminProviders locale={locale}/>:segments.length===2&&segments[1]==='services'?<AdminServices locale={locale}/>:segments.length===2&&segments[1]==='orders'?<AdminOrders locale={locale}/>:segments.length===2&&segments[1]==='subscriptions'?<AdminSubscriptions locale={locale}/>:segments.length===2&&segments[1]==='ai-usage'?<AdminAIUsage locale={locale}/>:<NotFoundPage locale={locale}/>
    return <RequireRole locale={locale} role="ADMIN"><AdminLayout locale={locale}>{page}</AdminLayout></RequireRole>
  }
  if(segments[0]==='provider'){
    const page=segments.length===2&&segments[1]==='dashboard'?<ProviderDashboard locale={locale}/>:segments.length===3&&segments[1]==='orders'?<ProviderOrderDetail locale={locale} id={segments[2]}/>:segments.length===2&&segments[1]==='orders'?<ProviderOrders locale={locale}/>:segments.length<=3&&segments[1]==='messages'?<MessagesPage locale={locale} conversationId={segments[2]}/>:segments.length===2&&segments[1]==='profile'?<ProviderProfile locale={locale}/>:<NotFoundPage locale={locale}/>
    return <RequireRole locale={locale} role="PROVIDER"><ProviderLayout locale={locale}>{page}</ProviderLayout></RequireRole>
  }
  if(segments[0]==='dashboard'){
    const page=segments.length===1?<DashboardOverview locale={locale}/>:segments.length===3&&segments[1]==='orders'?<OrderDetailPage locale={locale} id={segments[2]}/>:segments.length===2&&segments[1]==='orders'?<OrdersPage locale={locale}/>:segments.length===2&&segments[1]==='profile'?<ProfilePage locale={locale}/>:segments.length===2&&segments[1]==='settings'?<SettingsPage locale={locale}/>:segments.length<=3&&segments[1]==='messages'?<MessagesPage locale={locale} conversationId={segments[2]}/>:segments.length===2&&segments[1]==='favorites'?<FavoritesPlaceholder locale={locale}/>:<NotFoundPage locale={locale}/>
    return <RequireAuth locale={locale}><DashboardLayout locale={locale}>{page}</DashboardLayout></RequireAuth>
  }
  if(segments[0]==='studio'){
    const page=segments.length===1?<StudioHome locale={locale}/>:segments.length===2&&segments[1]==='assistant'?<AssistantPage locale={locale}/>:segments.length===2&&segments[1]==='post-generator'?<PlanGate locale={locale} feature="POST_GENERATOR"><PostGeneratorPage locale={locale}/></PlanGate>:segments.length===2&&['content-calendar','calendar'].includes(segments[1])?<PlanGate locale={locale} feature="CONTENT_CALENDAR"><ContentCalendarPage locale={locale}/></PlanGate>:segments.length===2&&segments[1]==='content-ideas'?<PlanGate locale={locale} feature="CONTENT_IDEAS"><ContentIdeasPage locale={locale}/></PlanGate>:segments.length===2&&segments[1]==='marketing-planner'?<PlanGate locale={locale} feature="MARKETING_PLANNER"><MarketingPlannerPage locale={locale}/></PlanGate>:segments.length===2&&segments[1]==='business-analysis'?<PlanGate locale={locale} feature="BUSINESS_ANALYSIS"><BusinessAnalysisPage locale={locale}/></PlanGate>:<NotFoundPage locale={locale}/>
    return <RequireAuth locale={locale}><DashboardLayout locale={locale}><StudioLayout locale={locale}>{page}</StudioLayout></DashboardLayout></RequireAuth>
  }
  if(segments[0]==='business'&&segments.length===1)return <RequireAuth locale={locale}><DashboardLayout locale={locale}><BusinessPage locale={locale}/></DashboardLayout></RequireAuth>
  if(segments[0]==='pricing'&&segments.length===1)return <RequireAuth locale={locale}><DashboardLayout locale={locale}><PricingPage locale={locale}/></DashboardLayout></RequireAuth>
  if(segments[0]==='billing'&&['success','cancel'].includes(segments[1])&&segments.length===2)return <BillingReturnPage locale={locale} outcome={segments[1] as 'success'|'cancel'}/>
  return <MarketplaceShell locale={locale} />
}

function BillingReturnPage({locale,outcome}:{locale:'ka'|'en';outcome:'success'|'cancel'}){const success=outcome==='success';return <main className="billing-return"><h1>{success?(locale==='ka'?'გადახდის სტატუსი':'Payment status'):(locale==='ka'?'გადახდა გაუქმდა':'Payment cancelled')}</h1><p>{success?(locale==='ka'?'გამოწერა გააქტიურდება მხოლოდ გადახდის სისტემის მიერ დადასტურების შემდეგ.':'Your subscription activates only after verified confirmation from the payment provider.'):(locale==='ka'?'გეგმა არ შეცვლილა.':'Your plan has not changed.')}</p><a href={localePath(locale,'/pricing')}>{locale==='ka'?'ფასებზე დაბრუნება':'Back to Pricing'}</a></main>}
