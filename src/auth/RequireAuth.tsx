import type { ReactNode } from 'react'
import { localePath, type Locale } from '../i18n'
import { useAuth } from './AuthContext'

const copy={ka:'ავტორიზაციის შემოწმება...',en:'Checking authentication...'}
export function RequireAuth({locale,children}:{locale:Locale;children:ReactNode}){
 const {user,loading}=useAuth()
 if(loading)return <main className="auth-check" aria-live="polite">{copy[locale]}</main>
 if(!user){const current=window.location.pathname+window.location.search;window.location.replace(`${localePath(locale,'/login')}?returnTo=${encodeURIComponent(current)}`);return <main className="auth-check">{copy[locale]}</main>}
 return children
}
