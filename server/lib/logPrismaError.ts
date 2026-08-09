import { Prisma } from '@prisma/client'
import type { Request } from 'express'

const safeMetaKeys = new Set(['code', 'modelName', 'target', 'field_name', 'column_name', 'constraint', 'table'])
const safeIdentifier = /^[A-Za-z_][A-Za-z0-9_." -]{0,199}$/
const safeCode = /^[A-Z0-9]{1,12}$/i

function safeMeta(meta: unknown): Record<string, unknown> | undefined {
  if (!meta || typeof meta !== 'object' || Array.isArray(meta)) return undefined

  const safeEntries: Array<[string, unknown]> = []
  for (const [key, value] of Object.entries(meta)) {
    if (!safeMetaKeys.has(key)) continue
    if (key === 'code' && typeof value === 'string' && safeCode.test(value)) {
      safeEntries.push([key, value])
      continue
    }
    if (typeof value === 'string' && safeIdentifier.test(value)) {
      safeEntries.push([key, value])
      continue
    }
    if (key === 'target' && Array.isArray(value)) {
      const fields = value.filter((field): field is string => typeof field === 'string' && safeIdentifier.test(field)).slice(0, 20)
      if (fields.length === value.length) safeEntries.push([key, fields])
    }
  }
  return safeEntries.length ? Object.fromEntries(safeEntries) : undefined
}

function safeStack(stack: string | undefined): string | undefined {
  if (!stack) return undefined
  const frames = stack.split('\n').filter(line => /^\s*at\s/.test(line)).slice(0, 20)
  return frames.length ? frames.join('\n') : undefined
}

export function logPrismaError(error: unknown, request: Request, operation?: string): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return false

  console.error('Request failed', {
    method: request.method,
    path: `${request.baseUrl}${request.path}`,
    operation,
    name: error.name,
    code: error.code,
    // Prisma/database messages can echo query values. The P-code and an
    // allow-listed subset of metadata provide diagnostics without that data.
    message: `Prisma known request error ${error.code}`,
    meta: safeMeta(error.meta),
    clientVersion: error.clientVersion,
    stack: safeStack(error.stack),
  })
  return true
}
