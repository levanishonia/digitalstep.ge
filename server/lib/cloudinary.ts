import { createHash } from 'node:crypto'

const config=()=>({cloudName:process.env.CLOUDINARY_CLOUD_NAME,apiKey:process.env.CLOUDINARY_API_KEY,apiSecret:process.env.CLOUDINARY_API_SECRET})
const signature=(params:Record<string,string|number>,secret:string)=>createHash('sha1').update(`${Object.entries(params).sort(([a],[b])=>a.localeCompare(b)).map(([key,value])=>`${key}=${value}`).join('&')}${secret}`).digest('hex')

export type CloudinaryAsset={secure_url:string;public_id:string;width?:number;height?:number;duration?:number;resource_type:'image'|'video'}

export async function uploadServiceAsset(bytes:Buffer,serviceId:string,resourceType:'image'|'video'){
  const {cloudName,apiKey,apiSecret}=config()
  if(!cloudName||!apiKey||!apiSecret)throw new Error('CLOUDINARY_NOT_CONFIGURED')
  const timestamp=Math.floor(Date.now()/1000),folder=`digital-step/services/${serviceId}`
  const params={folder,timestamp},body=new FormData()
  body.set('file',new Blob([Uint8Array.from(bytes)]))
  body.set('api_key',apiKey);body.set('timestamp',String(timestamp));body.set('folder',folder);body.set('signature',signature(params,apiSecret))
  const response=await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,{method:'POST',body})
  if(!response.ok)throw new Error('CLOUDINARY_UPLOAD_FAILED')
  return await response.json() as CloudinaryAsset
}

export async function destroyServiceAsset(publicId:string,resourceType:'image'|'video'){
  const {cloudName,apiKey,apiSecret}=config()
  if(!cloudName||!apiKey||!apiSecret)throw new Error('CLOUDINARY_NOT_CONFIGURED')
  const timestamp=Math.floor(Date.now()/1000),params={public_id:publicId,timestamp},body=new URLSearchParams({...params,timestamp:String(timestamp),api_key:apiKey,signature:signature(params,apiSecret)})
  const response=await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`,{method:'POST',body})
  if(!response.ok)throw new Error('CLOUDINARY_DELETE_FAILED')
  const result=await response.json() as {result:string}
  if(!['ok','not found'].includes(result.result))throw new Error('CLOUDINARY_DELETE_FAILED')
}
