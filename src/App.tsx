import { MarketplaceShell } from './components/MarketplaceShell'
import { resolveLocale } from './i18n'

export function App() {
  const locale = resolveLocale(window.location.pathname)
  document.documentElement.lang = locale
  return <MarketplaceShell locale={locale} />
}
