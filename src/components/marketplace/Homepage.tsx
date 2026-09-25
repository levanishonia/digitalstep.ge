import {
  ArrowRight, Bot, CheckCircle2, ChevronRight, CircleUserRound, Code2,
  Compass, FileText, Lightbulb, Megaphone, Palette, Search, Share2,
  Sparkles, Target, Workflow,
} from 'lucide-react'
import { planDefinitions } from '../../../shared/subscriptions'
import { studioLogoUrl } from '../../brand'
import { catalogServices, isServicePublic } from '../../data/marketplace'
import type { Locale } from '../../i18n'
import { dictionary, localePath } from '../../i18n'
import { Logo } from '../Logo'
import { ServiceCard } from './ServiceCard'

const copy = {
  ka: {
    heroTitle: 'ყველაფერი შენი ბიზნესის ციფრული ზრდისთვის — ერთ სივრცეში',
    heroText: 'მარკეტინგი, კონტენტი, რეკლამა, ვებსაიტები და AI ინსტრუმენტები — ერთიანი პროცესით შენი ბიზნესისთვის.',
    studio: 'Digital Step Studio', how: 'როგორ ვმუშაობთ',
    trust: ['ერთიანი ციფრული მომსახურება', 'ბიზნესზე მორგებული მიდგომა', 'AI ინსტრუმენტები', 'ქართული და ინგლისური მხარდაჭერა'],
    solutionsEyebrow: 'ერთიანი ციფრული ეკოსისტემა', solutionsTitle: 'რას აკეთებს Digital Step?',
    solutionsText: 'ერთი გუნდი და ერთი პლატფორმა შენი ბიზნესის ციფრული მიმართულებების სამართავად.',
    featuredText: 'Digital Step-ის მიერ შერჩეული მომსახურებები ბიზნესისთვის.',
    goalsEyebrow: 'ბიზნესის მიზნის მიხედვით', goalsTitle: 'რის მიღწევა გსურს?', goalsText: 'იპოვე მომსახურებები იმ შედეგის მიხედვით, რომელზეც ახლა მუშაობ.',
    studioTitle: 'AI სამუშაო სივრცე შენი ბიზნესისთვის',
    studioText: 'გამოიყენე AI ასისტენტი, შექმენი კონტენტის იდეები, პოსტები, მარკეტინგული გეგმები და მართე კონტენტის კალენდარი შენი ბიზნესის კონტექსტზე დაყრდნობით.',
    studioCta: 'Studio-ს გახსნა', pricing: 'გეგმების ნახვა', free: `AI ასისტენტი უფასო გეგმაზეც ხელმისაწვდომია — თვეში ${planDefinitions.FREE.limits.AI_REQUESTS} კითხვა.`,
    popularText: 'აღმოაჩინე მომხმარებლებისთვის აქტუალური ციფრული მომსახურებები.',
    worksEyebrow: 'მარტივი პროცესი', worksTitle: 'როგორ მუშაობს Digital Step',
    whyEyebrow: 'ერთად უკეთ მუშაობს', whyTitle: 'რატომ Digital Step?',
    finalTitle: 'მზად ხარ შემდეგი ციფრული ნაბიჯისთვის?', finalText: 'აირჩიე საჭირო მომსახურება ან დაიწყე Digital Step Studio-ს გამოყენება.',
    footerText: 'ციფრული მომსახურებები და AI ინსტრუმენტები ბიზნესის განვითარებისთვის.',
    services: 'მომსახურებები', company: 'Digital Step', account: 'სივრცეები', marketplace: 'მარკეტპლეისი',
  },
  en: {
    heroTitle: 'Everything your business needs for digital growth — in one place',
    heroText: 'Marketing, content, advertising, websites and AI tools — connected in one digital ecosystem.',
    studio: 'Digital Step Studio', how: 'How we work',
    trust: ['Connected digital services', 'A business-first approach', 'Practical AI tools', 'Georgian and English support'],
    solutionsEyebrow: 'One digital ecosystem', solutionsTitle: 'What does Digital Step do?',
    solutionsText: 'One team and one platform for managing the digital side of your business.',
    featuredText: 'Services curated by Digital Step for modern businesses.',
    goalsEyebrow: 'Start with your business goal', goalsTitle: 'What do you want to achieve?', goalsText: 'Find services based on the outcome your business is working toward.',
    studioTitle: 'An AI workspace for your business',
    studioText: 'Use an AI assistant, create content ideas and posts, build marketing plans, and manage your content calendar with your business context in mind.',
    studioCta: 'Open Studio', pricing: 'View plans', free: `The AI Assistant is available on the Free plan with ${planDefinitions.FREE.limits.AI_REQUESTS} questions per month.`,
    popularText: 'Explore digital services currently popular with customers.',
    worksEyebrow: 'A clear process', worksTitle: 'How Digital Step works',
    whyEyebrow: 'Better together', whyTitle: 'Why Digital Step?',
    finalTitle: 'Ready to take your next digital step?', finalText: 'Choose the service you need or start using Digital Step Studio.',
    footerText: 'Digital services and AI tools built around business growth.',
    services: 'Services', company: 'Digital Step', account: 'Workspaces', marketplace: 'Marketplace',
  },
} as const

