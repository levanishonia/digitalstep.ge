import { loginAlertTemplate, verificationTemplate } from './templates.js'

type Locale = 'ka' | 'en'
type EmailContent = { subject: string; html: string; text: string }

const masked = (email: string) => email.replace(/^(.).+(@.+)$/, '$1***$2')

export class EmailProviderError extends Error {
  code = 'EMAIL_PROVIDER_UNAVAILABLE' as const
  constructor() { super('Transactional email provider unavailable') }
}

export async function sendTransactionalEmail(input: { to: string; recipientName?: string; template: string; content: EmailContent }) {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || 'Digital Step'
  if (!apiKey || !senderEmail) throw new EmailProviderError()
  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', { method: 'POST', headers: { accept: 'application/json', 'api-key': apiKey, 'content-type': 'application/json' }, body: JSON.stringify({ sender: { email: senderEmail, name: senderName }, to: [{ email: input.to, name: input.recipientName }], subject: input.content.subject, htmlContent: input.content.html, textContent: input.content.text }) })
    if (!response.ok) throw new Error(`Brevo status ${response.status}`)
    const result = await response.json().catch(() => ({})) as { messageId?: string }
    console.info('Transactional email sent', { template: input.template, recipient: masked(input.to), messageId: result.messageId })
  } catch (error) {
    console.error('Transactional email failed', { template: input.template, recipient: masked(input.to), message: error instanceof Error ? error.message : 'Provider request failed' })
    throw new EmailProviderError()
  }
}

export function sendVerificationCodeEmail(input: { to: string; firstName: string; code: string; ttlMinutes: number; locale: Locale }) {
  return sendTransactionalEmail({ to: input.to, recipientName: input.firstName, template: 'email-verification', content: verificationTemplate(input) })
}

export function sendLoginAlertEmail(input: { to: string; firstName: string; occurredAt: Date; device: string; locale: Locale }) {
  if (process.env.LOGIN_ALERT_EMAIL_ENABLED?.toLowerCase() === 'false') return Promise.resolve()
  const baseUrl = process.env.APP_BASE_URL?.replace(/\/$/, '')
  return sendTransactionalEmail({ to: input.to, recipientName: input.firstName, template: 'login-alert', content: loginAlertTemplate({ ...input, securityUrl: baseUrl ? `${baseUrl}/${input.locale}/dashboard/settings` : undefined }) })
}
