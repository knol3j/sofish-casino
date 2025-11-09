import jwt from '@tsndr/cloudflare-worker-jwt'
import { Hono } from 'hono'
import type { HonoEnv } from '../types/env'

const auth = new Hono<HonoEnv>()

// Password hashing with Web Crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const salt = crypto.getRandomValues(new Uint8Array(16))

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const key = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 310000,  // OWASP 2024 recommendation
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  )

  const hashArray = Array.from(new Uint8Array(key))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('')

  return `${saltHex}:${hashHex}`
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [saltHex, storedHashHex] = hash.split(':')
  const salt = new Uint8Array(saltHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)))

  const encoder = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const key = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: 310000, hash: 'SHA-256' },
    keyMaterial,
    256
  )

  const hashArray = Array.from(new Uint8Array(key))
  const computedHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

  return computedHashHex === storedHashHex
}

// Registration
auth.post('/register', async (c) => {
  const { email, username, password } = await c.req.json()

  // Hash password with PBKDF2 (310,000 iterations per OWASP 2024)
  const passwordHash = await hashPassword(password)
  const userId = crypto.randomUUID()

  await c.env.DB.prepare(
    'INSERT INTO users (id, email, username, password_hash, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(userId, email, username, passwordHash, Date.now()).run()

  // Generate JWT
  const token = await jwt.sign({
    sub: userId,
    email,
    username,
    exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60)  // 2 hours
  }, c.env.JWT_SECRET)

  return c.json({ token, userId })
})

// Login
auth.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  const user = await c.env.DB.prepare(
    'SELECT id, email, username, password_hash FROM users WHERE email = ?'
  ).bind(email).first()

  if (!user || !(await verifyPassword(password, user.password_hash as string))) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const token = await jwt.sign({
    sub: user.id,
    email: user.email,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60)
  }, c.env.JWT_SECRET)

  return c.json({ token })
})

// Token refresh
auth.post('/refresh', async (c) => {
  const { refreshToken } = await c.req.json()

  const verified = await jwt.verify(refreshToken, c.env.JWT_SECRET)
  if (!verified) {
    return c.json({ error: 'Invalid refresh token' }, 401)
  }

  // Issue new access token
  const newToken = await jwt.sign({
    sub: verified.payload.sub,
    email: verified.payload.email,
    exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60)
  }, c.env.JWT_SECRET)

  return c.json({ token: newToken })
})

export default auth
