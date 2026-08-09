import { aiConfig } from './config.js'
import { AIProviderError, type AIProvider } from './types.js'
import { buildSystemInstruction } from './systemInstruction.js'

type OpenAIResponse = { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }> }

export const openAIProvider: AIProvider = {
  async generateChatResponse(input) {
    const apiKey = process.env.OPENAI_API_KEY?.trim()
    if (!apiKey) throw new AIProviderError('NOT_CONFIGURED')
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), aiConfig.timeoutMs)
    try {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST', signal: controller.signal,
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: aiConfig.model, instructions: buildSystemInstruction(input.businessContext, input.locale), input: input.messages.map(message => ({ role: message.role, content: message.content })), max_output_tokens: aiConfig.maxOutputTokens }),
      })
      if (!response.ok) throw new AIProviderError(response.status === 429 ? 'RATE_LIMITED' : 'PROVIDER_ERROR')
      const result = await response.json() as OpenAIResponse
      const content = result.output_text?.trim() || result.output?.flatMap(item => item.content ?? []).find(item => item.type === 'output_text')?.text?.trim()
      if (!content) throw new AIProviderError('PROVIDER_ERROR')
      return { content }
    } catch (error) {
      if (error instanceof AIProviderError) throw error
      if (error instanceof Error && error.name === 'AbortError') throw new AIProviderError('TIMEOUT')
      throw new AIProviderError('PROVIDER_ERROR')
    } finally { clearTimeout(timeout) }
  },
}
