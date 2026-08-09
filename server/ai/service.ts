import type { AIProvider, AIRequest } from './types.js'

export class AIService {
  constructor(private readonly provider: AIProvider) {}
  generateChatResponse(input: AIRequest) { return this.provider.generateChatResponse(input) }
}
