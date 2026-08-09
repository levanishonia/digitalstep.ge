import type { Locale } from '../../i18n'

export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
export interface AuthUser { id:string; firstName:string; lastName:string; email:string; phone:string|null; role:UserRole; preferredLocale:Locale; providerSlug:string|null; providerStatus:'PENDING'|'VERIFIED'|'SUSPENDED'; subscriptionPlan:'FREE'|'PRO'|'BUSINESS' }
export type ApiErrorCode = 'INVALID_CREDENTIALS'|'EMAIL_ALREADY_EXISTS'|'VALIDATION_ERROR'|'PAYLOAD_TOO_LARGE'|'UNAUTHENTICATED'|'FORBIDDEN'|'INTERNAL_ERROR'|'RATE_LIMITED'|'NETWORK_ERROR'
export class AuthApiError extends Error { constructor(public code:ApiErrorCode) { super(code) } }

async function request<T>(path:string, options?:RequestInit):Promise<T> {
  let response:Response
  try { response=await fetch(path,{...options,credentials:'include',headers:{'Content-Type':'application/json',...options?.headers}}) }
  catch { throw new AuthApiError('NETWORK_ERROR') }
  const body=await response.json().catch(()=>null) as {data?:T;error?:{code?:ApiErrorCode}}|null
  if(!response.ok||!body?.data) throw new AuthApiError(body?.error?.code??'INTERNAL_ERROR')
  return body.data
}
export const authApi={
  login:(input:{email:string;password:string})=>request<{user:AuthUser}>('/api/auth/login',{method:'POST',body:JSON.stringify(input)}),
  register:(input:{firstName:string;lastName:string;email:string;phone?:string;password:string;role:'CUSTOMER'|'PROVIDER';preferredLocale:Locale;termsAccepted:true})=>request<{user:AuthUser}>('/api/auth/register',{method:'POST',body:JSON.stringify(input)}),
  me:()=>request<{user:AuthUser}>('/api/auth/me'),
  logout:()=>request<{success:boolean}>('/api/auth/logout',{method:'POST'}),
}
