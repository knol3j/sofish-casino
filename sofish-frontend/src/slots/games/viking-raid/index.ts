/**
 * games/viking-raid/index.ts — Viking Raid (SPEC §6, row 9)
 * ---------------------------------------------------------------------------
 * Viking Raid · 5×4 · 40 paylines · high volatility · Raid Free Spins with a
 * multiplier trail (each free spin climbs the trail 1× → 2× → 3× → 5× → 8×
 * → 12×; consecutive base-game wins also climb it).
 *
 * Discovered automatically by slots/engine/registry.ts via import.meta.glob.
 *
 * Math notes (LocalSpinAdapter, verified by full-session simulation):
 *   - pays are multipliers of TOTAL bet, applied per winning payline
 *   - the multiplier trail multiplies free-spin wins up to 12×, so raw pays
 *     are the leanest of the pack — classic high-volatility profile
 *   - ~96.6% simulated RTP (label 96.6), ~42% hit frequency,
 *     ~2.1% free-spin trigger rate at 10 awarded spins
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { VIKING_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'viking-raid',
  title: 'Viking Raid',
  tagline: 'Sail at dusk — every raid spin climbs the multiplier trail', // 60 chars
  rtp: 96.6,
  volatility: 'high',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 4,
  paylines: 40,
  bonus: {
    type: 'multiplier-trail',
    triggerScatters: 3,
    awardSpins: 10,
    label: 'Raid Free Spins',
    description:
      'Land 3 or more Battle Horns anywhere to win 10 free spins. Each free ' +
      'spin raises the raid multiplier — 1×, 2×, 3×, 5×, 8×, then a fearsome ' +
      '12×. Consecutive base-game wins climb the trail too. Retriggers add ' +
      '10 more spins.'
  },
  palette: {
    primary: '#3e5f7e', // steel blue
    secondary: '#7fa3c4', // storm gray-blue
    bg: '#1a212b', // night storm
    accent: '#ff8c3a' // raid-fire orange
  },
  iconEmoji: '⚔️',
  released: '2026-08'
}

/* --------------------------------------------------------------- symbols */

/**
 * 10 symbols: wild + scatter + 4 high + 4 low.
 * `weight` = relative frequency per cell (reel-strip weighting).
 * `pays`   = { 3: x, 4: x, 5: x } multipliers of total bet.
 */
const symbols: SymbolDef[] = [
  {
    id: 'wild',
    name: "Odin's Raven",
    kind: 'wild',
    render: (size) => VIKING_ART.wild({ size }),
    weight: 2,
    pays: { 3: 1, 4: 5, 5: 24 }
  },
  {
    id: 'scatter',
    name: 'Battle Horn',
    kind: 'scatter',
    render: (size) => VIKING_ART.scatter({ size }),
    weight: 3,
    pays: { 3: 1, 4: 5, 5: 24 } // scatter pays ANYWHERE
  },
  {
    id: 'h1',
    name: 'Viking Warrior',
    kind: 'high',
    render: (size) => VIKING_ART.h1({ size }),
    weight: 6,
    pays: { 3: 0.5, 4: 2, 5: 10 }
  },
  {
    id: 'h2',
    name: 'Valkyrie',
    kind: 'high',
    render: (size) => VIKING_ART.h2({ size }),
    weight: 7,
    pays: { 3: 0.4, 4: 1.5, 5: 6 }
  },
  {
    id: 'h3',
    name: 'Longship',
    kind: 'high',
    render: (size) => VIKING_ART.h3({ size }),
    weight: 8,
    pays: { 3: 0.28, 4: 1, 5: 4 }
  },
  {
    id: 'h4',
    name: 'Battle Axe',
    kind: 'high',
    render: (size) => VIKING_ART.h4({ size }),
    weight: 9,
    pays: { 3: 0.2, 4: 0.7, 5: 2.8 }
  },
  {
    id: 'l1',
    name: 'Runestone A',
    kind: 'low',
    render: (size) => VIKING_ART.l1({ size }),
    weight: 15,
    pays: { 3: 0.1, 4: 0.36, 5: 1.4 }
  },
  {
    id: 'l2',
    name: 'Runestone K',
    kind: 'low',
    render: (size) => VIKING_ART.l2({ size }),
    weight: 16,
    pays: { 3: 0.08, 4: 0.3, 5: 1.2 }
  },
  {
    id: 'l3',
    name: 'Runestone Q',
    kind: 'low',
    render: (size) => VIKING_ART.l3({ size }),
    weight: 17,
    pays: { 3: 0.08, 4: 0.26, 5: 1 }
  },
  {
    id: 'l4',
    name: 'Runestone J',
    kind: 'low',
    render: (size) => VIKING_ART.l4({ size }),
    weight: 18,
    pays: { 3: 0.06, 4: 0.2, 5: 0.8 }
  }
]

/* -------------------------------------------------------------- paylines */

/**
 * 40 lines over 4 rows. paylines[line][reel] = row index (0 = top … 3 = bottom).
 */
const paylines: number[][] = [
  [1, 1, 1, 1, 1], // row 2
  [2, 2, 2, 2, 2], // row 3
  [0, 0, 0, 0, 0], // row 1
  [3, 3, 3, 3, 3], // row 4
  [0, 1, 2, 1, 0], // V (upper)
  [3, 2, 1, 2, 3], // Λ (lower)
  [1, 0, 1, 0, 1],
  [2, 1, 2, 1, 2],
  [1, 2, 1, 2, 1],
  [2, 3, 2, 3, 2],
  [0, 1, 0, 1, 0],
  [3, 2, 3, 2, 3],
  [1, 0, 0, 0, 1],
  [2, 3, 3, 3, 2],
  [1, 2, 2, 2, 1],
  [2, 1, 1, 1, 2],
  [0, 0, 1, 0, 0],
  [3, 3, 2, 3, 3],
  [1, 1, 0, 1, 1],
  [2, 2, 3, 2, 2],
  [1, 1, 2, 1, 1],
  [2, 2, 1, 2, 2],
  [0, 1, 1, 1, 0],
  [3, 2, 2, 2, 3],
  [1, 2, 3, 2, 1], // deep V
  [2, 1, 0, 1, 2], // deep Λ
  [0, 0, 1, 2, 2],
  [3, 3, 2, 1, 1],
  [1, 0, 0, 1, 1],
  [2, 3, 3, 2, 2],
  [0, 1, 1, 2, 2],
  [3, 2, 2, 1, 1],
  [1, 1, 0, 0, 1],
  [2, 2, 3, 3, 2],
  [0, 1, 2, 3, 2],
  [3, 2, 1, 0, 1],
  [1, 2, 3, 3, 2],
  [2, 1, 0, 0, 1],
  [0, 0, 1, 1, 0],
  [3, 3, 2, 2, 3]
]

/* --------------------------------------------------------------- config */

const config: SlotModule['config'] = {
  meta,
  symbols,
  paylines,
  ambientColor: '#33506e', // cold storm glow behind the machine
  musicMood: 'epic' // war horns over rolling thunder
}

const module_: SlotModule = { meta, config }
export default module_
