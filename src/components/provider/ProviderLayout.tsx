import { LayoutDashboard, ListOrdered, LogOut, UserRound } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { useAuth } from '../../auth/AuthContext'
import { localePath, type Locale } from '../../i18n'
import { Logo } from '../Logo'

const copy = {
  ka: {
    overview: 'მიმოხილვა',
    orders: 'შეკვეთები',
    profile: 'პროფილი',
    back: 'მარკეტპლეისზე დაბრუნება',
    nav: 'მომწოდებლის პანელი',
    logout: 'გასვლა',
    logoutError: 'გასვლა ვერ მოხერხდა. სცადე ხელახლა.',
  },
  en: {
    overview: 'Overview',
    orders: 'Orders',
    profile: 'Profile',
    back: 'Back to Marketplace',
    nav: 'Provider Dashboard',
    logout: 'Sign Out',
    logoutError: 'Unable to sign out. Please try again.',
  },
} as const

// Provider messaging is intentionally omitted until a provider-oriented message
// experience exists. Linking to the customer message page would use customer
// navigation, mock customer orders, and the wrong sender perspective.
const links = [
  ['overview', '/provider/dashboard', LayoutDashboard],
  ['orders', '/provider/orders', ListOrdered],
  ['profile', '/provider/profile', UserRound],
] as const

export function ProviderLayout({ locale, children }: { locale: Locale; children: ReactNode }) {
  const c = copy[locale]
  const { user, logout } = useAuth()
  const [busy, setBusy] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const path = window.location.pathname

  if (!user) return null

  const navigationLink = ([key, href, Icon]: (typeof links)[number]) => {
    const active = key === 'overview'
      ? path === localePath(locale, href)
      : path.startsWith(localePath(locale, href))

    return (
      <a
        key={key}
        href={localePath(locale, href)}
        className={active ? 'active' : undefined}
        aria-current={active ? 'page' : undefined}
      >
        <Icon aria-hidden="true" />
        <span>{c[key]}</span>
      </a>
    )
  }

  async function signOut() {
    if (busy) return
    setBusy(true)
    setLogoutError('')
    try {
      await logout()
      window.location.assign(localePath(locale, '/login'))
    } catch {
      setLogoutError(c.logoutError)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="dashboard-shell provider-shell">
      <aside className="dashboard-sidebar">
        <Logo href={localePath(locale, '/')} />
        <nav aria-label={c.nav}>{links.map(navigationLink)}</nav>
        <a className="marketplace-return" href={localePath(locale, '/marketplace')}>
          <LogOut aria-hidden="true" />
          {c.back}
        </a>
        <button className="marketplace-return" type="button" disabled={busy} onClick={signOut}>
          <LogOut aria-hidden="true" />
          {c.logout}
        </button>
        <p className="provider-logout-error" role="alert">{logoutError}</p>
      </aside>
      <div className="dashboard-area">
        <header className="dashboard-header">
          <div className="dashboard-mobile-brand"><Logo href={localePath(locale, '/')} /></div>
          <strong>{c.nav}</strong>
          <a className="language-switch" href={localePath(locale === 'ka' ? 'en' : 'ka', path)}>
            {locale === 'ka' ? 'English' : 'ქართული'}
          </a>
          <div className="dashboard-account">
            <span>{user.firstName[0]}{user.lastName[0]}</span>
            <div>
              <strong>{user.firstName} {user.lastName}</strong>
              <small>{c.nav}</small>
            </div>
          </div>
        </header>
        <main className="dashboard-content">{children}</main>
        <nav className="dashboard-mobile-nav provider-mobile-nav" aria-label={c.nav}>
          {links.map(navigationLink)}
        </nav>
      </div>
    </div>
  )
}
