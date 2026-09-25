export interface NormalizedServicePackageFeature { id:string;textKa:string;textEn:string }
export interface NormalizedServicePackage { key:string;nameKa:string;nameEn:string;descriptionKa:string;descriptionEn:string;priceMinor:number;deliveryDays:number;revisions:number;features:NormalizedServicePackageFeature[] }

type JsonRecord=Record<string,unknown>
const record=(value:unknown):JsonRecord|null=>typeof value==='object'&&value!==null&&!Array.isArray(value)?value as JsonRecord:null
const text=(value:unknown,fallback='')=>typeof value==='string'?value:fallback
const integer=(value:unknown,fallback:number)=>typeof value==='number'&&Number.isInteger(value)?value:fallback
const legacyKey=(index:number)=>['basic','standard','premium'][index]??`package-${index+1}`

/** Converts both the pre-rich-content package JSON and the current shape. */
export function normalizeServicePackages(value:unknown,fallbackPriceMinor=0,fallbackDeliveryDays=1):NormalizedServicePackage[]{
 if(!Array.isArray(value))return[]
 return value.flatMap((entry,index)=>{
  const item=record(entry);if(!item)return[]
  const key=text(item.key,legacyKey(index)).toLowerCase()
  const currentFeatures=Array.isArray(item.features)?item.features:[]
  const legacyKa=Array.isArray(item.featuresKa)?item.featuresKa:[]
  const legacyEn=Array.isArray(item.featuresEn)?item.featuresEn:[]
  const features=currentFeatures.length?currentFeatures.flatMap((feature,featureIndex)=>{const data=record(feature);if(!data)return[];const textKa=text(data.textKa),textEn=text(data.textEn,textKa);return textKa&&textEn?[{id:text(data.id,`${key}-feature-${featureIndex+1}`),textKa,textEn}]:[]}):legacyKa.flatMap((ka,featureIndex)=>{const textKa=text(ka),textEn=text(legacyEn[featureIndex],textKa);return textKa&&textEn?[{id:`${key}-feature-${featureIndex+1}`,textKa,textEn}]:[]})
  return [{key,nameKa:text(item.nameKa,key),nameEn:text(item.nameEn,key),descriptionKa:text(item.descriptionKa),descriptionEn:text(item.descriptionEn),priceMinor:integer(item.priceMinor,fallbackPriceMinor),deliveryDays:integer(item.deliveryDays,fallbackDeliveryDays),revisions:integer(item.revisions,1),features}]
 })
}
