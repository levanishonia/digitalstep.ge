import type { Locale } from '../../i18n'

export type UserRole = 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
export interface AuthUser { id:string; firstName:string; lastName:string; email:string; emailVerifiedAt:string; phone:string|null; role:UserRole; preferredLocale:Locale; providerSlug:string|null; providerStatus:'PENDING'|'VERIFIED'|'SUSPENDED'; subscriptionPlan:'FREE'|'PRO'|'BUSINESS' }
export type PendingVerification={requiresVerification:true;email:string;retryAfter:number;deliveryFailed?:boolean}
export type AuthResult={user:AuthUser;requiresVerification:false}|PendingVerification
export type ApiErrorCode = 'INVALID_CREDENTIALS'|'EMAIL_ALREADY_EXISTS'|'VALIDATION_ERROR'|'CURRENT_PASSWORD_INCORRECT'|'NEW_PASSWORD_SAME_AS_CURRENT'|'PAYLOAD_TOO_LARGE'|'UNAUTHENTICATED'|'FORBIDDEN'|'EMAIL_NOT_VERIFIED'|'VERIFICATION_SEND_FAILED'|'VERIFICATION_CODE_INVALID'|'VERIFICATION_CODE_EXPIRED'|'VERIFICATION_TOO_MANY_ATTEMPTS'|'VERIFICATION_RESEND_TOO_SOON'|'INTERNAL_ERROR'|'RATE_LIMITED'|'NETWORK_ERROR'
export class AuthApiError extends Error { constructor(public code:ApiErrorCode,public retryAfter?:number) { super(code) } }

async function request<T>(path:string,options?:RequestInit):Promise<T>{let response:Response;try{response=await fetch(path,{...options,credentials:'include',headers:{'Content-Type':'application/json',...options?.headers}})}catch{throw new AuthApiError('NETWORK_ERROR')}const body=await response.json().catch(()=>null) as {data?:T;error?:{code?:ApiErrorCode;retryAfter?:number}}|null;if(!response.ok||!body?.data)throw new AuthApiError(body?.error?.code??'INTERNAL_ERROR',body?.error?.retryAfter);return body.data}
export const authApi={
 login:(input:{email:string;password:string})=>request<AuthResult>('/api/auth/login',{method:'POST',body:JSON.stringify(input)}),
 register:(input:{firstName:string;lastName:string;email:string;phone?:string;password:string;role:'CUSTOMER'|'PROVIDER';preferredLocale:Locale;termsAccepted:true})=>request<PendingVerification>('/api/auth/register',{method:'POST',body:JSON.stringify(input)}),
 verifyEmail:(code:string)=>request<{user:AuthUser}>('/api/auth/verify-email',{method:'POST',body:JSON.stringify({code})}),
 resendVerification:()=>request<{success:true;retryAfter:number}>('/api/auth/resend-verification',{method:'POST'}),
 me:()=>request<AuthResult>('/api/auth/me'),
 updateProfile:(input:{firstName?:string;lastName?:string;phone?:string|null;preferredLocale?:Locale})=>request<{user:AuthUser}>('/api/auth/me',{method:'PATCH',body:JSON.stringify(input)}),
 changePassword:(input:{currentPassword:string;newPassword:string})=>request<{success:boolean}>('/api/auth/me/password',{method:'PATCH',body:JSON.stringify(input)}),
 logout:()=>request<{success:boolean}>('/api/auth/logout',{method:'POST'}),
}
