import type { OrderStatus } from './orders'

export interface ConversationSummary { id:string;orderId:string;orderNumber:string;serviceTitle:{ka:string;en:string};participant:{id:string;displayName:string;providerSlug:string|null};lastMessage:string;lastMessageAt:string;unreadCount:number;updatedAt:string }
export interface ChatMessage { id:string;senderUserId:string;content:string;createdAt:string;readAt:string|null }
export interface ConversationDetail { id:string;orderId:string;customerUserId:string;providerUserId:string;participant:{id:string;displayName:string;providerSlug:string|null};order:{id:string;orderNumber:string;serviceTitle:{ka:string;en:string};packageName:{ka:string;en:string};status:OrderStatus};messages:ChatMessage[];createdAt:string;updatedAt:string }
export type MessageErrorCode='CONVERSATION_NOT_FOUND'|'ORDER_NOT_FOUND'|'PROVIDER_NOT_ASSIGNED'|'INVALID_MESSAGE'|'UNAUTHENTICATED'|'FORBIDDEN'|'INTERNAL_ERROR'|'NETWORK_ERROR'
export class MessageApiError extends Error { constructor(public code:MessageErrorCode){super(code)} }
async function request<T>(path:string,options?:RequestInit){let response:Response;try{response=await fetch(path,{...options,credentials:'include',headers:{'Content-Type':'application/json',...options?.headers}})}catch{throw new MessageApiError('NETWORK_ERROR')}const body=await response.json().catch(()=>null) as {data?:T;error?:{code?:MessageErrorCode}}|null;if(!response.ok||!body?.data)throw new MessageApiError(body?.error?.code??'INTERNAL_ERROR');return body.data}
export const messagesApi={
 getConversations:()=>request<{conversations:ConversationSummary[]}>('/api/messages/conversations'),
 getConversation:(id:string)=>request<{conversation:ConversationDetail}>(`/api/messages/conversations/${encodeURIComponent(id)}`),
 getOrCreateOrderConversation:(orderId:string)=>request<{conversation:{id:string;orderId:string}}>(`/api/orders/${encodeURIComponent(orderId)}/conversation`,{method:'POST'}),
 sendMessage:(id:string,content:string)=>request<{message:ChatMessage}>(`/api/messages/conversations/${encodeURIComponent(id)}/messages`,{method:'POST',body:JSON.stringify({content})}),
 markConversationRead:(id:string)=>request<{success:true}>(`/api/messages/conversations/${encodeURIComponent(id)}/read`,{method:'POST'}),
 getUnreadMessageCount:()=>request<{count:number}>('/api/messages/unread-count'),
}
