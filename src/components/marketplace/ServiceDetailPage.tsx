import { useEffect, useState } from 'react'
import { ArrowLeft, BadgeCheck, Check, Sparkles } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { categories } from '../../data/marketplace'
import { getProviderBySlug, getRelatedServices, getServiceBySlug, getServiceDetail, type PackageTier } from '../../data/serviceDetails'
import { dictionary, localePath, type Locale } from '../../i18n'
import { ServiceCard } from './ServiceCard'
import { DigitalStepCard, FaqList, FavoriteButton, PackageSelector, ProviderCard, ServiceGallery } from './ServiceExperience'

const copy={ka:{about:'მომსახურების შესახებ',included:'რას მიიღებ',process:'სამუშაო პროცესი',faq:'ხშირად დასმული კითხვები',related:'მსგავსი მომსახურებები',notFound:'მომსახურება ვერ მოიძებნა',notFoundText:'შესაძლოა მომსახურება აღარ არის ხელმისაწვდომი ან ბმული შეცვლილია.',back:'მარკეტპლეისზე დაბრუნება',order:'შეკვეთა',digital:'Digital Step-ის სერვისი',verified:'დადასტურებული პროვაიდერი',featured:'რჩეული',popular:'პოპულარული',month:'/ თვე'},en:{about:'About This Service',included:'What’s Included',process:'Work Process',faq:'Frequently Asked Questions',related:'Related Services',notFound:'Service not found',notFoundText:'This service may no longer be available or the link has changed.',back:'Back to Marketplace',order:'Order Service',digital:'Digital Step Service',verified:'Verified Provider',featured:'Featured',popular:'Popular',month:'/ month'}} as const

export function ServiceDetailPage({locale,slug}:{locale:Locale;slug:string}) {
 const service=getServiceBySlug(slug),detail=service?getServiceDetail(service.id):undefined
 const provider=detail&&service?.serviceSource==='VERIFIED_PROVIDER'?getProviderBySlug(detail.providerSlug):undefined
 const [tier,setTier]=useState<PackageTier>(detail?.packages[0]?.id??'')
 const {user}=useAuth(); const c=copy[locale]
 useEffect(()=>{if(!service||!detail)return;const oldTitle=document.title;const description=detail.seoDescription?.[locale]||service.description[locale];document.title=detail.seoTitle?.[locale]||`${service.title[locale]} | Digital Step`;let meta=document.querySelector<HTMLMetaElement>('meta[name="description"]');const created=!meta;if(!meta){meta=document.createElement('meta');meta.name='description';document.head.append(meta)}const old=meta.content;meta.content=description;return()=>{document.title=oldTitle;if(created)meta?.remove();else if(meta)meta.content=old}},[service,detail,locale])
 if(!service||!detail)return <div className="not-found"><span>404</span><h1>{c.notFound}</h1><p>{c.notFoundText}</p><a href={localePath(locale,'/marketplace')}><ArrowLeft/>{c.back}</a></div>
 const category=categories.find(item=>item.id===service.category),selected=detail.packages.find(pack=>pack.id===tier)??detail.packages[0]
 const order=()=>{if(!selected)return;const target=localePath(locale,`/checkout?service=${encodeURIComponent(service.slug)}&package=${encodeURIComponent(selected.id)}`);window.location.assign(user?target:localePath(locale,`/login?returnTo=${encodeURIComponent(target)}`))}
 const typeLabel=dictionary[locale].catalog[service.serviceType],related=getRelatedServices(detail)
 const badges=[service.serviceSource==='DIGITAL_STEP'?c.digital:c.verified,service.isFeatured?c.featured:service.isPopular?c.popular:null].filter(Boolean)
 return <div className="service-detail-page">
  <nav className="breadcrumbs detail-breadcrumbs" aria-label="Breadcrumb"><a href={localePath(locale,'/')}>{dictionary[locale].nav.main}</a><span>/</span><a href={localePath(locale,'/marketplace')}>{dictionary[locale].nav.marketplace}</a>{category&&<><span>/</span><a href={localePath(locale,`/categories/${category.id}`)}>{category.name[locale]}</a></>}<span>/</span><strong>{service.title[locale]}</strong></nav>
  <div className="detail-layout"><div className="detail-main"><ServiceGallery items={detail.gallery} locale={locale} title={service.title[locale]}/><header className="service-heading"><div className="detail-badges">{badges.map(badge=><span key={badge}>{service.serviceSource==='DIGITAL_STEP'&&badge===c.digital?<Sparkles/>:<BadgeCheck/>}{badge}</span>)}</div><div className="title-row"><h1>{service.title[locale]}</h1><FavoriteButton locale={locale} serviceId={service.id}/></div><p>{service.description[locale]}</p><div className="heading-meta"><em>{category?.name[locale]}</em><em>{typeLabel}</em>{service.serviceSource==='VERIFIED_PROVIDER'&&<strong>{provider?.name||service.provider}</strong>}</div></header>
   {detail.longDescription[locale]&&<section className="content-section about-section"><h2>{c.about}</h2><div className="rich-copy">{detail.longDescription[locale].split(/\n+/).filter(Boolean).map((text,index)=><p key={index}>{text}</p>)}</div></section>}
   {detail.included.length>0&&<section className="content-section"><h2>{c.included}</h2><ul className="included-grid">{detail.included.map((item,index)=><li key={`${item.en}-${index}`}><Check/>{item[locale]||item.ka}</li>)}</ul></section>}
   {detail.process.length>0&&<section className="content-section process-section"><h2>{c.process}</h2><ol className="process-list">{detail.process.map((step,index)=><li key={`${step.en}-${index}`}><span>{String(index+1).padStart(2,'0')}</span><strong>{step[locale]||step.ka}</strong></li>)}</ol></section>}
   <div className="mobile-provider">{service.serviceSource==='DIGITAL_STEP'?<DigitalStepCard locale={locale}/>:provider?<ProviderCard provider={provider} locale={locale}/>:<section className="provider-card"><small>{c.verified}</small><strong>{service.provider}</strong></section>}</div>
   {detail.faq.length>0&&<section className="content-section"><h2>{c.faq}</h2><FaqList items={detail.faq} locale={locale}/></section>}
   {related.length>0&&<section className="content-section related-section"><h2>{c.related}</h2><div className="service-grid">{related.map(item=><ServiceCard key={item.id} service={item} locale={locale}/>)}</div></section>}
  </div><aside className="purchase-column"><PackageSelector packages={detail.packages} locale={locale} selected={tier} onSelect={setTier} onOrder={order} serviceType={service.serviceType}/>{service.serviceSource==='DIGITAL_STEP'?<DigitalStepCard locale={locale}/>:provider?<ProviderCard provider={provider} locale={locale}/>:<section className="provider-card"><small>{c.verified}</small><strong>{service.provider}</strong></section>}</aside></div>
  {selected&&<div className="mobile-purchase"><div><small>{selected.name?.[locale]||selected.id}</small><strong>{selected.price.toLocaleString(locale==='ka'?'ka-GE':'en-US')}₾ {service.serviceType==='monthly'&&<span>{c.month}</span>}</strong></div><button type="button" onClick={order}>{c.order}</button></div>}
 </div>
}
