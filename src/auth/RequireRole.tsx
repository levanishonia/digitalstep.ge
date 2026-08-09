import type { ReactNode } from 'react'
import { localePath,type Locale } from '../i18n'
import type { UserRole } from '../lib/api/auth'
import { useAuth } from './AuthContext'
const copy={ka:{checking:'წვდომის შემოწმება...',title:'წვდომა შეზღუდულია',text:'ამ გვერდზე წვდომის უფლება არ გაქვს',back:'მარკეტპლეისზე დაბრუნება'},en:{checking:'Checking access...',title:'Access Restricted',text:'You do not have permission to access this page',back:'Back to Marketplace'}}
export function RequireRole({locale,role,children}:{locale:Locale;role:UserRole;children:ReactNode}){const{user,loading}=useAuth(),c=copy[locale];if(loading)return <main className="auth-check" aria-live="polite">{c.checking}</main>;if(!user){const current=window.location.pathname+window.location.search;window.location.replace(`${localePath(locale,'/login')}?returnTo=${encodeURIComponent(current)}`);return <main className="auth-check">{c.checking}</main>}if(user.role!==role)return <main className="access-denied"><h1>{c.title}</h1><p>{c.text}</p><a href={localePath(locale,user.role==='CUSTOMER'?'/dashboard':'/marketplace')}>{c.back}</a></main>;return children}
