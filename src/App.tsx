import { useEffect } from 'react'
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
import { BusinessAnalysisPage, ContentCalendarPage, ContentIdeasPage, MarketingPlannerPage, PostGeneratorPage, StudioHome, StudioLayout } from './components/studio/StudioPages'
import { BusinessPage, PricingPage } from './components/studio/BusinessAndPricing'
import { AssistantPage } from './components/studio/AssistantPage'

export function App() {
  const locale = resolveLocale(window.location.pathname)
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  const segments=window.location.pathname.split('/').filter(Boolean).slice(1)
  const authPage=segments[0]==='login'?<LoginPage locale={locale}/>:segments[0]==='register'?<RegisterPage locale={locale}/>:segments[0]==='forgot-password'?<ForgotPasswordPage locale={locale}/>:null
  if(authPage)return <AuthLayout locale={locale}>{authPage}</AuthLayout>
  if(segments[0]==='provider'){
    const page=segments[1]==='orders'&&segments[2]?<ProviderOrderDetail locale={locale} id={segments[2]}/>:segments[1]==='orders'?<ProviderOrders locale={locale}/>:segments[1]==='profile'?<ProviderProfile locale={locale}/>:<ProviderDashboard locale={locale}/>
    return <RequireRole locale={locale} role="PROVIDER"><ProviderLayout locale={locale}>{page}</ProviderLayout></RequireRole>
  }
  if(segments[0]==='dashboard'){
    const page=segments[1]==='orders'&&segments[2]?<OrderDetailPage locale={locale} id={segments[2]}/>:segments[1]==='orders'?<OrdersPage locale={locale}/>:segments[1]==='profile'?<ProfilePage locale={locale}/>:segments[1]==='settings'?<SettingsPage locale={locale}/>:segments[1]==='messages'?<MessagesPage locale={locale} conversationId={segments[2]}/>:segments[1]==='favorites'?<FavoritesPlaceholder locale={locale}/>:<DashboardOverview locale={locale}/>
    return <RequireAuth locale={locale}><DashboardLayout locale={locale}>{page}</DashboardLayout></RequireAuth>
  }
  if(segments[0]==='studio'){
    const page=segments[1]==='assistant'?<AssistantPage locale={locale}/>:segments[1]==='post-generator'?<PostGeneratorPage locale={locale}/>:segments[1]==='content-calendar'?<ContentCalendarPage locale={locale}/>:segments[1]==='content-ideas'?<ContentIdeasPage locale={locale}/>:segments[1]==='marketing-planner'?<MarketingPlannerPage locale={locale}/>:segments[1]==='business-analysis'?<BusinessAnalysisPage locale={locale}/>:<StudioHome locale={locale}/>
    return <RequireAuth locale={locale}><DashboardLayout locale={locale}><StudioLayout locale={locale}>{page}</StudioLayout></DashboardLayout></RequireAuth>
  }
  if(segments[0]==='business')return <RequireAuth locale={locale}><DashboardLayout locale={locale}><BusinessPage locale={locale}/></DashboardLayout></RequireAuth>
  if(segments[0]==='pricing')return <RequireAuth locale={locale}><DashboardLayout locale={locale}><PricingPage locale={locale}/></DashboardLayout></RequireAuth>
  return <MarketplaceShell locale={locale} />
}
