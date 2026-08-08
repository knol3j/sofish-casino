/**
 * games/candy-burst/index.ts (SPEC §6, row 8)
 * ---------------------------------------------------------------------------
 * Candy Burst · 5×3 · 20 paylines · low volatility · Sugar Rush Cascades
 * (winning symbols pop, new ones drop in and keep chaining) + free spins
 * on 3+ Gumball scatters + near-miss respin on exactly 2 scatters.
 *
 * Discovered automatically by slots/engine/registry.ts via import.meta.glob.
 *
 * Math notes:
 *   - pays are multipliers of TOTAL bet per winning line; cascade chains
 *     add extra wins on top, so the base table sits slightly below the
 *     20-line reference table.
 *   - cascade sets awardSpins (8) — 3+ Gumballs award Sugar Rush Free
 *     Spins, and the cascade mechanic keeps chaining inside them.
 *   - rtp label 95.2 — low volatility, very high hit frequency.
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { CANDY_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'candy-burst',
  title: 'Candy Burst',
  tagline: 'Sweet cascades keep popping — gumballs burst into free spins', // 59 chars
  rtp: 95.2,
  volatility: 'low',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 3,
  paylines: 20,
  bonus: {
    type: 'cascade',
    triggerScatters: 3,
    awardSpins: 8,
    label: 'Sugar Rush Cascades',
    description:
      'Every win pops its candies and drops fresh ones in — chains keep paying ' +
      'until no new win lands. 3+ Gumball scatters award 8 free spins, and ' +
      'exactly 2 gumballs hold for a respin.'
  },
  palette: {
    primary: '#ff8fab', // bubblegum pink
    secondary: '#7fe0c3', // mint
    bg: '#33182b', // plum night
    accent: '#ffe08a' // sugar lemon
  },
  iconEmoji: '🍬',
  released: '2026-08'
}

/* --------------------------------------------------------------- symbols */

/**
 * 10 symbols: wild + scatter + 4 high + 4 low.
 * `weight` = relative frequency per cell; pays are {3,4,5} multipliers
 * of total bet per winning payline (base hit before cascade chains).
 */
const symbols: SymbolDef[] = [
  {
    id: 'wild',
    name: 'Rainbow Lollipop',
    kind: 'wild',
    render: (size) => CANDY_ART.wild({ size }),
    weight: 2,
    pays: { 3: 5, 4: 25, 5: 120 }
  },
  {
    id: 'scatter',
    name: 'Gumball Machine',
    kind: 'scatter',
    render: (size) => CANDY_ART.scatter({ size }),
    weight: 4,
    pays: { 3: 4, 4: 18, 5: 90 } // scatter pays ANYWHERE
  },
  {
    id: 'h1',
    name: 'Frosted Cupcake',
    kind: 'high',
    render: (size) => CANDY_ART.h1({ size }),
    weight: 6,
    pays: { 3: 2.6, 4: 10, 5: 50 }
  },
  {
    id: 'h2',
    name: 'Sugar Strawberry',
    kind: 'high',
    render: (size) => CANDY_ART.h2({ size }),
    weight: 7,
    pays: { 3: 2, 4: 7, 5: 28 }
  },
  {
    id: 'h3',
    name: 'Jelly Bean',
    kind: 'high',
    render: (size) => CANDY_ART.h3({ size }),
    weight: 8,
    pays: { 3: 1.4, 4: 5, 5: 18 }
  },
  {
    id: 'h4',
    name: 'Peppermint Swirl',
    kind: 'high',
    render: (size) => CANDY_ART.h4({ size }),
    weight: 9,
    pays: { 3: 1, 4: 3.5, 5: 13 }
  },
  {
    id: 'l1',
    name: 'Candy A',
    kind: 'low',
    render: (size) => CANDY_ART.l1({ size }),
    weight: 15,
    pays: { 3: 0.4, 4: 1.6, 5: 6 }
  },
  {
    id: 'l2',
    name: 'Candy K',
    kind: 'low',
    render: (size) => CANDY_ART.l2({ size }),
    weight: 16,
    pays: { 3: 0.3, 4: 1.2, 5: 5 }
  },
  {
    id: 'l3',
    name: 'Candy Q',
    kind: 'low',
    render: (size) => CANDY_ART.l3({ size }),
    weight: 17,
    pays: { 3: 0.3, 4: 1, 5: 4 }
  },
  {
    id: 'l4',
    name: 'Candy J',
    kind: 'low',
    render: (size) => CANDY_ART.l4({ size }),
    weight: 18,
    pays: { 3: 0.2, 4: 0.8, 5: 3 }
  }
]

/* -------------------------------------------------------------- paylines */

/** 20 classic lines. paylines[line][reel] = row index (0 top … 2 bottom). */
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
  ambientColor: '#ff9ec4', // cotton-candy glow behind the machine
  musicMood: 'playful'
}

const module_: SlotModule = { meta, config }
export default module_
