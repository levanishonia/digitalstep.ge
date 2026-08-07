import { useEffect } from 'react'
import { MarketplaceShell } from './components/MarketplaceShell'
import { resolveLocale } from './i18n'

export function App() {
  const locale = resolveLocale(window.location.pathname)
  useEffect(() => { document.documentElement.lang = locale }, [locale])
  return <MarketplaceShell locale={locale} />
}
