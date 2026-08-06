import { ArrowUpRight, Moon } from 'lucide-react'
import type { Locale } from '../i18n'
import { dictionary } from '../i18n'
import { Logo } from './Logo'
import { primaryNavigation, settingsItem } from './navigation'
export function AppSidebar({locale}:{locale:Locale}) { const t=dictionary[locale]; const SettingsIcon=settingsItem.icon
 return <aside className="sidebar" aria-label={t.nav.navigation}><Logo label={`Digital Step — ${t.nav.main}`}/><nav className="side-navigation">{primaryNavigation.map(({key,href,icon:Icon},index)=><a key={key} href={href} className={index===1?'active':undefined} aria-current={index===1?'page':undefined}><Icon aria-hidden="true"/><span>{t.nav[key]}</span>{key==='messages'&&<i className="nav-dot" aria-label={t.shell.newMessage}/>}</a>)}</nav><div className="sidebar-footer"><section className="seller-card" aria-labelledby="seller-title"><span className="seller-icon"><ArrowUpRight aria-hidden="true"/></span><h2 id="seller-title">{t.shell.seller}</h2><p>{t.shell.sellerText}</p><a href="#main">{t.shell.start}<ArrowUpRight aria-hidden="true"/></a></section><div className="utility-links"><a href={settingsItem.href}><SettingsIcon/><span>{t.nav.settings}</span></a><button type="button" aria-label={t.shell.changeTheme}><Moon/><span>{t.shell.theme}</span></button></div></div></aside>
}