const solutions = [
  {icon:Share2, category:'social', ka:['სოციალური მედია','მართე არხები ერთიანი სტრატეგიითა და კონტენტით.'], en:['Social Media','Manage your channels with connected strategy and content.']},
  {icon:FileText, category:'video', ka:['ვიდეო და კონტენტი','შექმენი ბიზნესზე მორგებული ტექსტი, ვიზუალი და ვიდეო.'], en:['Video & Content','Create copy, visuals, and video shaped around your business.']},
  {icon:Megaphone, category:'advertising', ka:['რეკლამა','დაგეგმე და გამართე მიზნობრივი სარეკლამო კამპანიები.'], en:['Advertising','Plan and launch focused advertising campaigns.']},
  {icon:Code2, category:'web', ka:['ვებსაიტები','შექმენი თანამედროვე ციფრული გამოცდილება მომხმარებლისთვის.'], en:['Web Development','Build a modern digital experience for your customers.']},
  {icon:Palette, category:'design', ka:['ბრენდინგი','ჩამოაყალიბე თანმიმდევრული და ცნობადი ვიზუალური ენა.'], en:['Branding','Develop a consistent and recognizable visual language.']},
  {icon:Search, category:'seo', ka:['Google და SEO','გააუმჯობესე ძიებაში ხილვადობა და Google-ის პროფილი.'], en:['Google & SEO','Improve search visibility and your presence on Google.']},
  {icon:Sparkles, category:'ai', ka:['AI ინსტრუმენტები','გამოიყენე AI ყოველდღიური ბიზნეს ამოცანებისთვის.'], en:['AI Tools','Put AI to work on everyday business tasks.']},
  {icon:Compass, category:'consulting', ka:['ბიზნეს სტრატეგია','დააკავშირე ციფრული აქტივობები მკაფიო ბიზნეს მიზნებთან.'], en:['Business Strategy','Connect digital activity to clear business goals.']},
] as const

const goals = [
  {icon:Target, category:'advertising', ka:'გაყიდვების ზრდა', en:'Increase Sales'},
  {icon:CircleUserRound, category:'marketing', ka:'ახალი მომხმარებლები', en:'Acquire Customers'},
  {icon:Megaphone, category:'design', ka:'ბრენდის ცნობადობა', en:'Brand Awareness'},
  {icon:Code2, category:'web', ka:'ახალი ვებსაიტი', en:'Launch a Website'},
  {icon:Share2, category:'social', ka:'სოციალური მედიის ზრდა', en:'Social Media Growth'},
  {icon:Workflow, category:'automation', ka:'პროცესების ავტომატიზაცია', en:'Automate Processes'},
] as const

const studioTools = [
  {icon:Bot, ka:'AI ასისტენტი', en:'AI Assistant'}, {icon:FileText, ka:'პოსტების გენერატორი', en:'Post Generator'},
  {icon:Lightbulb, ka:'კონტენტის იდეები', en:'Content Ideas'}, {icon:Compass, ka:'მარკეტინგის დამგეგმავი', en:'Marketing Planner'},
] as const

const workSteps = [
  {icon:Search, ka:['აირჩიე საჭირო სერვისი','დაათვალიერე აქტიური მომსახურებები და შეარჩიე შენს მიზანთან შესაბამისი ვარიანტი.'], en:['Choose what you need','Browse active services and select the option that fits your goal.']},
  {icon:FileText, ka:['გაგვიზიარე შენი მიზანი','მოგვაწოდე ბიზნესის კონტექსტი და სამუშაოსთვის საჭირო დეტალები.'], en:['Share your goal','Tell us about your business context and the details needed for the work.']},
  {icon:ArrowRight, ka:['დაიწყე მუშაობა Digital Step-თან','შეთანხმებული გეგმით გადადი შეკვეთასა და შესრულების პროცესზე.'], en:['Start working with Digital Step','Move into ordering and delivery with an agreed, transparent plan.']},
] as const

