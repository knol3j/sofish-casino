/**
 * slots/engine/math.ts
 * ---------------------------------------------------------------------------
 * Pure slot mathematics: payline evaluation, 243-ways evaluation, scatter
 * pays, expanding wilds, cascade helpers and the winTier() contract.
 * No React, no side effects — easy to unit-test and reuse.
 */

import type { SlotConfig, SymbolDef, WinLineHit, WinTier } from './types'
import { symbolMap } from './types'

export interface EvalResult {
  totalWin: number
  winLines: WinLineHit[]
}

/**
 * Ways-mode wins are scaled down because a single spin can award many
 * simultaneous way-wins. Pays stay "multipliers of total bet" per the
 * contract; the divisor converts them to a per-way stake (like a 10-credit
 * coin size in classic 243-ways games).
 */
export const WAYS_BET_DIVISOR = 10

/** Multiplier trail used by 'multiplier-trail' and cascade chains. */
export const MULTIPLIER_TRAIL = [1, 2, 3, 5, 8, 12] as const

export function trailMultiplier(step: number): number {
  const i = Math.min(Math.max(0, step), MULTIPLIER_TRAIL.length - 1)
  return MULTIPLIER_TRAIL[i]
}

/** SPEC §2: win>=25x 'epic', >=10x 'mega', >=5x 'big', >0 'normal'. */
export function winTier(win: number, bet: number): WinTier {
  if (bet <= 0 || win <= 0) return 'none'
  const x = win / bet
  if (x >= 25) return 'epic'
  if (x >= 10) return 'mega'
  if (x >= 5) return 'big'
  return 'normal'
}

/** Count scatter-kind symbols anywhere on the grid. */
export function countScatters(grid: string[][], symbols: Map<string, SymbolDef>): number {
  let n = 0
  for (const reel of grid)
    for (const id of reel) if (symbols.get(id)?.kind === 'scatter') n++
  return n
}

/** Per-reel scatter presence — drives the anticipation slow-spin. */
export function scattersPerReel(grid: string[][], symbols: Map<string, SymbolDef>): boolean[] {
  return grid.map((reel) => reel.some((id) => symbols.get(id)?.kind === 'scatter'))
}

/** Count bonus-kind symbols anywhere on the grid. */
export function countBonusSymbols(grid: string[][], symbols: Map<string, SymbolDef>): number {
  let n = 0
  for (const reel of grid)
    for (const id of reel) if (symbols.get(id)?.kind === 'bonus') n++
  return n
}

/**
 * Evaluate one payline from one direction. Returns the paying symbol id,
 * the match length and the win amount (0 when the line does not pay).
 */
function evalLineDirection(
  grid: string[][],
  line: number[],
  symbols: Map<string, SymbolDef>,
  bet: number,
  fromRight: boolean
): { symbol: string; count: number; amount: number } {
  const reels = grid.length
  const order = fromRight
    ? Array.from({ length: reels }, (_, i) => reels - 1 - i)
    : Array.from({ length: reels }, (_, i) => i)

  let target: SymbolDef | null = null
  let wildRun = 0 // leading wilds before the first natural symbol
  let count = 0

  for (const r of order) {
    const def = symbols.get(grid[r][line[r]])
    if (!def || def.kind === 'scatter' || def.kind === 'bonus') break
    if (def.kind === 'wild') {
      if (target === null) wildRun++
      count++
      continue
    }
    if (target === null) target = def
    else if (def.id !== target.id) break
    count++
  }

  const wild = [...symbols.values()].find((s) => s.kind === 'wild')
  const naturalPay = target?.pays?.[count] ?? 0
  // A pure leading-wild run can pay on the wild's own (usually richer) table.
  const wildPay = wild?.pays?.[count] ?? 0
  const useWild = wild !== undefined && wildRun >= Math.min(3, count) && wildPay > naturalPay
  const amount = (useWild ? wildPay : naturalPay) * bet
  const symbol = useWild ? wild.id : target?.id ?? wild?.id ?? ''
  return { symbol, count, amount }
}

/**
 * Classic payline evaluation. `grid[reel][row]`, `paylines[line][reel]=row`.
 * Scatter pays anywhere (its own pays table). Set `bothWays` to also pay
 * right-to-left (fruit-frenzy style).
 */
export function evaluatePaylines(
  grid: string[][],
  config: SlotConfig,
  bet: number,
  opts?: { bothWays?: boolean }
): EvalResult {
  const symbols = symbolMap(config)
  const lines = config.paylines ?? []
  const winLines: WinLineHit[] = []
  let totalWin = 0

  lines.forEach((line, lineIndex) => {
    const left = evalLineDirection(grid, line, symbols, bet, false)
    if (left.amount > 0) {
      winLines.push({ line: lineIndex, symbol: left.symbol, count: left.count, amount: left.amount })
      totalWin += left.amount
    }
    if (opts?.bothWays) {
      const right = evalLineDirection(grid, line, symbols, bet, true)
      if (right.amount > 0) {
        winLines.push({ line: lineIndex, symbol: right.symbol, count: right.count, amount: right.amount })
        totalWin += right.amount
      }
    }
  })

  totalWin += appendScatterWins(grid, config, bet, winLines)
  return { totalWin, winLines }
}

