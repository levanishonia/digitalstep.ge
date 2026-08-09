import type { BusinessContext } from '../../shared/businessProfile.js'

export type AIChatMessage = { role: 'user' | 'assistant'; content: string }
export interface AIRequest { messages: AIChatMessage[]; businessContext: BusinessContext | null; locale: 'ka' | 'en' }
export interface AIResponse { content: string }
export interface AIProvider { generateChatResponse(input: AIRequest): Promise<AIResponse> }

export class AIProviderError extends Error {
  constructor(public kind: 'NOT_CONFIGURED' | 'RATE_LIMITED' | 'TIMEOUT' | 'PROVIDER_ERROR') { super(kind) }
}
