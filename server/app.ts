import express, { type ErrorRequestHandler } from 'express'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import path from 'node:path'
import { authRouter } from './routes/auth.js'
import { ordersRouter } from './routes/orders.js'
import { providerOrdersRouter } from './routes/providerOrders.js'

export const app = express()
app.disable('x-powered-by')
// Railway terminates HTTPS one hop in front of the service. Trust only that hop
// so request.ip (and therefore the auth rate limiter) identifies the client.
app.set('trust proxy', 1)
app.use(helmet({ contentSecurityPolicy: false }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())
app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))
app.use('/api/auth', authRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/provider/orders', providerOrdersRouter)
app.use('/api', (_request, response) => response.status(404).json({ error: { code: 'NOT_FOUND' } }))

// Both development and the compiled server are started from the repository root.
// Keep Vite's repository-level dist directory stable even though shared modules
// make TypeScript emit the server below server-dist/server.
const root = path.resolve(process.cwd())
app.use(express.static(path.join(root, 'dist')))
app.use((_request, response) => response.sendFile(path.join(root, 'dist', 'index.html')))

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  void _next
  const reportedStatus = typeof error === 'object' && error !== null
    ? Number('status' in error ? error.status : 'statusCode' in error ? error.statusCode : 500)
    : 500
  const status = Number.isInteger(reportedStatus) && reportedStatus >= 400 && reportedStatus <= 599 ? reportedStatus : 500
  if (status >= 400 && status < 500) {
    const code = status === 413 ? 'PAYLOAD_TOO_LARGE' : 'VALIDATION_ERROR'
    response.status(status).json({ error: { code } })
    return
  }
  console.error('Request failed', error instanceof Error ? error.name : 'UnknownError')
  response.status(500).json({ error: { code: 'INTERNAL_ERROR' } })
}
app.use(errorHandler)
