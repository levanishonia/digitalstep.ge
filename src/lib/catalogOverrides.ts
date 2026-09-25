import { catalogServices,type ServiceType } from '../data/marketplace'
import { serviceDetails,type ServicePackage } from '../data/serviceDetails'
import { orderCatalog,type OrderCatalogPackage } from '../../shared/orderCatalog'
import { normalizeServicePackages,type NormalizedServicePackage } from '../../shared/servicePackages'

type Item={id:string;textKa:string;textEn:string}
type Step={id:string;titleKa:string;titleEn:string;textKa:string;textEn:string}
type Faq={id:string;questionKa:string;questionEn:string;answerKa:string;answerEn:string}
interface CatalogOverride {serviceId:string;status:'DRAFT'|'PENDING_REVIEW'|'ACTIVE'|'ARCHIVED';statusOnly:boolean;isCustom:boolean;titleKa?:string;titleEn?:string;descriptionKa?:string;descriptionEn?:string;fullDescriptionKa?:string;fullDescriptionEn?:string;category?:string;serviceType?:'ONE_TIME'|'MONTHLY'|'CONSULTATION';priceMinor?:number;deliveryDays?:number;isFeatured?:boolean;isPopular?:boolean;packages?:unknown;includedItems?:Item[]|null;processSteps?:Step[]|null;faqs?:Faq[]|null;seoTitleKa?:string|null;seoTitleEn?:string|null;seoDescriptionKa?:string|null;seoDescriptionEn?:string|null;slug?:string|null;serviceSource?:'DIGITAL_STEP'|'VERIFIED_PROVIDER';media?:{id:string;type:'IMAGE'|'VIDEO';url:string;width?:number|null;height?:number|null;duration?:number|null;sortOrder:number;isPrimary:boolean}[]}
let loaded:Promise<void>|undefined
const publicType=(value:CatalogOverride['serviceType']):ServiceType=>value==='MONTHLY'?'monthly':value==='CONSULTATION'?'consultation':'oneTime'
const detailPackages=(items:NormalizedServicePackage[]):ServicePackage[]=>items.map(pack=>({id:pack.key,name:{ka:pack.nameKa,en:pack.nameEn},price:pack.priceMinor/100,deliveryDays:pack.deliveryDays,revisions:pack.revisions,description:{ka:pack.descriptionKa,en:pack.descriptionEn},features:pack.features.map(x=>({ka:x.textKa,en:x.textEn}))}))
const orderPackages=(items:NormalizedServicePackage[]):OrderCatalogPackage[]=>items.map(pack=>({id:pack.key,name:{ka:pack.nameKa,en:pack.nameEn},priceMinor:pack.priceMinor,deliveryDays:pack.deliveryDays,features:pack.features.map(x=>({ka:x.textKa,en:x.textEn}))}))

export function loadCatalogOverrides(){
 loaded??=fetch('/api/catalog/overrides').then(async response=>{if(!response.ok)throw new Error('CATALOG_LOAD_FAILED');return response.json() as Promise<{data:{overrides:CatalogOverride[]}}>}).then(({data})=>{
  for(const override of data.overrides){
   let service=catalogServices.find(x=>x.id===override.serviceId),detail=serviceDetails.find(x=>x.serviceId===override.serviceId),orderService=orderCatalog.find(x=>x.id===override.serviceId)
   const complete=override.titleKa&&override.titleEn&&override.descriptionKa&&override.descriptionEn&&override.category&&override.priceMinor!==undefined&&override.deliveryDays!==undefined
   const normalizedPackages=normalizeServicePackages(override.packages,override.priceMinor,override.deliveryDays)
   if(override.isCustom&&!service&&complete){
    const packs=detailPackages(normalizedPackages)
    service={id:override.serviceId,slug:override.slug??override.serviceId,title:{ka:override.titleKa!,en:override.titleEn!},description:{ka:override.descriptionKa!,en:override.descriptionEn!},provider:'Digital Step Team',category:override.category!,rating:0,reviews:0,price:override.priceMinor!/100,deliveryDays:override.deliveryDays!,providerType:'digitalStep',serviceSource:'DIGITAL_STEP',status:override.status,serviceType:publicType(override.serviceType),badges:[],isFeatured:override.isFeatured,isPopular:override.isPopular,preview:'ai',createdOrder:Date.now()}
    detail={serviceId:service.id,providerSlug:'digital-step-team',longDescription:{ka:override.fullDescriptionKa??'',en:override.fullDescriptionEn??''},gallery:[],packages:packs,included:(override.includedItems??[]).map(x=>({ka:x.textKa,en:x.textEn})),process:(override.processSteps??[]).map(x=>({ka:`${x.titleKa}${x.textKa?` — ${x.textKa}`:''}`,en:`${x.titleEn}${x.textEn?` — ${x.textEn}`:''}`})),reviews:[],faq:(override.faqs??[]).map(x=>({id:x.id,question:{ka:x.questionKa,en:x.questionEn},answer:{ka:x.answerKa,en:x.answerEn}})),relatedIds:[],adminManaged:true}
    orderService={id:service.id,slug:service.slug,title:service.title,providerName:'Digital Step Team',providerSlug:'digital-step-team',serviceSource:'DIGITAL_STEP',status:override.status,packages:orderPackages(normalizedPackages)}
    catalogServices.push(service);serviceDetails.push(detail);orderCatalog.push(orderService)
   }
   if(!service||!detail||!orderService)continue
   const media=[...(override.media??[])].sort((a,b)=>Number(b.isPrimary)-Number(a.isPrimary)||a.sortOrder-b.sortOrder)
   service.media=media;service.isFeatured=override.isFeatured??false;service.isPopular=override.isPopular??false
   if(media.length)detail.gallery=media.map(x=>({id:x.id,label:{ka:x.type==='IMAGE'?'სერვისის სურათი':'სერვისის ვიდეო',en:x.type==='IMAGE'?'Service image':'Service video'},tone:'media',video:x.type==='VIDEO',url:x.url}))
   if(!override.statusOnly&&complete){
    Object.assign(service,{title:{ka:override.titleKa,en:override.titleEn},description:{ka:override.descriptionKa,en:override.descriptionEn},category:override.category,price:override.priceMinor!/100,deliveryDays:override.deliveryDays,serviceType:publicType(override.serviceType),status:override.status})
    detail.longDescription={ka:override.fullDescriptionKa??override.descriptionKa!,en:override.fullDescriptionEn??override.descriptionEn!}
    if(normalizedPackages.length){detail.packages=detailPackages(normalizedPackages);orderService.packages=orderPackages(normalizedPackages)}
    detail.included=(override.includedItems??[]).map(x=>({ka:x.textKa,en:x.textEn}))
    detail.process=(override.processSteps??[]).map(x=>({ka:`${x.titleKa}${x.textKa?` — ${x.textKa}`:''}`,en:`${x.titleEn}${x.textEn?` — ${x.textEn}`:''}`}))
    detail.faq=(override.faqs??[]).map(x=>({id:x.id,question:{ka:x.questionKa,en:x.questionEn},answer:{ka:x.answerKa,en:x.answerEn}}))
    detail.reviews=[];detail.adminManaged=true
    detail.seoTitle={ka:override.seoTitleKa??'',en:override.seoTitleEn??''}
    detail.seoDescription={ka:override.seoDescriptionKa??'',en:override.seoDescriptionEn??''}
    orderService.title={ka:override.titleKa!,en:override.titleEn!}
   }
   service.status=override.status;orderService.status=override.status
  }
 })
 return loaded
}
