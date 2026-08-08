/**
 * games/dragon-fire/index.ts — Dragon Fire (SPEC §6, row 5)
 * ---------------------------------------------------------------------------
 * Dragon Fire · 5×4 · 40 paylines · high volatility · Inferno Free Spins
 * (sticky wilds — wilds landing during free spins lock in place until the
 * feature ends).
 *
 * Discovered automatically by slots/engine/registry.ts via import.meta.glob.
 *
 * Math notes (LocalSpinAdapter, verified by full-session simulation):
 *   - pays are multipliers of TOTAL bet, applied per winning payline
 *   - 40 lines over 4 rows + sticky-wild free spins carry most of the RTP
 *     budget, so base pays are lean (classic high-volatility profile)
 *   - ~95.5% simulated RTP (label 95.5), ~42% hit frequency,
 *     ~2.0% free-spin trigger rate at 8 awarded spins
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { DRAGON_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'dragon-fire',
  title: 'Dragon Fire',
  tagline: 'Face the wyrm — wilds stick and burn through free spins', // 58 chars
  rtp: 95.5,
  volatility: 'high',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 4,
  paylines: 40,
  bonus: {
    type: 'sticky-wilds',
    triggerScatters: 3,
    awardSpins: 8,
    label: 'Inferno Free Spins',
    description:
      'Land 3 or more Dragon Eggs anywhere to win 8 free spins. Every Inferno ' +
      'Wild that lands during the feature sticks to its cell until the last ' +
      'spin. Free spins retrigger.'
  },
  palette: {
    primary: '#c1272d', // crimson
    secondary: '#ff7a2f', // ember
    bg: '#17151a', // charcoal
    accent: '#ffb347' // flame
  },
  iconEmoji: '🐉',
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
    name: 'Inferno Wild',
    kind: 'wild',
    render: (size) => DRAGON_ART.wild({ size }),
    weight: 2,
    pays: { 3: 1.35, 4: 6.6, 5: 32 }
  },
  {
    id: 'scatter',
    name: 'Dragon Egg',
    kind: 'scatter',
    render: (size) => DRAGON_ART.scatter({ size }),
    weight: 3,
    pays: { 3: 1.35, 4: 6.6, 5: 32 } // scatter pays ANYWHERE
  },
  {
    id: 'h1',
    name: 'Red Dragon',
    kind: 'high',
    render: (size) => DRAGON_ART.h1({ size }),
    weight: 6,
    pays: { 3: 0.67, 4: 2.7, 5: 13.4 }
  },
  {
    id: 'h2',
    name: 'Dragon Knight',
    kind: 'high',
    render: (size) => DRAGON_ART.h2({ size }),
    weight: 7,
    pays: { 3: 0.52, 4: 2.05, 5: 8 }
  },
  {
    id: 'h3',
    name: 'Ember Keep',
    kind: 'high',
    render: (size) => DRAGON_ART.h3({ size }),
    weight: 8,
    pays: { 3: 0.38, 4: 1.35, 5: 5.4 }
  },
  {
    id: 'h4',
    name: 'Flame Sword',
    kind: 'high',
    render: (size) => DRAGON_ART.h4({ size }),
    weight: 9,
    pays: { 3: 0.27, 4: 0.97, 5: 3.7 }
  },
  {
    id: 'l1',
    name: 'Cinder Rune A',
    kind: 'low',
    render: (size) => DRAGON_ART.l1({ size }),
    weight: 15,
    pays: { 3: 0.14, 4: 0.48, 5: 1.85 }
  },
  {
    id: 'l2',
    name: 'Cinder Rune K',
    kind: 'low',
    render: (size) => DRAGON_ART.l2({ size }),
    weight: 16,
    pays: { 3: 0.11, 4: 0.4, 5: 1.6 }
  },
  {
    id: 'l3',
    name: 'Cinder Rune Q',
    kind: 'low',
    render: (size) => DRAGON_ART.l3({ size }),
    weight: 17,
    pays: { 3: 0.11, 4: 0.35, 5: 1.35 }
  },
  {
    id: 'l4',
    name: 'Cinder Rune J',
    kind: 'low',
    render: (size) => DRAGON_ART.l4({ size }),
    weight: 18,
    pays: { 3: 0.08, 4: 0.27, 5: 1.07 }
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
  ambientColor: '#8f2328', // ember glow behind the machine
  musicMood: 'epic' // war-drums under a dragon's roar
}

const module_: SlotModule = { meta, config }
export default module_
