import express, { type ErrorRequestHandler } from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { authRouter } from './routes/auth.js'

export const app = express()
app.disable('x-powered-by')
app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api', (_request, response) => response.status(404).json({ error: { code: 'NOT_FOUND' } }))

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
app.use(express.static(path.join(root, 'dist')))
app.use((_request, response) => response.sendFile(path.join(root, 'dist', 'index.html')))

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next
  console.error('Request failed', error instanceof Error ? error.name : 'UnknownError')
  response.status(500).json({ error: { code: 'INTERNAL_ERROR' } })
}
app.use(errorHandler)
