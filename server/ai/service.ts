import type { AIProvider, AIRequest } from './types.js'

export class AIService {
  constructor(private readonly provider: AIProvider) {}
  generateChatResponse(input: AIRequest) { return this.provider.generateChatResponse(input) }
  generatePost(input: Parameters<AIProvider['generatePost']>[0]) { return this.provider.generatePost(input) }
}
