/**
 * slots/engine/adapters.ts
 * ---------------------------------------------------------------------------
 * Spin adapters. SlotMachine never talks to the network or localStorage
 * directly — it goes through a SpinAdapter.
 *
 * - ServerSpinAdapter: authenticated play. POSTs the existing
 *   /games/slots/spin endpoint; the server's winAmount is
 *   balance-authoritative and reconciled into the presented outcome.
 *   Sends monotonic index/counter sequence numbers (idempotency) and
 *   two-phase-collects wins via /games/slots/collect.
 * - LocalSpinAdapter: logged-out demo play. Full client-side simulation via
 *   rng.ts + math.ts with a demo balance persisted to localStorage
 *   'sofish_demo_balance' (starts at 10,000).
 *
 * createSpinAdapter() picks Server when an auth_token exists, else Local.
 */

import type { SlotConfig, SpinOutcome } from './types'
import { symbolMap } from './types'
import { createRng, weightedPick } from './rng'
import type { Rng } from './rng'
import { countScatters, evaluateGrid, expandWilds } from './math'

const API_URL = import.meta.env.VITE_API_URL || '/api'
const DEMO_BALANCE_KEY = 'sofish_demo_balance'
const DEMO_START_BALANCE = 10000

export interface SpinRequest {
  bet: number
  /**
   * 'reel,row' → symbol id forced into the grid after generation, before
   * evaluation. Powers sticky wilds (cells → wild id) and held scatters
   * (respin feature).
   */
  overrides?: Record<string, string>
  /** True when this spin consumes a free spin (no stake deducted locally). */
  freeSpin?: boolean
}

export interface SpinResult {
  outcome: SpinOutcome
  balance: number
}

export interface SpinAdapter {
  readonly mode: 'server' | 'local'
  getBalance(): Promise<number>
  spin(req: SpinRequest): Promise<SpinResult>
  /**
   * Credit extra client-side feature wins (cascade chains, pick-me,
   * gamble, jackpot). May be negative (gamble loss). Server adapter is a
   * no-op: the server stays balance-authoritative and those wins are
   * presentation-only.
   */
  credit(amount: number): Promise<number>
}

// ------------------------------------------------------------ local sim lib

/** Generate a random grid [reel][row] from symbol weights. */
export function generateGrid(
  config: SlotConfig,
  rng: Rng,
  overrides?: Record<string, string>
): string[][] {
  const { reels, rows } = config.meta
  const grid: string[][] = []
  for (let r = 0; r < reels; r++) {
    const reel: string[] = []
    for (let row = 0; row < rows; row++) {
      reel.push(weightedPick(config.symbols, (s) => s.weight, rng).id)
    }
    grid.push(reel)
  }
  // Forced cells (sticky wilds / held scatters) applied before evaluation.
  if (overrides) {
    for (const [key, id] of Object.entries(overrides)) {
      const [r, row] = key.split(',').map(Number)
      if (grid[r] && grid[r][row] !== undefined) grid[r][row] = id
    }
  }
  // Expanding-wilds games expand before evaluation (math + visuals agree).
  if (config.meta.bonus.type === 'expanding-wilds') return expandWilds(grid, config)
  return grid
}

/** Scatter-count based feature trigger shared by both adapters. */
function buildOutcome(config: SlotConfig, grid: string[][], bet: number): SpinOutcome {
  const symbols = symbolMap(config)
  const { totalWin, winLines } = evaluateGrid(grid, config, bet)
  const trigger = config.meta.bonus.triggerScatters ?? 3
  const scatters = countScatters(grid, symbols)
  const bonusTriggered = scatters >= trigger
  const awardSpins = config.meta.bonus.awardSpins ?? 0
  return {
    grid,
    totalWin,
    winLines,
    bonusTriggered,
    freeSpinsAwarded: bonusTriggered && awardSpins > 0 ? awardSpins : undefined
  }
}

// ------------------------------------------------------------ local adapter

export class LocalSpinAdapter implements SpinAdapter {
  readonly mode = 'local' as const
  private rng: Rng

  constructor(private config: SlotConfig) {
    this.rng = createRng()
  }

  private readBalance(): number {
    try {
      const raw = localStorage.getItem(DEMO_BALANCE_KEY)
      const n = raw === null ? NaN : Number(raw)
      if (Number.isFinite(n) && n >= 0) return n
    } catch {
      /* private mode */
    }
    return DEMO_START_BALANCE
  }

  private writeBalance(n: number): number {
    const v = Math.max(0, Math.round(n * 100) / 100)
    try {
      localStorage.setItem(DEMO_BALANCE_KEY, String(v))
    } catch {
      /* private mode */
    }
    return v
  }

  getBalance(): Promise<number> {
    return Promise.resolve(this.readBalance())
  }

