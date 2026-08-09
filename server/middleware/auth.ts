import type { NextFunction, Request, Response } from 'express'
import type { UserRole } from '@prisma/client'
import { prisma } from '../lib/prisma.js'
import { readSession, SESSION_COOKIE } from '../lib/session.js'

export async function requireAuth(request: Request, response: Response, next: NextFunction) {
  try {
    const token = request.cookies?.[SESSION_COOKIE]
    if (!token) return response.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
    const userId = await readSession(token)
    const user = userId ? await prisma.user.findUnique({ where: { id: userId }, select: { id: true, role: true } }) : null
    if (!user) return response.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
    request.auth = { userId: user.id, role: user.role }
    next()
  } catch {
    return response.status(401).json({ error: { code: 'UNAUTHENTICATED' } })
  }
}

export const requireRole = (...roles: UserRole[]) => (request: Request, response: Response, next: NextFunction) =>
  request.auth && roles.includes(request.auth.role) ? next() : response.status(403).json({ error: { code: 'FORBIDDEN' } })
