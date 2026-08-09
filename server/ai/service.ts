import type { AIProvider, AIRequest } from './types.js'

export class AIService {
  constructor(private readonly provider: AIProvider) {}
  generateChatResponse(input: AIRequest) { return this.provider.generateChatResponse(input) }
  generatePost(input: Parameters<AIProvider['generatePost']>[0]) { return this.provider.generatePost(input) }
  generateContentIdeas(input: Parameters<AIProvider['generateContentIdeas']>[0]) { return this.provider.generateContentIdeas(input) }
  generateMarketingPlan(input:Parameters<AIProvider['generateMarketingPlan']>[0]){return this.provider.generateMarketingPlan(input)}
  generateBusinessAnalysis(input:Parameters<AIProvider['generateBusinessAnalysis']>[0]){return this.provider.generateBusinessAnalysis(input)}
}
