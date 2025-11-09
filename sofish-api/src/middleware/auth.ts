import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import jwt from '@tsndr/cloudflare-worker-jwt'
import type { HonoEnv } from '../types/env'

export const authenticate = createMiddleware<HonoEnv>(async (c, next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Missing authorization' })
  }

  const token = authHeader.substring(7)
  const verified = await jwt.verify(token, c.env.JWT_SECRET)

  if (!verified) {
    throw new HTTPException(401, { message: 'Invalid token' })
  }

  // Decode the token to get the payload
  const decoded = jwt.decode(token)

  c.set('user', {
    id: decoded.payload.sub,
    email: decoded.payload.email,
    tokenBalance: decoded.payload.balance
  })

  await next()
})
