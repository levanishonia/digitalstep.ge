export const aiConfig = {
  chatModel: process.env.OPENAI_CHAT_MODEL?.trim() || 'gpt-5-mini',
  contentModel: process.env.OPENAI_CONTENT_MODEL?.trim() || 'gpt-5-mini',
  analysisModel: process.env.OPENAI_ANALYSIS_MODEL?.trim() || 'gpt-5-mini',
  maxMessageCharacters: 6000,
  historyMessageLimit: 20,
  maxOutputTokens: 1200,
  timeoutMs: 30_000,
  reservationLeaseMs: 60_000,
} as const

export const aiIsConfigured = () => Boolean(process.env.OPENAI_API_KEY?.trim())
