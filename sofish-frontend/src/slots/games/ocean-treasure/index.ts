/**
 * games/ocean-treasure/index.ts — THE REFERENCE GAME (SPEC §6, row 1)
 * ---------------------------------------------------------------------------
 * Ocean Treasure · 5×3 · 20 paylines · medium volatility · Kraken Free Spins.
 *
 * This is the template every other game imitates. A game module is:
 *   1. art.tsx        — original inline-SVG components, one per symbol
 *   2. index.ts       — default-exported SlotModule { meta, config }
 *   3. skin.css       — optional palette overrides (imported for side effects)
 *
 * The registry (slots/engine/registry.ts) discovers this file automatically
 * via import.meta.glob — NO edits to shared files are needed to add a game.
 *
 * Math notes (LocalSpinAdapter, verified by simulation):
 *   - pays are multipliers of TOTAL bet, applied per winning payline
 *   - scatter (Kraken) pays anywhere on its own table AND triggers the bonus
 *   - tuned to ~95.3% simulated RTP (label 95.5), ~34% hit frequency,
 *     ~1.9% free-spin trigger rate at 10 awarded spins
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { OCEAN_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'ocean-treasure',
  title: 'Ocean Treasure',
  tagline: 'Dive deep for sunken gold — wake the Kraken for free spins', // 60 chars
  rtp: 95.5,
  volatility: 'medium',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 3,
  paylines: 20,
  bonus: {
    type: 'freespins',
    triggerScatters: 3,
    awardSpins: 10,
    label: 'Kraken Free Spins',
    description:
      'Land 3 or more Kraken scatters anywhere to win 10 free spins. ' +
      'Free spins retrigger — the Kraken knows no mercy.'
  },
  palette: {
    primary: '#0b5563', // deep teal
    secondary: '#17a2b8', // aqua
    bg: '#03252e', // abyss
    accent: '#f5c453' // sunken gold
  },
  iconEmoji: '🐙',
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
    name: 'Golden Trident',
    kind: 'wild',
    render: (size) => OCEAN_ART.wild({ size }),
    weight: 2,
    pays: { 3: 6, 4: 32, 5: 160 }
  },
  {
    id: 'scatter',
    name: 'Kraken',
    kind: 'scatter',
    render: (size) => OCEAN_ART.scatter({ size }),
    weight: 4,
    pays: { 3: 6, 4: 30, 5: 150 } // scatter pays ANYWHERE
  },
  {
    id: 'h1',
    name: 'Treasure Chest',
    kind: 'high',
    render: (size) => OCEAN_ART.h1({ size }),
    weight: 6,
    pays: { 3: 3.2, 4: 14, 5: 68 }
  },
  {
    id: 'h2',
    name: 'Abyss Pearl',
    kind: 'high',
    render: (size) => OCEAN_ART.h2({ size }),
    weight: 7,
    pays: { 3: 2.6, 4: 10, 5: 40 }
  },
  {
    id: 'h3',
    name: "Captain's Helm",
    kind: 'high',
    render: (size) => OCEAN_ART.h3({ size }),
    weight: 8,
    pays: { 3: 1.8, 4: 7, 5: 26 }
  },
  {
    id: 'h4',
    name: 'Sea Turtle',
    kind: 'high',
    render: (size) => OCEAN_ART.h4({ size }),
    weight: 9,
    pays: { 3: 1.3, 4: 5, 5: 19 }
  },
  {
    id: 'l1',
    name: 'Coral A',
    kind: 'low',
    render: (size) => OCEAN_ART.l1({ size }),
    weight: 15,
    pays: { 3: 0.55, 4: 2.2, 5: 9 }
  },
  {
    id: 'l2',
    name: 'Coral K',
    kind: 'low',
    render: (size) => OCEAN_ART.l2({ size }),
    weight: 16,
    pays: { 3: 0.45, 4: 1.9, 5: 7.5 }
  },
  {
    id: 'l3',
    name: 'Coral Q',
    kind: 'low',
    render: (size) => OCEAN_ART.l3({ size }),
    weight: 17,
    pays: { 3: 0.45, 4: 1.6, 5: 6.5 }
  },
  {
    id: 'l4',
    name: 'Coral J',
    kind: 'low',
    render: (size) => OCEAN_ART.l4({ size }),
    weight: 18,
    pays: { 3: 0.3, 4: 1.2, 5: 4.5 }
  }
]

/* -------------------------------------------------------------- paylines */

/**
 * 20 classic lines. paylines[line][reel] = row index (0 = top … 2 = bottom).
 * Omit entirely (and set meta.paylines = 0) for 243-ways games.
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
  ambientColor: '#0e7f8c', // teal glow behind the machine
  musicMood: 'chill' // slow aquatic pad
}

const module_: SlotModule = { meta, config }
export default module_
