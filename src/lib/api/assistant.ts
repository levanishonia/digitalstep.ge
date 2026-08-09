import type { SubscriptionPlan } from '../../domain/subscriptions'
export type AIMessage={id:string;role:'USER'|'ASSISTANT';content:string;createdAt:string}
export type AIConversationSummary={id:string;title:string;createdAt:string;updatedAt:string}
export type AIUsage={plan:SubscriptionPlan;feature:'AI_ASSISTANT';used:number;limit:number;remaining:number;period:string}
export class AssistantApiError extends Error{constructor(public code:string,public status:number,public details:{retryMessageId?:string;conversationId?:string}={}){super(code)}}
async function request<T>(path:string,init?:RequestInit):Promise<T>{const response=await fetch(path,{...init,credentials:'include',headers:init?.body?{'Content-Type':'application/json',...init.headers}:init?.headers});if(response.status===204)return undefined as T;const json=await response.json().catch(()=>({}));if(!response.ok)throw new AssistantApiError(json?.error?.code??'INTERNAL_ERROR',response.status,json?.error??{});return json.data as T}
export const sendAssistantMessage=(input:{message:string;conversationId?:string;retryMessageId?:string;locale:'ka'|'en'})=>request<{conversation:{id:string;title:string};userMessage:AIMessage;assistantMessage:AIMessage;usage:AIUsage}>('/api/studio/assistant/chat',{method:'POST',body:JSON.stringify(input)})
export const getAIConversations=()=>request<{conversations:AIConversationSummary[]}>('/api/studio/assistant/conversations')
export const getAIConversation=(id:string)=>request<{conversation:AIConversationSummary&{messages:AIMessage[]}}>(`/api/studio/assistant/conversations/${encodeURIComponent(id)}`)
export const deleteAIConversation=(id:string)=>request<void>(`/api/studio/assistant/conversations/${encodeURIComponent(id)}`,{method:'DELETE'})
export const getAIUsage=()=>request<AIUsage>('/api/studio/usage')
