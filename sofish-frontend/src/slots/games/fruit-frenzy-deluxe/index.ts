/**
 * games/fruit-frenzy-deluxe/index.ts (SPEC §6, row 4)
 * ---------------------------------------------------------------------------
 * Fruit Frenzy Deluxe · 5×3 · 10 paylines · low volatility ·
 * Both-Ways Pays (+ near-miss respin on 2 bells — engine built-in).
 *
 * Discovered automatically by slots/engine/registry.ts via import.meta.glob.
 *
 * Math notes:
 *   - Lines pay BOTH directions (left→right and right→left), so pays are
 *     roughly HALF the Ocean Treasure table to land in the same RTP band.
 *   - Scatters (Bells) pay anywhere on their own table; exactly 2 bells
 *     hold and respin the remaining reels (engine RESPIN_TYPES).
 *   - rtp label 95.4 — low volatility, high hit frequency.
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { FRUIT_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'fruit-frenzy-deluxe',
  title: 'Fruit Frenzy Deluxe',
  tagline: 'Classic fruits pay both ways — two bells respin the reels', // 57 chars
  rtp: 95.4,
  volatility: 'low',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 3,
  paylines: 10,
  bonus: {
    type: 'both-ways',
    triggerScatters: 3,
    label: 'Both-Ways Frenzy',
    description:
      'Every payline pays left-to-right AND right-to-left — wins come twice as ' +
      'easy. Land exactly 2 Golden Bells to hold them and respin the rest.'
  },
  palette: {
    primary: '#a4133c', // glossy casino red
    secondary: '#2f9e44', // felt green
    bg: '#2b0a14', // dark wine felt
    accent: '#ffd166' // gold trim
  },
  iconEmoji: '🍒',
  released: '2026-08'
}

/* --------------------------------------------------------------- symbols */

/**
 * 10 symbols: wild + scatter + 4 high + 4 low.
 * Pays are multipliers of TOTAL bet per winning line, halved vs the
 * one-way reference table because all 10 lines pay in both directions.
 */
const symbols: SymbolDef[] = [
  {
    id: 'wild',
    name: 'Frenzy Seven',
    kind: 'wild',
    render: (size) => FRUIT_ART.wild({ size }),
    weight: 2,
    pays: { 3: 3, 4: 15, 5: 75 }
  },
  {
    id: 'scatter',
    name: 'Golden Bell',
    kind: 'scatter',
    render: (size) => FRUIT_ART.scatter({ size }),
    weight: 4,
    pays: { 3: 3, 4: 14, 5: 70 } // scatter pays ANYWHERE
  },
  {
    id: 'h1',
    name: 'Twin Cherries',
    kind: 'high',
    render: (size) => FRUIT_ART.h1({ size }),
    weight: 6,
    pays: { 3: 1.6, 4: 7, 5: 34 }
  },
  {
    id: 'h2',
    name: 'Watermelon Slice',
    kind: 'high',
    render: (size) => FRUIT_ART.h2({ size }),
    weight: 7,
    pays: { 3: 1.3, 4: 5, 5: 20 }
  },
  {
    id: 'h3',
    name: 'Orange Wheel',
    kind: 'high',
    render: (size) => FRUIT_ART.h3({ size }),
    weight: 8,
    pays: { 3: 0.9, 4: 3.5, 5: 13 }
  },
  {
    id: 'h4',
    name: 'Glossy Lemon',
    kind: 'high',
    render: (size) => FRUIT_ART.h4({ size }),
    weight: 9,
    pays: { 3: 0.65, 4: 2.5, 5: 9.5 }
  },
  {
    id: 'l1',
    name: 'Chip A',
    kind: 'low',
    render: (size) => FRUIT_ART.l1({ size }),
    weight: 15,
    pays: { 3: 0.28, 4: 1.1, 5: 4.5 }
  },
  {
    id: 'l2',
    name: 'Chip K',
    kind: 'low',
    render: (size) => FRUIT_ART.l2({ size }),
    weight: 16,
    pays: { 3: 0.23, 4: 0.95, 5: 3.8 }
  },
  {
    id: 'l3',
    name: 'Chip Q',
    kind: 'low',
    render: (size) => FRUIT_ART.l3({ size }),
    weight: 17,
    pays: { 3: 0.23, 4: 0.8, 5: 3.3 }
  },
  {
    id: 'l4',
    name: 'Chip J',
    kind: 'low',
    render: (size) => FRUIT_ART.l4({ size }),
    weight: 18,
    pays: { 3: 0.15, 4: 0.6, 5: 2.3 }
  }
]

/* -------------------------------------------------------------- paylines */

/** 10 classic fruit-machine lines. paylines[line][reel] = row index. */
const paylines: number[][] = [
  [1, 1, 1, 1, 1], // middle row
  [0, 0, 0, 0, 0], // top row
  [2, 2, 2, 2, 2], // bottom row
  [0, 1, 2, 1, 0], // V
  [2, 1, 0, 1, 2], // Λ
  [0, 0, 1, 0, 0],
  [2, 2, 1, 2, 2],
  [1, 0, 1, 0, 1],
  [1, 2, 1, 2, 1],
  [0, 1, 1, 1, 0]
]

/* --------------------------------------------------------------- config */

const config: SlotModule['config'] = {
  meta,
  symbols,
  paylines,
  ambientColor: '#c2255c', // red-neon glow behind the machine
  musicMood: 'playful'
}

const module_: SlotModule = { meta, config }
export default module_
