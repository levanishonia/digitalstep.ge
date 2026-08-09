import { Bell, Heart, LayoutDashboard, ListOrdered, LogOut, MessageCircle, Settings, UserRound } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Logo } from '../Logo'
import { localePath, type Locale } from '../../i18n'
import { useAuth } from '../../auth/AuthContext'

const copy={ka:{overview:'მიმოხილვა',orders:'ჩემი შეკვეთები',favorites:'რჩეულები',messages:'შეტყობინებები',profile:'პროფილი',settings:'პარამეტრები',back:'მარკეტპლეისზე დაბრუნება',nav:'მომხმარებლის სივრცე',language:'English',customer:'მომხმარებელი',signOut:'გასვლა',signingOut:'ანგარიშიდან გასვლა...'},en:{overview:'Overview',orders:'My Orders',favorites:'Favorites',messages:'Messages',profile:'Profile',settings:'Settings',back:'Back to Marketplace',nav:'Customer dashboard',language:'ქართული',customer:'Customer',signOut:'Sign Out',signingOut:'Signing out...'}} as const
const dashboardNavigation=[['overview','/dashboard',LayoutDashboard],['orders','/dashboard/orders',ListOrdered],['favorites','/dashboard/favorites',Heart],['messages','/dashboard/messages',MessageCircle],['profile','/dashboard/profile',UserRound],['settings','/dashboard/settings',Settings]] as const
const mobileKeys=new Set(['overview','orders','profile','settings'])

export function DashboardLayout({locale,children}:{locale:Locale;children:ReactNode}) {
 const c=copy[locale];const {user,logout}=useAuth();const [signingOut,setSigningOut]=useState(false);if(!user)return null
 const path=window.location.pathname
 const isActive=(href:string)=>href==='/dashboard'?path===localePath(locale,href):path.startsWith(localePath(locale,href))
 const navigationLink=([key,href,Icon]:(typeof dashboardNavigation)[number])=><a key={key} className={isActive(href)?'active':undefined} aria-current={isActive(href)?'page':undefined} href={localePath(locale,href)}><Icon aria-hidden="true"/><span>{c[key]}</span></a>
 return <div className="dashboard-shell"><aside className="dashboard-sidebar"><Logo href={localePath(locale,'/')} /><nav aria-label={c.nav}>{dashboardNavigation.map(navigationLink)}</nav><a className="marketplace-return" href={localePath(locale,'/marketplace')}><LogOut aria-hidden="true"/>{c.back}</a><button className="marketplace-return" type="button" disabled={signingOut} onClick={async()=>{setSigningOut(true);try{await logout()}finally{window.location.assign(localePath(locale,'/login'))}}}><LogOut aria-hidden="true"/>{signingOut?c.signingOut:c.signOut}</button></aside><div className="dashboard-area"><header className="dashboard-header"><div className="dashboard-mobile-brand"><Logo href={localePath(locale,'/')} /></div><a className="language-switch" href={localePath(locale==='ka'?'en':'ka',path)}>{c.language}</a><button className="icon-button" aria-label={c.messages}><Bell/></button><div className="dashboard-account"><span>{user.firstName[0]}{user.lastName[0]}</span><div><strong>{user.firstName} {user.lastName}</strong><small>{c.customer}</small></div></div></header><main id="main" className="dashboard-content">{children}</main><nav className="dashboard-mobile-nav" aria-label={c.nav}>{dashboardNavigation.filter(([key])=>mobileKeys.has(key)).map(navigationLink)}</nav></div></div>
}
