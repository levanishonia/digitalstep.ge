import { Router } from 'express'
import { Prisma } from '@prisma/client'
import { rateLimit } from 'express-rate-limit'
import { prisma } from '../lib/prisma.js'
import { clearSessionCookie, createSession, setSessionCookie } from '../lib/session.js'
import { requireAuth, requireSession } from '../middleware/auth.js'
import { changePasswordSchema, loginSchema, registerSchema, updateProfileSchema, verifyEmailSchema } from '../validation/auth.js'
import { hashPassword, verifyPassword } from '../lib/password.js'
import { resolveEffectivePlan, subscriptionUserSelect } from '../billing/subscriptionService.js'
import { issueVerificationCode, matchesVerificationCode, maxVerificationAttempts, verificationCooldownSeconds } from '../lib/emailVerification.js'
import { EmailProviderError, sendLoginAlertEmail } from '../email/service.js'

export const authRouter = Router()
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: { code: 'RATE_LIMITED' } } })
const verificationLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: { code: 'RATE_LIMITED' } } })
const resendLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: { code: 'RATE_LIMITED' } } })
const safeUser = { id: true, firstName: true, lastName: true, email: true, emailVerifiedAt: true, phone: true, role: true, preferredLocale: true, providerSlug: true, providerStatus: true, ...subscriptionUserSelect } as const
type SafeUser=Prisma.UserGetPayload<{select:typeof safeUser}>
const withEffectivePlan = (user:SafeUser) => { const {manualPlanOverride:_,manualPlanOverrideExpiresAt:__,subscription:___,...publicUser}=user;void _;void __;void ___;return {...publicUser,subscriptionPlan:resolveEffectivePlan(user).plan} }
const pendingPayload = (user: { email: string }, retryAfter = verificationCooldownSeconds, deliveryFailed = false) => ({ data: { requiresVerification: true, email: user.email.replace(/^(.).+(@.+)$/, '$1***$2'), retryAfter, deliveryFailed } })

// Registration creates a restricted session. Every product API uses requireAuth,
// which upgrades access only after emailVerifiedAt is persisted.
authRouter.post('/register', authLimiter, async (request, response, next) => {
  const parsed = registerSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR' } })
  try {
    const { password, termsAccepted: _, ...profile } = parsed.data
    void _
    const user = await prisma.user.create({ data: { ...profile, termsAcceptedAt: new Date(), passwordHash: await hashPassword(password) }, select: { id:true,email:true,firstName:true,preferredLocale:true } })
    setSessionCookie(response, await createSession(user.id))
    try {
      const issued = await issueVerificationCode(user, false)
      return response.status(201).json(pendingPayload(user, issued.retryAfter))
    } catch (error) {
      // The account and restricted session already exist. Return that durable
      // state instead of inviting a registration retry that can only conflict.
      if (error instanceof EmailProviderError) return response.status(201).json(pendingPayload(user, 0, true))
      throw error
    }
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return response.status(409).json({ error: { code: 'EMAIL_ALREADY_EXISTS' } })
    next(error)
  }
})

authRouter.post('/login', authLimiter, async (request, response, next) => {
  const parsed = loginSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR' } })
  try {
    const account = await prisma.user.findUnique({ where: { email: parsed.data.email } })
    if (!account || !(await verifyPassword(parsed.data.password, account.passwordHash))) return response.status(401).json({ error: { code: 'INVALID_CREDENTIALS' } })
    setSessionCookie(response, await createSession(account.id))
    if (!account.emailVerifiedAt) return response.json(pendingPayload(account, 0))
    const user = await prisma.user.findUniqueOrThrow({ where: { id: account.id }, select: safeUser })
    const occurredAt = new Date()
    sendLoginAlertEmail({ to: account.email, firstName: account.firstName, occurredAt, device: request.get('user-agent')?.slice(0, 300) || 'Unknown device', locale: account.preferredLocale === 'en' ? 'en' : 'ka' }).catch(() => undefined)
    return response.json({ data: { user:withEffectivePlan(user), requiresVerification: false } })
  } catch (error) { next(error) }
})

