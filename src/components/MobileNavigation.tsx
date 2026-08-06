import { Bell, ShoppingBag } from 'lucide-react'
import { Logo } from './Logo'
import { SearchField } from './DesktopHeader'
import { mobileNavigation } from './navigation'

export function MobileHeader() {
  return (
    <header className="mobile-header">
      <div className="mobile-header-row">
        <Logo />
        <button className="icon-button has-notice" type="button" aria-label="შეტყობინებები"><Bell aria-hidden="true" /></button>
      </div>
      <SearchField />
    </header>
  )
}

export function MobileBottomNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="მობილური ნავიგაცია">
      {mobileNavigation.map(({ label, href, icon: Icon }, index) => {
        const isCenter = index === 2
        return (
          <a
            key={label}
            href={href}
            className={isCenter ? 'marketplace-action active' : undefined}
            aria-current={isCenter ? 'page' : undefined}
            aria-label={label}
          >
            {isCenter ? <span><ShoppingBag aria-hidden="true" /></span> : <Icon aria-hidden="true" />}
            <small>{isCenter ? 'მარკეტი' : label}</small>
          </a>
        )
      })}
    </nav>
  )
}
