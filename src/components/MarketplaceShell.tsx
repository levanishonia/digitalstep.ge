import { AppSidebar } from './AppSidebar'
import { DesktopHeader } from './DesktopHeader'
import { MobileBottomNavigation, MobileHeader } from './MobileNavigation'
import type { Locale } from '../i18n'
import { MarketplaceHomepage } from './marketplace/Homepage'

export function MarketplaceShell({locale}:{locale:Locale}) {
  return (
    <div className="app-shell">
      <AppSidebar locale={locale} />
      <MobileHeader locale={locale} />
      <div className="desktop-area">
        <DesktopHeader locale={locale} />
        <main id="main" className="main-content">
          <MarketplaceHomepage locale={locale}/>
        </main>
      </div>
      <MobileBottomNavigation locale={locale} />
    </div>
  )
}
