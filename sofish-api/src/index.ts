import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { compress } from 'hono/compress'
import { secureHeaders } from 'hono/secure-headers'
import type { HonoEnv } from './types/env'
import { errorHandler } from './middleware/errorHandler'
import auth from './routes/auth'
import games from './routes/games'
import users from './routes/users'
import rewards from './routes/rewards'

const app = new Hono<HonoEnv>()

// Global security and performance middleware
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://pagead2.googlesyndication.com'],
    frameSrc: ["'self'", 'https://googleads.g.doubleclick.net'],
    imgSrc: ["'self'", 'data:', 'https:']
  }
}))

// Disable compression for API routes (causes issues with local dev)
// app.use('*', compress())
app.use('*', cors({
  origin: [
    'https://sofish.io',
    'https://www.sofish.io',
    'https://sofish.pages.dev',
    'http://localhost:3000'
  ],
  credentials: true,
  maxAge: 86400
}))

// Mount routes
app.route('/api/auth', auth)
app.route('/api/games', games)
app.route('/api/users', users)
app.route('/api/rewards', rewards)

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: Date.now() }))

// Error handling
app.onError(errorHandler)

export default app
