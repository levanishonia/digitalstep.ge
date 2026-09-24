import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'
import { prisma } from './prisma.js'
import { sendVerificationCodeEmail } from '../email/service.js'

export const verificationTtlMinutes = Math.max(1, Number.parseInt(process.env.EMAIL_VERIFICATION_CODE_TTL_MINUTES || '10', 10) || 10)
export const verificationCooldownSeconds = Math.max(10, Number.parseInt(process.env.EMAIL_VERIFICATION_RESEND_COOLDOWN_SECONDS || '60', 10) || 60)
export const maxVerificationAttempts = 6
const maxSendsPerHour = 5

function digest(userId: string, code: string) {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is required')
  return createHmac('sha256', secret).update(`${userId}:${code}`).digest('hex')
}

export function matchesVerificationCode(userId: string, code: string, expected: string) {
  const actual = Buffer.from(digest(userId, code), 'hex')
  const stored = Buffer.from(expected, 'hex')
  return actual.length === stored.length && timingSafeEqual(actual, stored)
}

export async function issueVerificationCode(user: { id: string; email: string; firstName: string; preferredLocale: string }, enforceLimits = true) {
  const now = new Date()
  const code = randomInt(0, 1_000_000).toString().padStart(6, '0')
  const result = await prisma.$transaction(async tx => {
    // A transaction-scoped PostgreSQL advisory lock serializes all issuance for
    // this account. Concurrent resend requests cannot both pass the cooldown or
    // hourly checks and deliver two competing codes.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${user.id}))`
    if (enforceLimits) {
      const latest = await tx.emailVerificationCode.findFirst({ where: { userId: user.id }, orderBy: { createdAt: 'desc' } })
      if (latest && latest.resendAvailableAt > now) return { ok: false as const, code: 'VERIFICATION_RESEND_TOO_SOON' as const, retryAfter: Math.ceil((latest.resendAvailableAt.getTime() - now.getTime()) / 1000) }
      const issuedLastHour = await tx.emailVerificationCode.count({ where: { userId: user.id, createdAt: { gte: new Date(now.getTime() - 60 * 60 * 1000) } } })
      if (issuedLastHour >= maxSendsPerHour) return { ok: false as const, code: 'RATE_LIMITED' as const }
    }
    await tx.emailVerificationCode.updateMany({ where: { userId: user.id, usedAt: null }, data: { usedAt: now } })
    const record = await tx.emailVerificationCode.create({ data: { userId: user.id, codeHash: digest(user.id, code), expiresAt: new Date(now.getTime() + verificationTtlMinutes * 60_000), resendAvailableAt: new Date(now.getTime() + verificationCooldownSeconds * 1000) } })
    return { ok: true as const, record }
  })
  if (!result.ok) return result
  try {
    await sendVerificationCodeEmail({ to: user.email, firstName: user.firstName, code, ttlMinutes: verificationTtlMinutes, locale: user.preferredLocale === 'en' ? 'en' : 'ka' })
  } catch (error) {
    await prisma.emailVerificationCode.update({ where: { id: result.record.id }, data: { usedAt: new Date(), resendAvailableAt: new Date() } }).catch(() => undefined)
    throw error
  }
  return { ok: true as const, retryAfter: verificationCooldownSeconds }
}
