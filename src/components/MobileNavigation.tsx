import { Bell, ShoppingBag } from 'lucide-react'
import type { Locale } from '../i18n'
import { dictionary, localePath } from '../i18n'
import { Logo } from './Logo'
import { SearchField } from './DesktopHeader'
import { mobileNavigation } from './navigation'
export function MobileHeader({locale}:{locale:Locale}) { const t=dictionary[locale]; return <header className="mobile-header"><div className="mobile-header-row"><Logo label={`Digital Step — ${t.nav.main}`}/><div className="mobile-tools"><a className="language-switch" href={localePath(locale==='ka'?'en':'ka','/')}>{t.shell.language}</a><button className="icon-button has-notice" type="button" aria-label={t.shell.notifications}><Bell/></button></div></div><SearchField locale={locale}/></header> }
export function MobileBottomNavigation({locale}:{locale:Locale}) { const t=dictionary[locale]; return <nav className="bottom-navigation" aria-label={t.nav.mobile}>{mobileNavigation.map(({key,href,icon:Icon},index)=>{const center=index===2;return <a key={key} href={href} className={center?'marketplace-action active':undefined} aria-current={center?'page':undefined} aria-label={t.nav[key]}>{center?<span><ShoppingBag/></span>:<Icon/>}<small>{t.nav[key]}</small></a>})}</nav> }
