import { useId, useState } from 'react'
import { Bell, Search, ShoppingCart, SlidersHorizontal } from 'lucide-react'
import type { Locale } from '../i18n'
import { dictionary, localePath } from '../i18n'
import { useAuth } from '../auth/AuthContext'

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
  const {user,logout}=useAuth()
  const [signingOut,setSigningOut]=useState(false)
  const languageHref=localePath(locale==='ka'?'en':'ka',`${window.location.pathname}${window.location.search}${window.location.hash}`)
  return (
    <header className="desktop-header">
      <SearchField locale={locale} />
      <div className="header-actions">
        <a className="language-switch" href={languageHref}>{t.language}</a>
        <button className="icon-button" type="button" aria-label={t.cart} title={locale==='ka'?'მალე':'Coming soon'} disabled><ShoppingCart aria-hidden="true" /></button>
        <a className="icon-button has-notice" href={localePath(locale,'/dashboard/messages')} aria-label={t.notifications}><Bell aria-hidden="true" /></a>
        {user?<details className="header-account-menu"><summary className="account" aria-label={t.account}><span className="avatar">{user.firstName[0]}{user.lastName[0]}</span><span><strong>{user.firstName} {user.lastName}</strong><small>{t.buyer}</small></span></summary><div><a href={localePath(locale,'/dashboard')}>{locale==='ka'?'დაფა':'Dashboard'}</a><a href={localePath(locale,'/dashboard/profile')}>{locale==='ka'?'პროფილი':'Profile'}</a><a href={localePath(locale,'/dashboard/settings')}>{locale==='ka'?'პარამეტრები':'Settings'}</a>{user.role==='PROVIDER'&&<a href={localePath(locale,'/provider/dashboard')}>{locale==='ka'?'მიმწოდებლის დაფა':'Provider Dashboard'}</a>}<button disabled={signingOut} aria-busy={signingOut} onClick={async()=>{setSigningOut(true);try{await logout()}finally{window.location.assign(localePath(locale,'/login'))}}}>{signingOut?(locale==='ka'?'გასვლა...':'Signing out...'):(locale==='ka'?'გასვლა':'Sign Out')}</button></div></details>:<a className="account" href={localePath(locale, '/login')} aria-label={t.account}><span className="avatar">DS</span><span><strong>Digital Step</strong><small>{locale==='ka'?'შესვლა':'Sign In'}</small></span></a>}
      </div>
    </header>
  )
}
