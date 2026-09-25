import { catalogServices } from '../data/marketplace'
import { serviceDetails } from '../data/serviceDetails'
import { orderCatalog } from '../../shared/orderCatalog'

interface PackageOverride { nameKa:string;nameEn:string;descriptionKa?:string;descriptionEn?:string;priceMinor:number;deliveryDays:number;featuresKa:string[];featuresEn:string[] }
interface CatalogOverride { serviceId:string;titleKa:string;titleEn:string;descriptionKa:string;descriptionEn:string;category:string;priceMinor:number;deliveryDays:number;status:'DRAFT'|'PENDING_REVIEW'|'ACTIVE'|'ARCHIVED';isFeatured:boolean;isPopular:boolean;packages:PackageOverride[]|null;isCustom:boolean;statusOnly:boolean;slug:string|null;serviceSource:'DIGITAL_STEP'|'VERIFIED_PROVIDER';media:{id:string;type:'IMAGE'|'VIDEO';url:string;width?:number|null;height?:number|null;duration?:number|null;sortOrder:number;isPrimary:boolean}[] }

let loaded: Promise<void> | undefined

export function loadCatalogOverrides() {
  loaded ??= fetch('/api/catalog/overrides')
    .then(async response => {
      if (!response.ok) throw new Error('CATALOG_LOAD_FAILED')
      return response.json() as Promise<{data:{overrides:CatalogOverride[]}}>
    })
    .then(({data}) => {
      for (const override of data.overrides) {
        let service=catalogServices.find(item=>item.id===override.serviceId)
        let detail=serviceDetails.find(item=>item.serviceId===override.serviceId)
        let orderService=orderCatalog.find(item=>item.id===override.serviceId)
        if(override.isCustom&&!service){
          const slug=override.slug??override.serviceId
          service={id:override.serviceId,slug,title:{ka:override.titleKa,en:override.titleEn},description:{ka:override.descriptionKa,en:override.descriptionEn},provider:'Digital Step Team',category:override.category,rating:0,reviews:0,price:override.priceMinor/100,deliveryDays:override.deliveryDays,providerType:'digitalStep',serviceSource:'DIGITAL_STEP',status:override.status,serviceType:'oneTime',badges:[],isFeatured:override.isFeatured,isPopular:override.isPopular,preview:'ai',createdOrder:Date.now()}
          const packs=(override.packages?.length?override.packages:[{nameKa:'საბაზისო',nameEn:'Basic',descriptionKa:'',descriptionEn:'',priceMinor:override.priceMinor,deliveryDays:override.deliveryDays,featuresKa:['Digital Step მხარდაჭერა'],featuresEn:['Digital Step support']}]).map((pack,index)=>({id:(['basic','standard','premium'][index]??'premium') as 'basic'|'standard'|'premium',price:pack.priceMinor/100,deliveryDays:pack.deliveryDays,revisions:1,description:{ka:pack.descriptionKa??'',en:pack.descriptionEn??''},features:pack.featuresKa.map((ka,i)=>({ka,en:pack.featuresEn[i]??ka}))}))
          detail={serviceId:service.id,providerSlug:'digital-step-team',longDescription:service.description,gallery:[],packages:packs,included:packs[0]?.features??[],process:[],reviews:[],faq:[],relatedIds:catalogServices.filter(x=>x.category===service!.category).slice(0,4).map(x=>x.id)}
          orderService={id:service.id,slug,title:service.title,providerName:'Digital Step Team',providerSlug:'digital-step-team',serviceSource:'DIGITAL_STEP',status:override.status,packages:packs.map(pack=>({id:pack.id,name:{ka:override.packages?.find((_,i)=>i===packs.indexOf(pack))?.nameKa??'საბაზისო',en:override.packages?.find((_,i)=>i===packs.indexOf(pack))?.nameEn??'Basic'},priceMinor:Math.round(pack.price*100),deliveryDays:pack.deliveryDays,features:pack.features}))}
          catalogServices.push(service);serviceDetails.push(detail);orderCatalog.push(orderService!)
        }
        if(!service||!detail||!orderService)continue
        service.media=[...override.media].sort((a,b)=>Number(b.isPrimary)-Number(a.isPrimary)||a.sortOrder-b.sortOrder);service.isFeatured=override.isFeatured;service.isPopular=override.isPopular
        if(override.media.length)detail.gallery=override.media.map(item=>({id:item.id,label:{ka:item.type==='IMAGE'?'სერვისის სურათი':'სერვისის ვიდეო',en:item.type==='IMAGE'?'Service image':'Service video'},tone:'media',video:item.type==='VIDEO',url:item.url}))
        if(!override.statusOnly)Object.assign(service,{title:{ka:override.titleKa,en:override.titleEn},description:{ka:override.descriptionKa,en:override.descriptionEn},category:override.category,price:override.priceMinor/100,deliveryDays:override.deliveryDays,status:override.status})
        else Object.assign(service,{status:override.status})
        Object.assign(orderService,{...(override.statusOnly?{}:{title:{ka:override.titleKa,en:override.titleEn}}),status:override.status})
        if(override.packages?.length){override.packages.forEach((pack,index)=>{const current=detail.packages[index],orderPack=orderService.packages[index];if(current)Object.assign(current,{price:pack.priceMinor/100,deliveryDays:pack.deliveryDays,description:{ka:pack.descriptionKa??'',en:pack.descriptionEn??''},features:pack.featuresKa.map((ka,i)=>({ka,en:pack.featuresEn[i]??ka}))});if(orderPack)Object.assign(orderPack,{name:{ka:pack.nameKa,en:pack.nameEn},priceMinor:pack.priceMinor,deliveryDays:pack.deliveryDays,features:pack.featuresKa.map((ka,i)=>({ka,en:pack.featuresEn[i]??ka}))})})}
        else {if(detail.packages[0])Object.assign(detail.packages[0],{price:override.priceMinor/100,deliveryDays:override.deliveryDays});if(orderService.packages[0])Object.assign(orderService.packages[0],{priceMinor:override.priceMinor,deliveryDays:override.deliveryDays})}
      }
    })
  return loaded
}