  spin(req: SpinRequest): Promise<SpinResult> {
    let balance = this.readBalance()
    if (!req.freeSpin) {
      if (balance < req.bet) throw new Error('Insufficient demo balance')
      balance = this.writeBalance(balance - req.bet)
    }
    const grid = generateGrid(this.config, this.rng, req.overrides)
    const outcome = buildOutcome(this.config, grid, req.bet)
    balance = this.writeBalance(balance + outcome.totalWin)
    return Promise.resolve({ outcome, balance })
  }

  credit(amount: number): Promise<number> {
    return Promise.resolve(this.writeBalance(this.readBalance() + amount))
  }
}

// ----------------------------------------------------------- server adapter

interface ServerSpinResponse {
  winAmount?: number
  win?: number
  payout?: number
  balance?: number
  newBalance?: number
  /** Idempotency protocol fields (present when the request carried them). */
  counter?: number
  repeat?: boolean
  pendingCollect?: boolean
}

interface CollectResponse {
  collected?: number
  amount?: number
  newBalance?: number
}

export class ServerSpinAdapter implements SpinAdapter {
  readonly mode = 'server' as const
  private rng: Rng
  private lastBalance = 0
  private seqKey: string
  private seq: { index: number; counter: number }

  constructor(private config: SlotConfig) {
    this.rng = createRng()
    this.seqKey = `sofish_spin_seq_${config.meta.id}`
    this.seq = this.readSeq()
  }

  /** Monotonic per-game session counters (anti-replay / idempotency). */
  private readSeq(): { index: number; counter: number } {
    try {
      const raw = localStorage.getItem(this.seqKey)
      if (raw) {
        const parsed = JSON.parse(raw) as { index?: number; counter?: number }
        if (typeof parsed.index === 'number' && typeof parsed.counter === 'number') {
          return { index: parsed.index, counter: parsed.counter }
        }
      }
    } catch {
      /* private mode / corrupt entry */
    }
    return { index: 0, counter: 0 }
  }

  private nextSeq(): { index: number; counter: number } {
    this.seq = { index: this.seq.index + 1, counter: this.seq.counter + 1 }
    try {
      localStorage.setItem(this.seqKey, JSON.stringify(this.seq))
    } catch {
      /* private mode */
    }
    return this.seq
  }

  private token(): string {
    const t = localStorage.getItem('auth_token')
    if (!t) throw new Error('Not authenticated')
    return t
  }

  async getBalance(): Promise<number> {
    const res = await fetch(`${API_URL}/users/balance`, {
      headers: { Authorization: `Bearer ${this.token()}` }
    })
    if (!res.ok) throw new Error('Failed to fetch balance')
    const data = (await res.json()) as { balance?: number }
    this.lastBalance = data.balance ?? 0
    return this.lastBalance
  }

  async spin(req: SpinRequest): Promise<SpinResult> {
    const seq = this.nextSeq()
    const res = await fetch(`${API_URL}/games/slots/spin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        betAmount: req.bet,
        gameType: 'slots',
        theme: this.config.meta.id,
        index: seq.index,
        counter: seq.counter,
        repeat: false
      })
    })
    if (!res.ok) {
      let msg = 'Spin failed'
      try {
        const err = (await res.json()) as { error?: string }
        if (err.error) msg = err.error
      } catch {
        /* keep default message */
      }
      throw new Error(msg)
    }
    const data = (await res.json()) as ServerSpinResponse
    const serverWin = data.winAmount ?? data.win ?? data.payout ?? 0

    // Presentation grid: simulated locally with the same math; the MONEY
    // comes from the server (balance-authoritative reconciliation).
    const grid = generateGrid(this.config, this.rng, req.overrides)
    const presented = buildOutcome(this.config, grid, req.bet)
    const outcome: SpinOutcome = {
      ...presented,
      totalWin: serverWin
    }
    this.lastBalance =
      data.balance ?? data.newBalance ?? this.lastBalance - (req.freeSpin ? 0 : req.bet) + serverWin

    // Two-phase commit: credit any pending win (this spin's plus anything
    // stranded). Failure is safe — the server auto-sweeps on the next spin.
    if (serverWin > 0 || data.pendingCollect) {
      await this.collect()
    }
    return { outcome, balance: this.lastBalance }
  }

  /** POST /games/slots/collect — credits pending wins, refreshes balance. */
  private async collect(): Promise<void> {
    try {
      const res = await fetch(`${API_URL}/games/slots/collect`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ gameType: 'slots' })
      })
      if (res.ok) {
        const data = (await res.json()) as CollectResponse
        if (typeof data.newBalance === 'number') this.lastBalance = data.newBalance
      }
    } catch {
      /* swept server-side on next spin */
    }
  }

  credit(): Promise<number> {
    return Promise.resolve(this.lastBalance)
  }
}

/** Server when an auth token exists, Local demo otherwise. */
export function createSpinAdapter(config: SlotConfig): SpinAdapter {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('auth_token') : null
  return token ? new ServerSpinAdapter(config) : new LocalSpinAdapter(config)
}
