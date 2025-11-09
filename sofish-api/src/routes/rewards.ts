import { Hono } from 'hono'
import type { HonoEnv } from '../types/env'
import { authenticate } from '../middleware/auth'

const rewards = new Hono<HonoEnv>()

// Claim daily bonus
rewards.post('/daily-bonus', authenticate, async (c) => {
  const user = c.get('user')

  // Check if bonus already claimed today
  const lastBonus = await c.env.DB
    .prepare(`
      SELECT claimed_at, streak_days
      FROM daily_bonuses
      WHERE user_id = ?
      ORDER BY claimed_at DESC
      LIMIT 1
    `)
    .bind(user.id)
    .first<{ claimed_at: number; streak_days: number }>()

  const now = Date.now()
  const oneDayMs = 24 * 60 * 60 * 1000

  if (lastBonus && (now - lastBonus.claimed_at) < oneDayMs) {
    return c.json({ error: 'Daily bonus already claimed today' }, 400)
  }

  // Calculate streak
  let streakDays = 1
  if (lastBonus && (now - lastBonus.claimed_at) < (2 * oneDayMs)) {
    streakDays = lastBonus.streak_days + 1
  }

  // Bonus amount increases with streak (max 7 days)
  const bonusAmount = 100 + (Math.min(streakDays, 7) - 1) * 50

  // Update balance and record bonus
  await c.env.DB.batch([
    c.env.DB.prepare('UPDATE users SET token_balance = token_balance + ? WHERE id = ?')
      .bind(bonusAmount, user.id),
    c.env.DB.prepare('INSERT INTO daily_bonuses (user_id, bonus_amount, streak_days) VALUES (?, ?, ?)')
      .bind(user.id, bonusAmount, streakDays)
  ])

  return c.json({
    success: true,
    bonusAmount,
    streakDays
  })
})

// Reward user for watching ad
rewards.post('/ad-watched', authenticate, async (c) => {
  const user = c.get('user')
  const rewardAmount = 50  // 50 tokens per ad

  await c.env.DB.batch([
    // Credit tokens
    c.env.DB.prepare('UPDATE users SET token_balance = token_balance + ? WHERE id = ?')
      .bind(rewardAmount, user.id),

    // Track reward
    c.env.DB.prepare('INSERT INTO ad_rewards (user_id, reward_amount, ad_type) VALUES (?, ?, ?)')
      .bind(user.id, rewardAmount, 'video')
  ])

  return c.json({ success: true, rewardAmount })
})

export default rewards
