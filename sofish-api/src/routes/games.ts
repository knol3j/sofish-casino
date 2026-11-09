import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import type { HonoEnv } from '../types/env'
import { authenticate } from '../middleware/auth'

const games = new Hono<HonoEnv>()

const spinSchema = z.object({
  betAmount: z.number().min(1).max(10000),
  gameType: z.enum(['slots', 'fishing']),
  theme: z.string().optional(),
  // Optional idempotency protocol (new slot engine). Absent = legacy behavior.
  index: z.number().int().nonnegative().optional(),
  counter: z.number().int().nonnegative().optional(),
  repeat: z.boolean().optional()
})

const collectSchema = z.object({
  gameType: z.enum(['slots', 'fishing']).default('slots'),
  counter: z.number().int().nonnegative().optional()
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

function reelsForTheme(theme?: string): number {
  if (theme && ['pharaoh', 'sugar', 'forest', 'pirate', 'vampire', 'leprechaun', 'safari'].includes(theme)) return 5
  if (theme && ['cyber', 'ninja', 'olympus', 'mafia'].includes(theme)) return 6
  if (theme && ['wildwest', 'galactic', 'viking'].includes(theme)) return 4
  return 3
}

interface PendingRow { counter: number; amount: number }

/**
 * Credit every uncollected pending win for (user, gameType).
 * Called automatically at the start of each protocol-mode spin so a win is
 * never stranded, and from the /slots/collect endpoint.
 */
async function sweepPending(
  db: D1Database,
  userId: string,
  gameType: string
): Promise<{ amount: number; counters: number[] }> {
  const rows = await db
    .prepare('SELECT counter, amount FROM pending_wins WHERE user_id = ? AND game_type = ? AND collected = 0')
    .bind(userId, gameType)
    .all<PendingRow>()
  const pending = rows.results ?? []
  if (pending.length === 0) return { amount: 0, counters: [] }

  const total = pending.reduce((sum, r) => sum + r.amount, 0)
  const stmts = [
    db.prepare('UPDATE users SET token_balance = token_balance + ? WHERE id = ?').bind(total, userId),
    ...pending.map((r) =>
      db.prepare('UPDATE pending_wins SET collected = 1 WHERE user_id = ? AND game_type = ? AND counter = ?')
        .bind(userId, gameType, r.counter)
    )
  ]
  await db.batch(stmts)
  return { amount: total, counters: pending.map((r) => r.counter) }
}

// Slots game endpoint
games.post(
  '/slots/spin',
  authenticate,
  zValidator('json', spinSchema),
  async (c) => {
    const user = c.get('user')
    const { betAmount, theme, index, counter } = c.req.valid('json')
    const protocolMode = typeof counter === 'number'

    // --- Idempotent replay: same counter, same stored outcome, no charge ---
    if (protocolMode) {
      const existing = await c.env.DB
        .prepare('SELECT response_json FROM spin_idempotency WHERE user_id = ? AND game_type = ? AND counter = ?')
        .bind(user.id, 'slots', counter)
        .first<{ response_json: string }>()
      if (existing) {
        const replay = JSON.parse(existing.response_json) as Record<string, unknown>
        return c.json({ ...replay, repeat: true })
      }

      // Auto-sweep any stranded pending wins before a fresh spin
      await sweepPending(c.env.DB, user.id, 'slots')
    }

    const reels = reelsForTheme(theme)

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

    if (protocolMode) {
      // Two-phase: debit the bet now; the win waits in pending_wins for
      // /slots/collect (or the auto-sweep on the next spin).
      const balanceAfterBet = userRecord.token_balance - betAmount
      const responseBody: Record<string, unknown> = {
        result,
        winAmount,
        newBalance: balanceAfterBet, // balance after debit; collect credits the win
        isWin: winAmount > 0,
        counter,
        index: index ?? null,
        repeat: false,
        pendingCollect: winAmount > 0
      }

      const stmts = [
        c.env.DB.prepare('UPDATE users SET token_balance = ? WHERE id = ?')
          .bind(balanceAfterBet, user.id),
        c.env.DB.prepare(
          'INSERT INTO game_history (user_id, game_type, bet, win, result, theme) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(user.id, 'slots', betAmount, winAmount, JSON.stringify(result), theme ?? null),
        c.env.DB.prepare(
          'INSERT INTO spin_idempotency (user_id, game_type, counter, response_json) VALUES (?, ?, ?, ?)'
        ).bind(user.id, 'slots', counter, JSON.stringify(responseBody))
      ]
      if (winAmount > 0) {
        stmts.push(
          c.env.DB.prepare(
            'INSERT INTO pending_wins (user_id, game_type, counter, amount) VALUES (?, ?, ?, ?)'
          ).bind(user.id, 'slots', counter, winAmount)
        )
      }
      await c.env.DB.batch(stmts)
      return c.json(responseBody)
    }

    // --- Legacy mode: unchanged single-phase behavior ---
    const newBalance = userRecord.token_balance - betAmount + winAmount

    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE users SET token_balance = ? WHERE id = ?')
        .bind(newBalance, user.id),
      c.env.DB.prepare(
        'INSERT INTO game_history (user_id, game_type, bet, win, result, theme) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(user.id, 'slots', betAmount, winAmount, JSON.stringify(result), theme ?? null)
    ])

    return c.json({
      result,
      winAmount,
      newBalance,
      isWin: winAmount > betAmount
    })
  }
)

// Collect pending wins (two-phase commit companion to protocol-mode spins)
games.post(
  '/slots/collect',
  authenticate,
  zValidator('json', collectSchema),
  async (c) => {
    const user = c.get('user')
    const { gameType } = c.req.valid('json')

    const { amount, counters } = await sweepPending(c.env.DB, user.id, gameType)

    const userRecord = await c.env.DB
      .prepare('SELECT token_balance FROM users WHERE id = ?')
      .bind(user.id)
      .first<{ token_balance: number }>()

    return c.json({
      collected: counters.length,
      amount,
      newBalance: userRecord?.token_balance ?? 0
    })
  }
)

// Live presence — SSE stream of per-game active players (last 5 minutes).
// Public endpoint: no auth, no personal data (counts only).
games.get('/presence/sse', async (c) => {
  const { readable, writable } = new TransformStream()
  const writer = writable.getWriter()
  const encoder = new TextEncoder()

  const sendSnapshot = async () => {
    const rows = await c.env.DB
      .prepare(
        `SELECT COALESCE(theme, 'classic') AS game, COUNT(DISTINCT user_id) AS players
         FROM game_history
         WHERE created_at > unixepoch() - 300
         GROUP BY COALESCE(theme, 'classic')`
      )
      .all<{ game: string; players: number }>()
    const byGame: Record<string, number> = {}
    let online = 0
    for (const r of rows.results ?? []) {
      byGame[r.game] = r.players
      online += r.players
    }
    const payload = JSON.stringify({ byGame, online, ts: Date.now() })
    await writer.write(encoder.encode(`data: ${payload}\n\n`))
  }

  // ~3 minutes per stream (36 ticks x 5s); EventSource reconnects after close.
  const pump = (async () => {
    try {
      for (let tick = 0; tick < 36; tick++) {
        await sendSnapshot()
        await new Promise((resolve) => setTimeout(resolve, 5000))
      }
    } catch {
      // client disconnected mid-stream
    } finally {
      try { await writer.close() } catch { /* already closed */ }
    }
  })()
  c.executionCtx.waitUntil(pump)

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': c.req.header('Origin') ?? '*'
    }
  })
})

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
