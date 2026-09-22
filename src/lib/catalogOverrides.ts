import { catalogServices } from '../data/marketplace'
import { serviceDetails } from '../data/serviceDetails'
import { orderCatalog } from '../../shared/orderCatalog'

interface PackageOverride { nameKa:string;nameEn:string;descriptionKa?:string;descriptionEn?:string;priceMinor:number;deliveryDays:number;featuresKa:string[];featuresEn:string[] }
interface CatalogOverride { serviceId:string;titleKa:string;titleEn:string;descriptionKa:string;descriptionEn:string;category:string;priceMinor:number;deliveryDays:number;status:'ACTIVE'|'ARCHIVED';packages:PackageOverride[]|null }

let loaded: Promise<void> | undefined

export function loadCatalogOverrides() {
  loaded ??= fetch('/api/catalog/overrides')
    .then(async response => {
      if (!response.ok) throw new Error('CATALOG_LOAD_FAILED')
      return response.json() as Promise<{data:{overrides:CatalogOverride[]}}>
    })
    .then(({data}) => {
      for (const override of data.overrides) {
        const service=catalogServices.find(item=>item.id===override.serviceId)
        const detail=serviceDetails.find(item=>item.serviceId===override.serviceId)
        const orderService=orderCatalog.find(item=>item.id===override.serviceId)
        if(!service||!detail||!orderService)continue
        Object.assign(service,{title:{ka:override.titleKa,en:override.titleEn},description:{ka:override.descriptionKa,en:override.descriptionEn},category:override.category,price:override.priceMinor/100,deliveryDays:override.deliveryDays,status:override.status})
        Object.assign(orderService,{title:{ka:override.titleKa,en:override.titleEn},status:override.status})
        if(override.packages?.length){override.packages.forEach((pack,index)=>{const current=detail.packages[index],orderPack=orderService.packages[index];if(current)Object.assign(current,{price:pack.priceMinor/100,deliveryDays:pack.deliveryDays,description:{ka:pack.descriptionKa??'',en:pack.descriptionEn??''},features:pack.featuresKa.map((ka,i)=>({ka,en:pack.featuresEn[i]??ka}))});if(orderPack)Object.assign(orderPack,{name:{ka:pack.nameKa,en:pack.nameEn},priceMinor:pack.priceMinor,deliveryDays:pack.deliveryDays,features:pack.featuresKa.map((ka,i)=>({ka,en:pack.featuresEn[i]??ka}))})})}
        else {if(detail.packages[0])Object.assign(detail.packages[0],{price:override.priceMinor/100,deliveryDays:override.deliveryDays});if(orderService.packages[0])Object.assign(orderService.packages[0],{priceMinor:override.priceMinor,deliveryDays:override.deliveryDays})}
      }
    })
  return loaded
}
