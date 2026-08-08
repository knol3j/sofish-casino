import type { ReactNode } from 'react'

/**
 * slots/engine/types.ts
 * ---------------------------------------------------------------------------
 * THE CONTRACT. Every slot game and every engine module codes against these
 * exact types (SPEC §2). Do not change field names or semantics.
 */

export interface SymbolDef {
  id: string // 'wild','scatter', 'h1'..'h5','l1'..'l5' etc
  name: string
  kind: 'wild' | 'scatter' | 'bonus' | 'high' | 'low'
  render: (size: number) => ReactNode // inline SVG, theme-colored
  weight: number // reel-strip weighting
  pays?: { [count: number]: number } // 3/4/5-of-a-kind multipliers of total bet (wild & highs & lows)
}

export interface BonusConfig {
  type:
    | 'freespins'
    | 'cascade'
    | 'expanding-wilds'
    | 'pick-me'
    | 'multiplier-trail'
    | 'sticky-wilds'
    | 'respin'
    | 'both-ways'
    | 'gamble'
    | 'jackpot'
  triggerScatters?: number // default 3
  awardSpins?: number // freespins amount
  label: string // UI copy, e.g. 'Kraken Free Spins'
  description: string
}

export interface GameMeta {
  id: string // kebab-case, matches folder name — UNIQUE
  title: string
  tagline: string // <= 60 chars, lobby card copy
  rtp: number // display value 94–97
  volatility: 'low' | 'medium' | 'high'
  minBet: number
  maxBet: number
  reels: number // 5 (standard) or 3 (classic only)
  rows: number // 3 (or 4)
  paylines: number // 0 => 243-ways evaluation
  bonus: BonusConfig
  palette: { primary: string; secondary: string; bg: string; accent: string }
  iconEmoji: string // lobby card fallback icon
  released: string // '2026-08'
}

export interface WinLineHit {
  line: number // payline index, or -1 for scatter/ways aggregate hits
  symbol: string
  count: number
  amount: number
}

export interface SpinOutcome {
  grid: string[][] // [reel][row] symbol ids, sized reels x rows
  totalWin: number // currency units won this spin (0 = loss)
  winLines: WinLineHit[]
  bonusTriggered: boolean
  freeSpinsAwarded?: number
}

export interface SlotConfig {
  meta: GameMeta
  symbols: SymbolDef[] // 8–12 symbols incl. wild + scatter (+ bonus symbol where relevant)
  // [line][reel] = row index — e.g. 20 lines × 5 reels. Omit when paylines===0 (243 ways).
  paylines?: number[][]
  ambientColor: string // css color for machine backdrop glow
  musicMood: 'chill' | 'epic' | 'playful' | 'dark' // drives WebAudio ambient loop
}

export interface SlotModule {
  meta: GameMeta
  config: SlotConfig
}

/** Celebration tier derived from win size (SPEC §2). */
export type WinTier = 'none' | 'normal' | 'big' | 'mega' | 'epic'

/** Symbol lookup helper shared by engine modules. */
export function symbolMap(config: SlotConfig): Map<string, SymbolDef> {
  return new Map(config.symbols.map((s) => [s.id, s]))
}
