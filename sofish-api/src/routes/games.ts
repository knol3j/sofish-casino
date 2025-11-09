import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { HonoEnv } from '../types/env'
import { authenticate } from '../middleware/auth'

const games = new Hono<HonoEnv>()

const spinSchema = z.object({
  betAmount: z.number().min(1).max(1000),
  gameType: z.enum(['slots', 'fishing'])
})

// Generate slot result (simple implementation)
function generateSlotResult(): number[] {
  return [
    Math.floor(Math.random() * 7) + 1,
    Math.floor(Math.random() * 7) + 1,
    Math.floor(Math.random() * 7) + 1
  ]
}

// Calculate win amount based on result
function calculateWin(betAmount: number, result: number[]): number {
  // Three of a kind
  if (result[0] === result[1] && result[1] === result[2]) {
    if (result[0] === 7) {
      return betAmount * 100  // Jackpot!
    }
    return betAmount * 10
  }

  // Two of a kind
  if (result[0] === result[1] || result[1] === result[2] || result[0] === result[2]) {
    return betAmount * 2
  }

  // No win
  return 0
}

// Slots game endpoint
games.post(
  '/slots/spin',
  authenticate,
  zValidator('json', spinSchema),
  async (c) => {
    const user = c.get('user')
    const { betAmount } = c.req.valid('json')

    // Check user balance
    const userRecord = await c.env.DB
      .prepare('SELECT token_balance FROM users WHERE id = ?')
      .bind(user.id)
      .first<{ token_balance: number }>()

    if (!userRecord || userRecord.token_balance < betAmount) {
      return c.json({ error: 'Insufficient tokens' }, 400)
    }

    // Generate spin result
    const result = generateSlotResult()
    const winAmount = calculateWin(betAmount, result)
    const newBalance = userRecord.token_balance - betAmount + winAmount

    // Update balance in transaction
    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE users SET token_balance = ? WHERE id = ?')
        .bind(newBalance, user.id),
      c.env.DB.prepare(
        'INSERT INTO game_history (user_id, game_type, bet, win, result) VALUES (?, ?, ?, ?, ?)'
      ).bind(user.id, 'slots', betAmount, winAmount, JSON.stringify(result))
    ])

    return c.json({
      result,
      winAmount,
      newBalance,
      isWin: winAmount > betAmount
    })
  }
)

// Leaderboard endpoint with caching
games.get('/leaderboard/:period', async (c) => {
  const period = c.req.param('period')
  const cacheKey = `leaderboard:${period}`

  // Try cache first
  const cached = await c.env.CACHE.get(cacheKey, 'json')
  if (cached) {
    return c.json(cached, 200, { 'X-Cache': 'HIT' })
  }

  // Query leaderboard
  const timeFilter = period === 'daily'
    ? "WHERE created_at > datetime('now', '-1 day')"
    : period === 'weekly'
    ? "WHERE created_at > datetime('now', '-7 days')"
    : ''

  const leaderboard = await c.env.DB
    .prepare(`
      SELECT u.id, u.username, SUM(gh.win) as total_wins
      FROM users u
      JOIN game_history gh ON u.id = gh.user_id
      ${timeFilter}
      GROUP BY u.id
      ORDER BY total_wins DESC
      LIMIT 100
    `)
    .all()

  // Cache for 5 minutes
  await c.env.CACHE.put(cacheKey, JSON.stringify(leaderboard.results), {
    expirationTtl: 300
  })

  return c.json(leaderboard.results, 200, { 'X-Cache': 'MISS' })
})

export default games
