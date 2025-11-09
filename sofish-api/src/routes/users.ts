import { Hono } from 'hono'
import type { HonoEnv } from '../types/env'
import { authenticate } from '../middleware/auth'

const users = new Hono<HonoEnv>()

// Get user profile
users.get('/profile', authenticate, async (c) => {
  const user = c.get('user')

  const userRecord = await c.env.DB
    .prepare('SELECT id, email, username, token_balance, created_at, last_login FROM users WHERE id = ?')
    .bind(user.id)
    .first()

  if (!userRecord) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json(userRecord)
})

// Get user balance
users.get('/balance', authenticate, async (c) => {
  const user = c.get('user')

  const userRecord = await c.env.DB
    .prepare('SELECT token_balance FROM users WHERE id = ?')
    .bind(user.id)
    .first<{ token_balance: number }>()

  if (!userRecord) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({ balance: userRecord.token_balance })
})

// Get game history
users.get('/history', authenticate, async (c) => {
  const user = c.get('user')
  const limit = c.req.query('limit') || '50'

  const history = await c.env.DB
    .prepare(`
      SELECT game_type, bet, win, result, created_at
      FROM game_history
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `)
    .bind(user.id, parseInt(limit))
    .all()

  return c.json(history.results)
})

export default users