const whyItems = [
  {icon:Workflow, ka:['ერთი სივრცე','სხვადასხვა ციფრული მომსახურება და ინსტრუმენტი ერთ ეკოსისტემაში.'], en:['One workspace','Different digital services and tools in one ecosystem.']},
  {icon:Compass, ka:['ერთიანი სტრატეგია','კონტენტი, რეკლამა და ვები ერთმანეთისგან განცალკევებით არ მუშაობს.'], en:['Connected strategy','Content, advertising, and web work as one connected system.']},
  {icon:Sparkles, ka:['AI + პროფესიონალური სერვისები','Studio-ს ინსტრუმენტები რეალურ პროფესიონალურ მომსახურებებთან ერთად.'], en:['AI + professional services','Studio tools work alongside real professional services.']},
  {icon:Target, ka:['ბიზნესზე მორგებული პროცესი','მომსახურებები და ინსტრუმენტები ეყრდნობა შენს რეალურ ბიზნეს კონტექსტს.'], en:['Built around your business','Services and tools begin with your real business context.']},
] as const

function SectionHeading({eyebrow,title,text}:{eyebrow?:string;title:string;text?:string}) {
  return <header className="home-section-heading">{eyebrow&&<p className="section-eyebrow">{eyebrow}</p>}<h2>{title}</h2>{text&&<p>{text}</p>}</header>
}

function Services({id,title,text,locale,items}:{id:string;title:string;text:string;locale:Locale;items:typeof catalogServices}) {
  const t=dictionary[locale]
  if(!items.length)return null
  return <section id={id} className="market-section home-services"><div className="section-header"><SectionHeading title={title} text={text}/><a href={localePath(locale,'/marketplace')}>{t.home.viewAll}<ChevronRight aria-hidden="true"/></a></div><div className="service-grid" tabIndex={0} aria-label={title}>{items.map(service=><ServiceCard key={service.id} service={service} locale={locale}/>)}</div></section>
}

