import type { Response } from 'express'
import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'digitalstep_session'
const expiresInSeconds = 60 * 60 * 24 * 7

function secret() {
  const value = process.env.AUTH_SECRET
  if (!value || value.length < 32) throw new Error('AUTH_SECRET must contain at least 32 characters')
  return new TextEncoder().encode(value)
}

export async function createSession(userId: string) {
  return new SignJWT({ sub: userId }).setProtectedHeader({ alg: 'HS256' }).setIssuedAt().setExpirationTime(`${expiresInSeconds}s`).sign(secret())
}

export async function readSession(token: string) {
  const { payload } = await jwtVerify(token, secret(), { algorithms: ['HS256'] })
  return typeof payload.sub === 'string' ? payload.sub : null
}

const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax' as const, path: '/' }
export function setSessionCookie(response: Response, token: string) { response.cookie(SESSION_COOKIE, token, { ...cookieOptions, maxAge: expiresInSeconds * 1000 }) }
export function clearSessionCookie(response: Response) { response.clearCookie(SESSION_COOKIE, cookieOptions) }
