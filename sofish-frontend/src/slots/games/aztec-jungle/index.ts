/**
 * games/aztec-jungle/index.ts (SPEC §6, row 10)
 * ---------------------------------------------------------------------------
 * Aztec Jungle · 5×3 · 20 paylines · medium volatility · Temple Jackpot.
 *
 * Discovered automatically by slots/engine/registry.ts via import.meta.glob —
 * NO edits to shared files. 20 classic paylines (paylines[line][reel] = row).
 *
 * Bonus wiring: bonus.type 'jackpot' — 3+ Golden Idol scatters open the
 * Temple Jackpot overlay with fixed tiers (MINI ×20 / MAJOR ×100 /
 * GRAND ×500 of total bet, engine-weighted 70/25/5). awardSpins is
 * OMITTED: the jackpot is the feature, no free spins.
 *
 * Math notes (line games): pays are multipliers of TOTAL bet per winning
 * payline; the scatter pays anywhere on its own table. Tuned by Monte-Carlo
 * simulation of the engine math: ~95.4% RTP (label 95.4) — ~63% line/scatter
 * play + ~32% Temple Jackpot (0.5% trigger rate, EV 64× bet per trigger).
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { AZTEC_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'aztec-jungle',
  title: 'Aztec Jungle',
  tagline: 'Brave the jungle — golden idols guard the Temple Jackpot', // 57 chars
  rtp: 95.4,
  volatility: 'medium',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 3,
  paylines: 20,
  bonus: {
    type: 'jackpot',
    triggerScatters: 3,
    // NO awardSpins — jackpot games pay the feature, not free spins
    label: 'Temple Jackpot',
    description:
      'Land 3 or more Golden Idol scatters anywhere to open the Temple ' +
      'Jackpot. The temple wheels decide your tier: MINI ×20, MAJOR ×100 ' +
      'or GRAND ×500 your total bet.'
  },
  palette: {
    primary: '#0e5c3f', // emerald
    secondary: '#35c48d', // jade
    bg: '#0a2e22', // deep jungle
    accent: '#f2b134' // sun gold
  },
  iconEmoji: '🛕',
  released: '2026-08'
}

/* --------------------------------------------------------------- symbols */

/**
 * 10 symbols: wild + scatter + 4 high + 4 low.
 * `weight` = relative frequency per cell (reel-strip weighting).
 * `pays`   = { 3: x, 4: x, 5: x } multipliers of total bet per payline.
 */
const symbols: SymbolDef[] = [
  {
    id: 'wild',
    name: 'Sun God Mask',
    kind: 'wild',
    render: (size) => AZTEC_ART.wild({ size }),
    weight: 2,
    pays: { 3: 6, 4: 30, 5: 140 }
  },
  {
    id: 'scatter',
    name: 'Golden Idol',
    kind: 'scatter',
    render: (size) => AZTEC_ART.scatter({ size }),
    weight: 2.4,
    pays: { 3: 2, 4: 10, 5: 40 } // scatter pays ANYWHERE + triggers jackpot
  },
  {
    id: 'h1',
    name: 'Jaguar',
    kind: 'high',
    render: (size) => AZTEC_ART.h1({ size }),
    weight: 6,
    pays: { 3: 3.1, 4: 13, 5: 65 }
  },
  {
    id: 'h2',
    name: 'Temple Pyramid',
    kind: 'high',
    render: (size) => AZTEC_ART.h2({ size }),
    weight: 7,
    pays: { 3: 2.4, 4: 9.5, 5: 38 }
  },
  {
    id: 'h3',
    name: 'Emerald Serpent',
    kind: 'high',
    render: (size) => AZTEC_ART.h3({ size }),
    weight: 8,
    pays: { 3: 1.8, 4: 7, 5: 26 }
  },
  {
    id: 'h4',
    name: 'Quetzal',
    kind: 'high',
    render: (size) => AZTEC_ART.h4({ size }),
    weight: 9,
    pays: { 3: 1.3, 4: 5.3, 5: 19 }
  },
  {
    id: 'l1',
    name: 'Glyph A',
    kind: 'low',
    render: (size) => AZTEC_ART.l1({ size }),
    weight: 15,
    pays: { 3: 0.58, 4: 2.3, 5: 9.3 }
  },
  {
    id: 'l2',
    name: 'Glyph K',
    kind: 'low',
    render: (size) => AZTEC_ART.l2({ size }),
    weight: 16,
    pays: { 3: 0.48, 4: 1.95, 5: 7.5 }
  },
  {
    id: 'l3',
    name: 'Glyph Q',
    kind: 'low',
    render: (size) => AZTEC_ART.l3({ size }),
    weight: 17,
    pays: { 3: 0.48, 4: 1.65, 5: 6.4 }
  },
  {
    id: 'l4',
    name: 'Glyph J',
    kind: 'low',
    render: (size) => AZTEC_ART.l4({ size }),
    weight: 18,
    pays: { 3: 0.29, 4: 1.15, 5: 4.6 }
  }
]

/* -------------------------------------------------------------- paylines */

/**
 * 20 classic lines. paylines[line][reel] = row index (0 = top … 2 = bottom).
 */
const paylines: number[][] = [
  [1, 1, 1, 1, 1], // middle row
  [0, 0, 0, 0, 0], // top row
  [2, 2, 2, 2, 2], // bottom row
  [0, 1, 2, 1, 0], // V
  [2, 1, 0, 1, 2], // Λ
  [0, 0, 1, 0, 0],
  [2, 2, 1, 2, 2],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [1, 0, 1, 0, 1],
  [1, 2, 1, 2, 1],
  [0, 1, 0, 1, 0],
  [2, 1, 2, 1, 2],
  [0, 1, 1, 1, 0],
  [2, 1, 1, 1, 2],
  [1, 1, 0, 1, 1],
  [1, 1, 2, 1, 1],
  [0, 2, 0, 2, 0],
  [2, 0, 2, 0, 2],
  [0, 2, 2, 2, 0]
]

/* --------------------------------------------------------------- config */

const config: SlotModule['config'] = {
  meta,
  symbols,
  paylines,
  ambientColor: '#35c48d', // jade glow behind the machine
  musicMood: 'epic' // drums of the temple
}

const module_: SlotModule = { meta, config }
export default module_
