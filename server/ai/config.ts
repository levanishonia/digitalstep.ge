export const aiConfig = {
  model: process.env.OPENAI_MODEL?.trim() || 'gpt-5-mini',
  maxMessageCharacters: 6000,
  historyMessageLimit: 20,
  maxOutputTokens: 1200,
  timeoutMs: 30_000,
} as const

export const aiIsConfigured = () => Boolean(process.env.OPENAI_API_KEY?.trim())
