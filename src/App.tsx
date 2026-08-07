import { useEffect } from 'react'
import { MarketplaceShell } from './components/MarketplaceShell'
import { resolveLocale } from './i18n'
import { AuthLayout } from './components/auth/AuthLayout'
import { ForgotPasswordPage, LoginPage, RegisterPage } from './components/auth/AuthPages'
import { DashboardLayout } from './components/dashboard/DashboardLayout'
import { DashboardOverview, OrderDetailPage, OrdersPage, ProfilePage } from './components/dashboard/DashboardPages'
import { FavoritesPlaceholder, SettingsPage } from './components/dashboard/SettingsPage'
import { MessagesPage } from './components/dashboard/MessagesPage'

export function App() {
  const locale = resolveLocale(window.location.pathname)
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  const segments=window.location.pathname.split('/').filter(Boolean).slice(1)
  const authPage=segments[0]==='login'?<LoginPage locale={locale}/>:segments[0]==='register'?<RegisterPage locale={locale}/>:segments[0]==='forgot-password'?<ForgotPasswordPage locale={locale}/>:null
  if(authPage)return <AuthLayout locale={locale}>{authPage}</AuthLayout>
  if(segments[0]==='dashboard'){
    const page=segments[1]==='orders'&&segments[2]?<OrderDetailPage locale={locale} id={segments[2]}/>:segments[1]==='orders'?<OrdersPage locale={locale}/>:segments[1]==='profile'?<ProfilePage locale={locale}/>:segments[1]==='settings'?<SettingsPage locale={locale}/>:segments[1]==='messages'?<MessagesPage locale={locale} conversationId={segments[2]}/>:segments[1]==='favorites'?<FavoritesPlaceholder locale={locale}/>:<DashboardOverview locale={locale}/>
    return <DashboardLayout locale={locale}>{page}</DashboardLayout>
  }
  return <MarketplaceShell locale={locale} />
}
