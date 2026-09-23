import { BadgeCheck, Heart, Sparkles, Star } from 'lucide-react'
import type { Locale } from '../../i18n'
import { dictionary, localePath } from '../../i18n'
import type { Service } from '../../data/marketplace'
import { toggleFavorite, useFavorites } from '../../lib/favorites'
function Price({amount,locale}:{amount:number;locale:Locale}) { const price=new Intl.NumberFormat(locale==='ka'?'ka-GE':'en-US').format(amount); return <strong>{locale==='ka'?`${price}₾-დან`:`From ${price}₾`}</strong> }
export function ServiceSourceBadge({service,locale,className=''}:{service:Service;locale:Locale;className?:string}) {
 const t=dictionary[locale]
 if(service.serviceSource==='VERIFIED_PROVIDER'&&service.providerStatus!=='VERIFIED')return null
 const official=service.serviceSource==='DIGITAL_STEP'
 return <span className={`source-badge ${official?'official':''} ${className}`.trim()}>{official?<Sparkles aria-hidden="true"/>:<BadgeCheck aria-hidden="true"/>}{official?t.trust.digitalStep:t.trust.verified}</span>
}
export function ServiceCard({service,locale}:{service:Service;locale:Locale}) {
 const favorite=useFavorites().includes(service.id); const t=dictionary[locale],image=service.media?.find(item=>item.type==='IMAGE')
 return <article className="service-card">
  {image?<img className="service-preview service-media-image" src={image.url.replace('/upload/','/upload/f_auto,q_auto,w_640,c_fill/')} alt="" loading="lazy"/>:<div className={`service-preview preview-${service.preview}`} aria-hidden="true"><span/><span/><span/></div>}
  <div className="service-badges">{service.badges.slice(0,2).map(b=><span key={b}>{t.badges[b]}</span>)}</div>
  <ServiceSourceBadge service={service} locale={locale}/>
  <button className="favorite" type="button" aria-pressed={favorite} aria-label={favorite?t.home.removeFavorite:t.home.addFavorite} onClick={()=>toggleFavorite(service.id)}><Heart fill={favorite?'currentColor':'none'} aria-hidden="true"/></button>
  <div className="service-body"><a className="service-title" href={localePath(locale,`/services/${service.slug}`)} aria-label={`${t.home.viewService}: ${service.title[locale]}`}>{service.title[locale]}</a>
   <div className="provider"><span>{service.provider.split(' ').map(x=>x[0]).slice(0,2).join('')}</span>{service.provider}</div>
   <div className="service-meta"><span className="rating"><Star fill="currentColor" aria-hidden="true"/> {service.rating} <small>({service.reviews} {t.home.reviews})</small></span><Price amount={service.price} locale={locale}/></div>
  </div>
 </article>
}
