import { Router } from 'express'
import { Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { rateLimit } from 'express-rate-limit'
import { prisma } from '../lib/prisma.js'
import { clearSessionCookie, createSession, setSessionCookie } from '../lib/session.js'
import { requireAuth } from '../middleware/auth.js'
import { loginSchema, registerSchema } from '../validation/auth.js'

export const authRouter = Router()
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: { code: 'RATE_LIMITED' } } })
const safeUser = { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, preferredLocale: true } as const

authRouter.post('/register', authLimiter, async (request, response, next) => {
  const parsed = registerSchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: { code: 'VALIDATION_ERROR' } })
  try {
    const { password, termsAccepted: _, ...profile } = parsed.data
    void _
    const user = await prisma.user.create({ data: { ...profile, termsAcceptedAt: new Date(), passwordHash: await bcrypt.hash(password, 12) }, select: safeUser })
    setSessionCookie(response, await createSession(user.id))
    return response.status(201).json({ data: { user } })
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
    if (!account || !(await bcrypt.compare(parsed.data.password, account.passwordHash))) return response.status(401).json({ error: { code: 'INVALID_CREDENTIALS' } })
    const user = await prisma.user.findUniqueOrThrow({ where: { id: account.id }, select: safeUser })
    setSessionCookie(response, await createSession(user.id))
    return response.json({ data: { user } })
  } catch (error) { next(error) }
})

authRouter.get('/me', requireAuth, async (request, response, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: request.auth!.userId }, select: safeUser })
    if (!user) return response.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
    return response.json({ data: { user } })
  } catch (error) { next(error) }
})

authRouter.post('/logout', (_request, response) => { clearSessionCookie(response); response.json({ data: { success: true } }) })
