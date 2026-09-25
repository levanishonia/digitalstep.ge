import { BadgeCheck, Clock3, Heart, Sparkles, Star } from 'lucide-react'
import type { Locale } from '../../i18n'
import { dictionary, localePath } from '../../i18n'
import type { Service } from '../../data/marketplace'
import { toggleFavorite, useFavorites } from '../../lib/favorites'
export function ServicePrice({service,locale}:{service:Service;locale:Locale}) { const price=new Intl.NumberFormat(locale==='ka'?'ka-GE':'en-US').format(service.price); const text=service.serviceType==='monthly'?(locale==='ka'?`${price} ₾ / თვე`:`${price} GEL / month`):(locale==='ka'?`${price} ₾-დან`:`From ${price} GEL`); return <strong>{text}</strong> }
export function ServiceMedia({service}:{service:Service}) { const primary=service.media?.find(item=>item.isPrimary)??service.media?.[0]; if(!primary)return <div className={`service-preview preview-${service.preview}`} aria-hidden="true"><span/><span/><span/></div>; const transform=primary.type==='IMAGE'?'f_auto,q_auto,w_720,h_432,c_fill':'so_0,f_jpg,q_auto,w_720,h_432,c_fill'; const transformed=primary.url.replace('/upload/',`/upload/${transform}/`); const url=primary.type==='VIDEO'?transformed.replace(/\.[^.]+$/,'.jpg'):transformed; return <div className={`service-preview service-media ${primary.type==='VIDEO'?'service-video-poster':''}`}><img src={url} alt="" loading="lazy"/>{primary.type==='VIDEO'&&<span aria-hidden="true">▶</span>}</div> }
export function ServiceSourceBadge({service,locale,className=''}:{service:Service;locale:Locale;className?:string}) {
 const t=dictionary[locale]
 if(service.serviceSource==='VERIFIED_PROVIDER'&&service.providerStatus!=='VERIFIED')return null
 const official=service.serviceSource==='DIGITAL_STEP'
 return <span className={`source-badge ${official?'official':''} ${className}`.trim()}>{official?<Sparkles aria-hidden="true"/>:<BadgeCheck aria-hidden="true"/>}{official?t.trust.digitalStep:t.trust.verified}</span>
}
export function ServiceCard({service,locale}:{service:Service;locale:Locale}) {
 const favorite=useFavorites().includes(service.id); const t=dictionary[locale]; const typeLabel=t.catalog[service.serviceType]
 return <article className="service-card">
  <a className="service-media-link" href={localePath(locale,`/services/${service.slug}`)} aria-label={`${t.home.viewService}: ${service.title[locale]}`}><ServiceMedia service={service}/></a>
  <div className="service-badges">{service.isFeatured&&<span>{locale==='ka'?'რჩეული':'Featured'}</span>}{service.isPopular&&!service.isFeatured&&<span>{locale==='ka'?'პოპულარული':'Popular'}</span>}{service.badges.slice(0,service.isFeatured||service.isPopular?1:2).map(b=><span key={b}>{t.badges[b]}</span>)}</div>
  <button className="favorite" type="button" aria-pressed={favorite} aria-label={favorite?t.home.removeFavorite:t.home.addFavorite} onClick={()=>toggleFavorite(service.id)}><Heart fill={favorite?'currentColor':'none'} aria-hidden="true"/></button>
  <div className="service-body"><ServiceSourceBadge service={service} locale={locale}/><a className="service-title" href={localePath(locale,`/services/${service.slug}`)} aria-label={`${t.home.viewService}: ${service.title[locale]}`}>{service.title[locale]}</a>
   <div className="provider"><span>{service.provider.split(' ').map(x=>x[0]).slice(0,2).join('')}</span>{service.serviceSource==='DIGITAL_STEP'?'Digital Step':service.provider}</div>
   <p className="service-description">{service.description[locale]}</p>
   <div className="service-facts"><span>{typeLabel}</span>{service.serviceType!=='monthly'&&<span><Clock3 aria-hidden="true"/>{t.catalog.deliveryDays.replace('{count}',String(service.deliveryDays))}</span>}</div>
   <div className="service-meta">{service.reviews>0&&<span className="rating"><Star fill="currentColor" aria-hidden="true"/> {service.rating} <small>({service.reviews})</small></span>}<ServicePrice service={service} locale={locale}/></div>
  </div>
 </article>
}
