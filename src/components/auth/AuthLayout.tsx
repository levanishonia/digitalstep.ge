import type { ReactNode } from 'react'
import { CheckCircle2, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { Logo } from '../Logo'
import { localePath, type Locale } from '../../i18n'

const copy={ka:{statement:'ციფრული მომსახურებების სანდო სივრცე შენი შემდეგი ნაბიჯისთვის',points:['შერჩეული სპეციალისტები','გამჭვირვალე პროცესი','ხარისხზე ორიენტირებული'],language:'English'},en:{statement:'A trusted digital services marketplace for your next step',points:['Curated specialists','A transparent process','Focused on quality'],language:'ქართული'}} as const
export function AuthLayout({locale,children}:{locale:Locale;children:ReactNode}) { const c=copy[locale]; const switched=localePath(locale==='ka'?'en':'ka',window.location.pathname); return <main className="auth-layout">
 <section className="auth-visual" aria-label={c.statement}><Logo href={localePath(locale,'/')} /><div className="auth-art" aria-hidden="true"><span><Layers3/></span><span><Sparkles/></span><span><ShieldCheck/></span></div><div><p>Digital Step Marketplace</p><h2>{c.statement}</h2><ul>{c.points.map(x=><li key={x}><CheckCircle2/>{x}</li>)}</ul></div></section>
 <section className="auth-panel"><header className="auth-mobile-head"><Logo href={localePath(locale,'/')} /><a href={switched}>{c.language}</a></header><a className="auth-language" href={switched}>{c.language}</a><div className="auth-card">{children}</div></section>
 </main> }
