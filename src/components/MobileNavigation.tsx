import type { Locale } from '../i18n'
import { dictionary, localePath } from '../i18n'
import { Logo } from './Logo'
import { SearchField } from './DesktopHeader'
import { mobileNavigation } from './navigation'
import { NotificationCenter } from './NotificationCenter'
export function MobileHeader({locale}:{locale:Locale}) { const t=dictionary[locale]; const languageHref=localePath(locale==='ka'?'en':'ka',`${window.location.pathname}${window.location.search}${window.location.hash}`); return <header className="mobile-header"><div className="mobile-header-row"><Logo label={`Digital Step — ${t.nav.main}`}/><div className="mobile-tools"><a className="language-switch" href={languageHref}>{t.shell.language}</a><NotificationCenter locale={locale}/></div></div><SearchField locale={locale}/></header> }
export function MobileBottomNavigation({locale}:{locale:Locale}) { const t=dictionary[locale],path=window.location.pathname; return <nav className="bottom-navigation" aria-label={t.nav.mobile}>{mobileNavigation.map(({key,href,icon:Icon},index)=>{const center=index===2,target=href.startsWith('/')?localePath(locale,href):href,active=href==='/'?path===localePath(locale,'/'):path.startsWith(target);return <a key={key} href={target} className={[center?'marketplace-action':'',active?'active':''].filter(Boolean).join(' ')||undefined} aria-current={active?'page':undefined} aria-label={t.nav[key]}>{center?<span><Icon/></span>:<Icon/>}<small>{t.nav[key]}</small></a>})}</nav> }