export function MarketplaceHomepage({locale}:{locale:Locale}) {
  const t=dictionary[locale], c=copy[locale]
  const featured=catalogServices.filter(service=>isServicePublic(service)&&service.isFeatured).slice(0,8)
  const popular=catalogServices.filter(service=>isServicePublic(service)&&service.isPopular).slice(0,8)
  return <div className="production-home">
    <section className="market-hero" aria-labelledby="hero-title">
      <div className="hero-copy"><p className="market-eyebrow"><Sparkles aria-hidden="true"/>Digital Step</p><h1 id="hero-title">{c.heroTitle}</h1><p>{c.heroText}</p><div className="hero-actions"><a className="button primary" href={localePath(locale,'/marketplace')}>{t.home.browse}<ArrowRight aria-hidden="true"/></a><a className="button secondary" href={localePath(locale,'/studio')}>{c.studio}</a><a className="hero-text-link" href="#how-it-works">{c.how}<ChevronRight aria-hidden="true"/></a></div><div className="hero-trust">{c.trust.map(item=><span key={item}><CheckCircle2 aria-hidden="true"/>{item}</span>)}</div></div>
      <div className="hero-workspace" aria-hidden="true"><div className="workspace-heading"><span className="workspace-mark"><Sparkles/></span><span><small>Digital Step</small><strong>{locale==='ka'?'ბიზნესის სამუშაო სივრცე':'Business workspace'}</strong></span><i/></div><div className="workspace-grid">{solutions.slice(0,4).map(({icon:Icon,ka,en})=><div key={en[0]}><Icon/><span><small>{locale==='ka'?'მიმართულება':'Workspace'}</small><strong>{locale==='ka'?ka[0]:en[0]}</strong></span></div>)}</div><div className="workspace-flow">{(locale==='ka'?['სტრატეგია','კონტენტი','კამპანია','განვითარება']:['Strategy','Content','Campaign','Growth']).map((item,index)=><span key={item}>{item}{index<3&&<ArrowRight/>}</span>)}</div></div>
    </section>

    <section className="market-section solutions-section"><SectionHeading eyebrow={c.solutionsEyebrow} title={c.solutionsTitle} text={c.solutionsText}/><div className="solution-grid">{solutions.map(({icon:Icon,category,ka,en})=><a key={category} className="solution-card" href={localePath(locale,`/categories/${category}`)}><span><Icon aria-hidden="true"/></span><strong>{locale==='ka'?ka[0]:en[0]}</strong><p>{locale==='ka'?ka[1]:en[1]}</p><ArrowRight className="card-arrow" aria-hidden="true"/></a>)}</div></section>

    <Services id="featured" title={t.home.bestsellers} text={c.featuredText} locale={locale} items={featured}/>

    <section className="market-section goals-section"><SectionHeading eyebrow={c.goalsEyebrow} title={c.goalsTitle} text={c.goalsText}/><div className="goals-grid">{goals.map(({icon:Icon,category,ka,en})=><a href={localePath(locale,`/categories/${category}`)} className="goal-card" key={category}><span><Icon aria-hidden="true"/></span><strong>{locale==='ka'?ka:en}</strong><ArrowRight aria-hidden="true"/></a>)}</div></section>

    <section className="studio-promo" aria-labelledby="studio-title"><div className="studio-copy"><img src={studioLogoUrl} alt="" loading="lazy"/><p className="section-eyebrow">Digital Step Studio</p><h2 id="studio-title">{c.studioTitle}</h2><p>{c.studioText}</p><div className="studio-actions"><a className="button primary" href={localePath(locale,'/studio')}>{c.studioCta}<ArrowRight aria-hidden="true"/></a><a className="button secondary" href={localePath(locale,'/pricing')}>{c.pricing}</a></div><small className="free-plan-note"><CheckCircle2 aria-hidden="true"/>{c.free}</small></div><div className="studio-preview" aria-hidden="true"><div className="studio-preview-top"><Sparkles/><span>Digital Step Studio</span><i/></div><div className="studio-tool-grid">{studioTools.map(({icon:Icon,ka,en})=><div key={en}><Icon/><strong>{locale==='ka'?ka:en}</strong><span/></div>)}</div></div></section>

    <Services id="popular" title={t.home.popular} text={c.popularText} locale={locale} items={popular}/>

    <section id="how-it-works" className="market-section how-section"><SectionHeading eyebrow={c.worksEyebrow} title={c.worksTitle}/><div className="steps">{workSteps.map(({icon:Icon,ka,en},index)=>{const item=locale==='ka'?ka:en;return <article key={item[0]}><b>0{index+1}</b><span><Icon aria-hidden="true"/></span><h3>{item[0]}</h3><p>{item[1]}</p></article>})}</div></section>

    <section className="market-section why-section"><SectionHeading eyebrow={c.whyEyebrow} title={c.whyTitle}/><div className="why-grid">{whyItems.map(({icon:Icon,ka,en})=>{const item=locale==='ka'?ka:en;return <article key={item[0]}><span><Icon aria-hidden="true"/></span><div><h3>{item[0]}</h3><p>{item[1]}</p></div></article>})}</div></section>

    <section className="home-final-cta"><div><p className="section-eyebrow">Digital Step</p><h2>{c.finalTitle}</h2><p>{c.finalText}</p></div><div><a className="button primary" href={localePath(locale,'/marketplace')}>{t.home.browse}<ArrowRight aria-hidden="true"/></a><a className="button secondary" href={localePath(locale,'/studio')}>{c.studioCta}</a></div></section>

    <footer className="market-footer"><div className="footer-brand"><Logo href={localePath(locale,'/')} label="Digital Step"/><p>{c.footerText}</p></div><div><strong>{c.services}</strong><a href={localePath(locale,'/marketplace')}>{c.marketplace}</a><a href={localePath(locale,'/categories/marketing')}>{locale==='ka'?'მარკეტინგი':'Marketing'}</a><a href={localePath(locale,'/categories/web')}>{locale==='ka'?'ვებსაიტები':'Web Development'}</a><a href={localePath(locale,'/categories/social')}>{locale==='ka'?'სოციალური მედია':'Social Media'}</a><a href={localePath(locale,'/categories/advertising')}>{locale==='ka'?'რეკლამა':'Advertising'}</a></div><div><strong>Studio</strong><a href={localePath(locale,'/studio')}>Digital Step Studio</a><a href={localePath(locale,'/pricing')}>{c.pricing}</a></div><div><strong>{c.account}</strong><a href={localePath(locale,'/business')}>{t.nav.business}</a><a href={localePath(locale,'/dashboard/orders')}>{t.nav.orders}</a><a href={localePath(locale,'/dashboard/profile')}>{t.nav.profile}</a></div><small>© {new Date().getFullYear()} Digital Step</small></footer>
  </div>
}

export function MarketplaceSkeleton() { return <div className="skeleton-layout" aria-hidden="true"><div className="skeleton hero-skeleton"/><div className="skeleton-row">{[1,2,3,4].map(n=><div className="skeleton card-skeleton" key={n}/>)}</div></div> }
