import { useId } from 'react'
import { Bell, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react'
import type { Locale } from '../i18n'
import { dictionary, localePath } from '../i18n'

export function SearchField({locale}:{locale:Locale}) {
  const searchId = useId()
  const t = dictionary[locale].shell

  return (
    <form className="search" role="search" onSubmit={(event) => event.preventDefault()}>
      <Search aria-hidden="true" />
      <label className="visually-hidden" htmlFor={searchId}>{t.search}</label>
      <input id={searchId} type="search" placeholder={t.searchPlaceholder} />
      <button type="button" aria-label={t.filters}><SlidersHorizontal aria-hidden="true" /></button>
    </form>
  )
}

export function DesktopHeader({locale}:{locale:Locale}) {
  const t=dictionary[locale].shell
  const languageHref=localePath(locale==='ka'?'en':'ka',`${window.location.pathname}${window.location.search}${window.location.hash}`)
  return (
    <header className="desktop-header">
      <SearchField locale={locale} />
      <div className="header-actions">
        <a className="language-switch" href={languageHref}>{t.language}</a>
        <button className="icon-button" type="button" aria-label={t.cart}><ShoppingCart aria-hidden="true" /></button>
        <button className="icon-button has-notice" type="button" aria-label={t.notifications}><Bell aria-hidden="true" /></button>
        <a className="account" href={localePath(locale, '/login')} aria-label={t.account}>
          <span className="avatar">DS</span><span><strong>Digital Step</strong><small>{t.buyer}</small></span>
        </a>
      </div>
    </header>
  )
}
