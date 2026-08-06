import { Sparkles } from 'lucide-react'
import { AppSidebar } from './AppSidebar'
import { DesktopHeader } from './DesktopHeader'
import { MobileBottomNavigation, MobileHeader } from './MobileNavigation'

export function MarketplaceShell() {
  return (
    <div className="app-shell">
      <AppSidebar />
      <MobileHeader />
      <div className="desktop-area">
        <DesktopHeader />
        <main id="main" className="main-content">
          <section className="layout-placeholder" id="marketplace">
            <span><Sparkles aria-hidden="true" /></span>
            <p className="eyebrow">Digital Step Marketplace</p>
            <h1>იპოვე საჭირო ციფრული სერვისი</h1>
            <p>მარკეტპლეისის ახალი გამოცდილება მალე აქ გამოჩნდება.</p>
          </section>
        </main>
      </div>
      <MobileBottomNavigation />
    </div>
  )
}
