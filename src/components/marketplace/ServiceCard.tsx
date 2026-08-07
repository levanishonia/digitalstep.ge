import { useState } from 'react'
import { Heart, Star } from 'lucide-react'
import type { Locale } from '../../i18n'
import { dictionary, localePath } from '../../i18n'
import type { Service } from '../../data/marketplace'
function Price({amount,locale}:{amount:number;locale:Locale}) { const price=new Intl.NumberFormat(locale==='ka'?'ka-GE':'en-US').format(amount); return <strong>{locale==='ka'?`${price}₾-დან`:`From ${price}₾`}</strong> }
export function ServiceCard({service,locale}:{service:Service;locale:Locale}) {
 const [favorite,setFavorite]=useState(false); const t=dictionary[locale]
 return <article className="service-card">
  <div className={`service-preview preview-${service.preview}`} aria-hidden="true"><span/><span/><span/></div>
  <div className="service-badges">{service.badges.slice(0,2).map(b=><span key={b}>{t.badges[b]}</span>)}</div>
  <button className="favorite" type="button" aria-pressed={favorite} aria-label={favorite?t.home.removeFavorite:t.home.addFavorite} onClick={()=>setFavorite(v=>!v)}><Heart fill={favorite?'currentColor':'none'} aria-hidden="true"/></button>
  <div className="service-body"><a className="service-title" href={localePath(locale,'/marketplace')} aria-label={`${t.home.viewService}: ${service.title[locale]}`}>{service.title[locale]}</a>
   <div className="provider"><span>{service.provider.split(' ').map(x=>x[0]).slice(0,2).join('')}</span>{service.provider}</div>
   <div className="service-meta"><span className="rating"><Star fill="currentColor" aria-hidden="true"/> {service.rating} <small>({service.reviews} {t.home.reviews})</small></span><Price amount={service.price} locale={locale}/></div>
  </div>
 </article>
}