/**
 * 243-ways evaluation: left-to-right adjacent reels, position-free,
 * wild substitutes; scatter pays anywhere on its own table.
 */
export function evaluateWays(grid: string[][], config: SlotConfig, bet: number): EvalResult {
  const symbols = symbolMap(config)
  const winLines: WinLineHit[] = []
  let totalWin = 0
  const coinBet = bet / WAYS_BET_DIVISOR

  for (const def of config.symbols) {
    if (def.kind === 'scatter' || def.kind === 'bonus' || !def.pays) continue
    let matchedReels = 0
    let ways = 1
    for (const reel of grid) {
      const n = reel.filter((id) => {
        const cell = symbols.get(id)
        if (!cell) return false
        return def.kind === 'wild' ? cell.kind === 'wild' : cell.id === def.id || cell.kind === 'wild'
      }).length
      if (n === 0) break
      matchedReels++
      ways *= n
    }
    const pay = def.pays[matchedReels] ?? 0
    if (matchedReels >= 3 && pay > 0) {
      const amount = pay * coinBet * ways
      winLines.push({ line: -1, symbol: def.id, count: matchedReels, amount })
      totalWin += amount
    }
  }

  totalWin += appendScatterWins(grid, config, bet, winLines)
  return { totalWin, winLines }
}

/** Scatter pays anywhere; appends a synthetic winLine (line: -1). */
function appendScatterWins(
  grid: string[][],
  config: SlotConfig,
  bet: number,
  winLines: WinLineHit[]
): number {
  const symbols = symbolMap(config)
  const scatter = config.symbols.find((s) => s.kind === 'scatter')
  if (!scatter?.pays) return 0
  const n = countScatters(grid, symbols)
  const pay = scatter.pays[Math.min(n, 5)] ?? 0
  if (pay <= 0) return 0
  const amount = pay * bet
  winLines.push({ line: -1, symbol: scatter.id, count: n, amount })
  return amount
}

/** Dispatch to the correct evaluator for the config. */
export function evaluateGrid(
  grid: string[][],
  config: SlotConfig,
  bet: number,
  opts?: { bothWays?: boolean }
): EvalResult {
  const bothWays = opts?.bothWays ?? config.meta.bonus.type === 'both-ways'
  if (config.meta.paylines === 0) return evaluateWays(grid, config, bet)
  return evaluatePaylines(grid, config, bet, { bothWays })
}

/**
 * Expanding wilds: any reel containing at least one wild becomes all wild.
 * Returns a NEW grid (does not mutate).
 */
export function expandWilds(grid: string[][], config: SlotConfig): string[][] {
  const symbols = symbolMap(config)
  const wild = config.symbols.find((s) => s.kind === 'wild')
  if (!wild) return grid.map((r) => [...r])
  return grid.map((reel) =>
    reel.some((id) => symbols.get(id)?.kind === 'wild') ? reel.map(() => wild.id) : [...reel]
  )
}

/**
 * Cells involved in the given wins — used by the cascade mechanic to know
 * which symbols to pop. Keys are 'reel,row'. Scatters never cascade.
 */
export function collectWinCells(
  grid: string[][],
  config: SlotConfig,
  winLines: WinLineHit[]
): Set<string> {
  const symbols = symbolMap(config)
  const cells = new Set<string>()
  const lines = config.paylines ?? []
  const scatterId = config.symbols.find((s) => s.kind === 'scatter')?.id

  const matches = (id: string, symbolId: string): boolean => {
    const def = symbols.get(id)
    if (!def || def.kind === 'scatter' || def.kind === 'bonus') return false
    return def.id === symbolId || def.kind === 'wild'
  }

  for (const hit of winLines) {
    if (hit.line >= 0 && lines[hit.line]) {
      const line = lines[hit.line]
      // Mark the matching prefix from whichever side produced the hit.
      for (const fromRight of [false, true]) {
        let marked = 0
        const order = fromRight
          ? Array.from({ length: grid.length }, (_, i) => grid.length - 1 - i)
          : Array.from({ length: grid.length }, (_, i) => i)
        for (const r of order) {
          if (marked >= hit.count) break
          if (!matches(grid[r][line[r]], hit.symbol)) break
          cells.add(`${r},${line[r]}`)
          marked++
        }
      }
    } else if (hit.symbol !== scatterId) {
      // Ways hit: mark matching cells on the leftmost consecutive reels.
      for (let r = 0; r < grid.length && r < hit.count; r++) {
        let reelHas = false
        grid[r].forEach((id, row) => {
          if (matches(id, hit.symbol)) {
            cells.add(`${r},${row}`)
            reelHas = true
          }
        })
        if (!reelHas) break
      }
    }
  }
  return cells
}

/**
 * Collapse a grid after a cascade pop: remove `cells`, let symbols above
 * fall down, and pad the TOP of each reel with ids from `fill()`.
 */
export function collapseGrid(
  grid: string[][],
  cells: Set<string>,
  fill: (reelIdx: number, needed: number) => string[]
): string[][] {
  return grid.map((reel, r) => {
    const survivors = reel.filter((_, row) => !cells.has(`${r},${row}`))
    const needed = reel.length - survivors.length
    return [...fill(r, needed), ...survivors]
  })
}
