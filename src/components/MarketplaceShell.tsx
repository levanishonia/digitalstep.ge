import { AppSidebar } from './AppSidebar'
import { DesktopHeader } from './DesktopHeader'
import { MobileBottomNavigation, MobileHeader } from './MobileNavigation'
import type { Locale } from '../i18n'
import { MarketplaceHomepage } from './marketplace/Homepage'
import { Catalog } from './marketplace/Catalog'
import { ServiceDetailPage } from './marketplace/ServiceDetailPage'
import { ProviderProfilePage } from './marketplace/ProviderProfilePage'
import { CheckoutPage } from './checkout/CheckoutPage'

export function MarketplaceShell({locale}:{locale:Locale}) {
  const segments=window.location.pathname.split('/').filter(Boolean).slice(1)
  const aliases:Record<string,string>={'social-media':'social','website-development':'web','video-animation':'video','ai-services':'ai','business-consulting':'consulting'}
  const content=segments[0]==='checkout'?<CheckoutPage locale={locale}/>:segments[0]==='services'&&segments[1]?<ServiceDetailPage locale={locale} slug={segments[1]}/>:segments[0]==='providers'&&segments[1]?<ProviderProfilePage locale={locale} slug={segments[1]}/>:segments[0]==='marketplace'?<Catalog locale={locale}/>:segments[0]==='categories'&&segments[1]?<Catalog locale={locale} categorySlug={aliases[segments[1]]??segments[1]}/>:segments[0]==='search'?<Catalog locale={locale} searchQuery={new URLSearchParams(window.location.search).get('q')??''}/>:<MarketplaceHomepage locale={locale}/>
  return (
    <div className="app-shell">
      <AppSidebar locale={locale} />
      <MobileHeader locale={locale} />
      <div className="desktop-area">
        <DesktopHeader locale={locale} />
        <main id="main" className="main-content">
          {content}
        </main>
      </div>
      <MobileBottomNavigation locale={locale} />
    </div>
  )
}
