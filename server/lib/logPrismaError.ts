import { Prisma } from '@prisma/client'
import type { Request } from 'express'

const sensitiveKey = /authorization|cookie|password|secret|token|api.?key|database.?url/i

function safeMeta(value: unknown, key = '', depth = 0): unknown {
  if (sensitiveKey.test(key)) return '[REDACTED]'
  if (depth > 4) return '[TRUNCATED]'
  if (value === null || typeof value === 'number' || typeof value === 'boolean') return value
  if (typeof value === 'string') return value.length > 1_000 ? `${value.slice(0, 1_000)}…` : value
  if (Array.isArray(value)) return value.slice(0, 20).map(item => safeMeta(item, key, depth + 1))
  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([entryKey, entryValue]) => [entryKey, safeMeta(entryValue, entryKey, depth + 1)]))
  }
  return String(value)
}

export function logPrismaError(error: unknown, request: Request, operation?: string): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false

  console.error('Request failed', {
    method: request.method,
    path: `${request.baseUrl}${request.path}`,
    operation,
    name: error.name,
    code: error.code,
    message: error.message,
    meta: safeMeta(error.meta),
    clientVersion: error.clientVersion,
    stack: error.stack,
  })
  return true
}
