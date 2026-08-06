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
  return (
    <header className="desktop-header">
      <SearchField locale={locale} />
      <div className="header-actions">
        <a className="language-switch" href={localePath(locale==='ka'?'en':'ka','/')}>{t.language}</a>
        <button className="icon-button" type="button" aria-label={t.cart}><ShoppingCart aria-hidden="true" /></button>
        <button className="icon-button has-notice" type="button" aria-label={t.notifications}><Bell aria-hidden="true" /></button>
        <button className="account" type="button" aria-label={t.account}>
          <span className="avatar">DS</span><span><strong>Digital Step</strong><small>{t.buyer}</small></span>
        </button>
      </div>
    </header>
  )
}
