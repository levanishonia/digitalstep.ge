const defaultModel = process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini'

export const aiConfig = {
  chatModel: process.env.OPENAI_CHAT_MODEL?.trim() || defaultModel,
  contentModel: process.env.OPENAI_CONTENT_MODEL?.trim() || defaultModel,
  analysisModel: process.env.OPENAI_ANALYSIS_MODEL?.trim() || defaultModel,
  maxMessageCharacters: 6000,
  historyMessageLimit: 20,
  maxOutputTokens: 1200,
  timeoutMs: 30_000,
  reservationLeaseMs: 60_000,
} as const

export const aiIsConfigured = () => Boolean(process.env.OPENAI_API_KEY?.trim())