authRouter.post('/verify-email', verificationLimiter, requireSession, async (request, response, next) => {
  const parsed = verifyEmailSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR' } })
  try {
    const account = await prisma.user.findUnique({ where: { id: request.auth!.userId }, select: { emailVerifiedAt:true } })
    if (!account) return response.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
    if (account.emailVerifiedAt) {
      const user = await prisma.user.findUniqueOrThrow({ where:{id:request.auth!.userId}, select:safeUser })
      return response.json({ data:{ user:withEffectivePlan(user) } })
    }
    const record = await prisma.emailVerificationCode.findFirst({ where: { userId: request.auth!.userId, usedAt: null }, orderBy: { createdAt: 'desc' } })
    if (!record) return response.status(400).json({ error: { code: 'VERIFICATION_CODE_INVALID' } })
    if (record.expiresAt <= new Date()) {
      await prisma.emailVerificationCode.updateMany({ where:{id:record.id,usedAt:null}, data:{usedAt:new Date()} })
      return response.status(400).json({ error: { code: 'VERIFICATION_CODE_EXPIRED' } })
    }
    if (record.attempts >= maxVerificationAttempts) return response.status(429).json({ error: { code: 'VERIFICATION_TOO_MANY_ATTEMPTS' } })
    if (!matchesVerificationCode(request.auth!.userId, parsed.data.code, record.codeHash)) {
      const updated = await prisma.emailVerificationCode.update({ where:{id:record.id}, data:{attempts:{increment:1}, ...(record.attempts + 1 >= maxVerificationAttempts ? {usedAt:new Date()} : {})} })
      return response.status(updated.attempts >= maxVerificationAttempts ? 429 : 400).json({ error: { code: updated.attempts >= maxVerificationAttempts ? 'VERIFICATION_TOO_MANY_ATTEMPTS' : 'VERIFICATION_CODE_INVALID' } })
    }
    const now = new Date()
    const consumed = await prisma.$transaction(async tx => {
      const result = await tx.emailVerificationCode.updateMany({ where:{id:record.id,usedAt:null,expiresAt:{gt:now}}, data:{usedAt:now} })
      if (result.count === 1) await tx.user.update({ where:{id:request.auth!.userId}, data:{emailVerifiedAt:now} })
      return result
    })
    if (consumed.count !== 1) return response.status(400).json({ error:{code:'VERIFICATION_CODE_INVALID'} })
    const user = await prisma.user.findUniqueOrThrow({ where:{id:request.auth!.userId}, select:safeUser })
    return response.json({ data:{ user:withEffectivePlan(user) } })
  } catch(error) { next(error) }
})

authRouter.post('/resend-verification', resendLimiter, requireSession, async (request, response, next) => {
  try {
    const user = await prisma.user.findUnique({ where:{id:request.auth!.userId}, select:{id:true,email:true,firstName:true,preferredLocale:true,emailVerifiedAt:true} })
    if (!user) return response.status(401).json({error:{code:'UNAUTHENTICATED'}})
    if (user.emailVerifiedAt) return response.json({data:{success:true,retryAfter:0}})
    const result = await issueVerificationCode(user)
    if (!result.ok) return response.status(result.code === 'RATE_LIMITED' ? 429 : 400).json({error:{code:result.code,retryAfter:result.retryAfter}})
    return response.json({data:{success:true,retryAfter:result.retryAfter}})
  } catch(error) {
    if(error instanceof EmailProviderError)return response.status(503).json({error:{code:'VERIFICATION_SEND_FAILED'}})
    next(error)
  }
})

authRouter.get('/me', requireSession, async (request, response, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: request.auth!.userId }, select: safeUser })
    if (!user) return response.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
    return response.json({ data: user.emailVerifiedAt ? { user:withEffectivePlan(user), requiresVerification:false } : { requiresVerification:true, email:user.email.replace(/^(.).+(@.+)$/,'$1***$2'), retryAfter:0 } })
  } catch (error) { next(error) }
})

authRouter.patch('/me', requireAuth, async (request, response, next) => {
  const parsed = updateProfileSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR' } })
  try { const user = await prisma.user.update({ where:{id:request.auth!.userId},data:parsed.data,select:safeUser }); return response.json({data:{user:withEffectivePlan(user)}}) } catch(error){next(error)}
})

authRouter.patch('/me/password', requireAuth, authLimiter, async (request, response, next) => {
  const parsed=changePasswordSchema.safeParse(request.body);if(!parsed.success)return response.status(400).json({error:{code:'VALIDATION_ERROR'}})
  try{const account=await prisma.user.findUnique({where:{id:request.auth!.userId},select:{id:true,passwordHash:true}});if(!account)return response.status(401).json({error:{code:'UNAUTHENTICATED'}});if(!(await verifyPassword(parsed.data.currentPassword,account.passwordHash)))return response.status(400).json({error:{code:'CURRENT_PASSWORD_INCORRECT'}});if(await verifyPassword(parsed.data.newPassword,account.passwordHash))return response.status(400).json({error:{code:'NEW_PASSWORD_SAME_AS_CURRENT'}});const updated=await prisma.user.updateMany({where:{id:account.id,passwordHash:account.passwordHash},data:{passwordHash:await hashPassword(parsed.data.newPassword)}});if(updated.count!==1)return response.status(400).json({error:{code:'CURRENT_PASSWORD_INCORRECT'}});return response.json({data:{success:true}})}catch(error){next(error)}
})

authRouter.post('/logout', (_request,response)=>{clearSessionCookie(response);response.json({data:{success:true}})})
