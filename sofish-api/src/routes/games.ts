import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { HonoEnv } from '../types/env'
import { authenticate } from '../middleware/auth'

const games = new Hono<HonoEnv>()

const spinSchema = z.object({
  betAmount: z.number().min(1).max(10000),
  gameType: z.enum(['slots', 'fishing']),
  theme: z.string().optional()
})

// Generate slot result (dynamic reels)
function generateSlotResult(reels: number = 3): number[] {
  const result = []
  for (let i = 0; i < reels; i++) {
    result.push(Math.floor(Math.random() * 7) + 1)
  }
  return result
}

// Calculate win amount based on result
function calculateWin(betAmount: number, result: number[]): number {
  const counts: Record<number, number> = {}
  let maxCount = 0
  let maxNum = 0

  for (const num of result) {
    counts[num] = (counts[num] || 0) + 1
    if (counts[num] > maxCount) {
      maxCount = counts[num]
      maxNum = num
    }
  }

  // All match (Jackpot)
  if (maxCount === result.length) {
    if (maxNum === 7) {
      // 3->100, 4->1000, 5->10000, 6->100000
      return betAmount * Math.pow(10, result.length - 1)
    }
    // 3->10, 4->50, 5->250
    return betAmount * Math.pow(5, result.length - 2) * 2
  }

  // Majority match
  if (maxCount >= Math.ceil(result.length / 2)) {
    return betAmount * 2
  }

  return 0
}

// Slots game endpoint
games.post(
  '/slots/spin',
  authenticate,
  zValidator('json', spinSchema),
  async (c) => {
    const user = c.get('user')
    const { betAmount, theme } = c.req.valid('json')

    // Determine reels based on theme
    let reels = 3
    if (theme && ['pharaoh', 'sugar', 'forest', 'pirate', 'vampire', 'leprechaun', 'safari'].includes(theme)) reels = 5
    else if (theme && ['cyber', 'ninja', 'olympus', 'mafia'].includes(theme)) reels = 6
    else if (theme && ['wildwest', 'galactic', 'viking'].includes(theme)) reels = 4

    // Check user balance
    const userRecord = await c.env.DB
      .prepare('SELECT token_balance FROM users WHERE id = ?')
      .bind(user.id)
      .first<{ token_balance: number }>()

    if (!userRecord || userRecord.token_balance < betAmount) {
      return c.json({ error: 'Insufficient tokens' }, 400)
    }

    // Generate spin result
    const result = generateSlotResult(reels)
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
