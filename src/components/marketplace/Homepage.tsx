import { ArrowRight, CheckCircle2, ChevronRight, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { categories, goals, popularServices, bestsellerServices, steps, trust } from '../../data/marketplace'
import type { Locale } from '../../i18n'
import { dictionary } from '../../i18n'
import { MarketplaceIcon } from './Icon'
import { ServiceCard } from './ServiceCard'
function SectionHeader({title,action}:{title:string;action:string}) { return <div className="section-header"><h2>{title}</h2><a href="#categories">{action}<ChevronRight aria-hidden="true"/></a></div> }
function Services({id,title,locale,items}:{id:string;title:string;locale:Locale;items:typeof popularServices}) { const t=dictionary[locale]; return <section id={id} className="market-section"><SectionHeader title={title} action={t.home.viewAll}/><div className="service-grid" tabIndex={0}>{items.map(s=><ServiceCard key={s.id} service={s} locale={locale}/>)}</div></section> }
export function MarketplaceHomepage({locale}:{locale:Locale}) { const t=dictionary[locale]
 return <>
  <section className="market-hero" aria-labelledby="hero-title"><div className="hero-copy"><p className="market-eyebrow"><Sparkles aria-hidden="true"/>{t.home.eyebrow}</p><h1 id="hero-title">{t.home.title}</h1><p>{t.home.subtitle}</p><div className="hero-actions"><a className="button primary" href="#popular">{t.home.browse}<ArrowRight aria-hidden="true"/></a><a className="button secondary" href="#how-it-works">{t.home.how}</a></div><div className="hero-trust"><span><CheckCircle2/>{trust[0][locale]}</span><span><ShieldCheck/>{trust[1][locale]}</span></div></div>
   <div className="hero-visual" aria-hidden="true"><div className="visual-top"><span>SEO</span><span>Design</span><span>AI</span></div><div className="visual-card primary-visual"><div className="visual-icon"><TrendingUp/></div><div><small>{popularServices[0].provider}</small><strong>{popularServices[0].title[locale]}</strong></div><b>4.9 ★</b></div><div className="visual-card secondary-visual"><Sparkles/><span><small>{t.badges.aiService}</small><strong>{bestsellerServices[3].title[locale]}</strong></span></div><div className="visual-bars"><i/><i/><i/><i/></div></div>
  </section>
  <section id="categories" className="market-section"><SectionHeader title={t.home.categories} action={t.home.allCategories}/><div className="category-grid">{categories.map(c=><a key={c.id} className="category-card" href="#popular" aria-label={`${t.home.viewCategory}: ${c.name[locale]}`}><span className="category-icon"><MarketplaceIcon name={c.icon}/></span><strong>{c.name[locale]}</strong><small>{c.description[locale]}</small><em>{c.count} {t.home.services}</em></a>)}</div></section>
  <Services id="popular" title={t.home.popular} locale={locale} items={popularServices}/><Services id="bestsellers" title={t.home.bestsellers} locale={locale} items={bestsellerServices}/>
  <section className="market-section goals-section"><p className="section-eyebrow">{t.home.goalsEyebrow}</p><h2>{t.home.goals}</h2><div className="goals-grid">{goals.map(g=><a href="#categories" className="goal-card" key={g.id}><span><MarketplaceIcon name={g.icon}/></span><div><strong>{g.title[locale]}</strong><small>{g.description[locale]}</small></div><ArrowRight aria-hidden="true"/></a>)}</div></section>
  <aside className="trust-strip"><span className="demo-label">{t.home.demo}</span>{trust.map((item,i)=><div key={item.en}><CheckCircle2 aria-hidden="true"/><strong>{item[locale]}</strong><small>0{i+1}</small></div>)}</aside>
  <section id="how-it-works" className="market-section how-section"><SectionHeader title={t.home.works} action={t.home.browse}/><div className="steps">{steps.map((s,i)=><article key={s.id}><b>0{i+1}</b><span><MarketplaceIcon name={s.icon}/></span><h3>{s.title[locale]}</h3><p>{s.description[locale]}</p></article>)}</div></section>
  <footer className="market-footer"><strong>Digital <i>Step</i></strong><p>{t.home.footer}</p><a href="#main">{t.nav.main}</a><a href="#categories">{t.nav.categories}</a></footer>
 </>
}
export function MarketplaceSkeleton() { return <div className="skeleton-layout" aria-hidden="true"><div className="skeleton hero-skeleton"/><div className="skeleton-row">{[1,2,3,4].map(n=><div className="skeleton card-skeleton" key={n}/>)}</div></div> }
