import { ArrowUpRight, Moon } from 'lucide-react'
import { Logo } from './Logo'
import { primaryNavigation, settingsItem } from './navigation'

export function AppSidebar() {
  const SettingsIcon = settingsItem.icon
  return (
    <aside className="sidebar" aria-label="მთავარი ნავიგაცია">
      <Logo />
      <nav className="side-navigation">
        {primaryNavigation.map(({ label, href, icon: Icon }, index) => (
          <a key={label} href={href} className={index === 1 ? 'active' : undefined} aria-current={index === 1 ? 'page' : undefined}>
            <Icon aria-hidden="true" /><span>{label}</span>
            {label === 'შეტყობინებები' && <i className="nav-dot" aria-label="ახალი შეტყობინება" />}
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <section className="seller-card" aria-labelledby="seller-title">
          <span className="seller-icon"><ArrowUpRight aria-hidden="true" /></span>
          <h2 id="seller-title">გახდი გამყიდველი</h2>
          <p>შესთავაზე შენი ციფრული სერვისი</p>
          <a href="#sell">დაწყება <ArrowUpRight aria-hidden="true" /></a>
        </section>
        <div className="utility-links">
          <a href={settingsItem.href}><SettingsIcon aria-hidden="true" /><span>{settingsItem.label}</span></a>
          <button type="button" aria-label="თემის შეცვლა"><Moon aria-hidden="true" /><span>მუქი თემა</span></button>
        </div>
      </div>
    </aside>
  )
}
