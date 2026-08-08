/**
 * games/wild-west-gold-rush/index.ts (SPEC §6, row 7)
 * ---------------------------------------------------------------------------
 * Wild West Gold Rush · 5×3 · 25 paylines · medium volatility ·
 * Saloon Showdown pick-me bonus (3 picks, engine overlay).
 *
 * Discovered automatically by slots/engine/registry.ts via import.meta.glob.
 *
 * Math notes:
 *   - pays are multipliers of TOTAL bet per winning line; 25 lines tuned
 *     slightly under the 20-line reference table.
 *   - pick-me omits awardSpins — 3+ Saloon scatters open the Showdown
 *     overlay instead of free spins.
 *   - rtp label 95.9 — medium volatility.
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { WEST_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'wild-west-gold-rush',
  title: 'Wild West Gold Rush',
  tagline: 'Strike it rich — pick your prize in the Saloon Showdown', // 58 chars
  rtp: 95.9,
  volatility: 'medium',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 3,
  paylines: 25,
  bonus: {
    type: 'pick-me',
    triggerScatters: 3,
    label: 'Saloon Showdown',
    description:
      'Land 3 or more Saloon scatters anywhere to enter the Saloon Showdown. ' +
      'Pick 3 wanted posters — each one hides an instant coin prize.'
  },
  palette: {
    primary: '#8b5e34', // worn leather
    secondary: '#d9b380', // desert dust
    bg: '#241608', // saloon night
    accent: '#d4af37' // brass
  },
  iconEmoji: '🤠',
  released: '2026-08'
}

/* --------------------------------------------------------------- symbols */

/**
 * 10 symbols: wild + scatter + 4 high + 4 low.
 * `weight` = relative frequency per cell; pays are {3,4,5} multipliers
 * of total bet per winning payline.
 */
const symbols: SymbolDef[] = [
  {
    id: 'wild',
    name: 'Sheriff Star',
    kind: 'wild',
    render: (size) => WEST_ART.wild({ size }),
    weight: 2,
    pays: { 3: 5, 4: 25, 5: 120 }
  },
  {
    id: 'scatter',
    name: 'Saloon Doors',
    kind: 'scatter',
    render: (size) => WEST_ART.scatter({ size }),
    weight: 4,
    pays: { 3: 4, 4: 18, 5: 90 } // scatter pays ANYWHERE
  },
  {
    id: 'h1',
    name: 'Gold Nuggets',
    kind: 'high',
    render: (size) => WEST_ART.h1({ size }),
    weight: 6,
    pays: { 3: 2.8, 4: 11, 5: 55 }
  },
  {
    id: 'h2',
    name: 'Frontier Revolver',
    kind: 'high',
    render: (size) => WEST_ART.h2({ size }),
    weight: 7,
    pays: { 3: 2.2, 4: 8, 5: 32 }
  },
  {
    id: 'h3',
    name: 'Cowboy Hat',
    kind: 'high',
    render: (size) => WEST_ART.h3({ size }),
    weight: 8,
    pays: { 3: 1.5, 4: 5.5, 5: 20 }
  },
  {
    id: 'h4',
    name: 'Lucky Horseshoe',
    kind: 'high',
    render: (size) => WEST_ART.h4({ size }),
    weight: 9,
    pays: { 3: 1.1, 4: 4, 5: 15 }
  },
  {
    id: 'l1',
    name: 'Branded A',
    kind: 'low',
    render: (size) => WEST_ART.l1({ size }),
    weight: 15,
    pays: { 3: 0.45, 4: 1.8, 5: 7 }
  },
  {
    id: 'l2',
    name: 'Branded K',
    kind: 'low',
    render: (size) => WEST_ART.l2({ size }),
    weight: 16,
    pays: { 3: 0.35, 4: 1.5, 5: 6 }
  },
  {
    id: 'l3',
    name: 'Branded Q',
    kind: 'low',
    render: (size) => WEST_ART.l3({ size }),
    weight: 17,
    pays: { 3: 0.35, 4: 1.2, 5: 5 }
  },
  {
    id: 'l4',
    name: 'Branded J',
    kind: 'low',
    render: (size) => WEST_ART.l4({ size }),
    weight: 18,
    pays: { 3: 0.25, 4: 0.9, 5: 3.5 }
  }
]

/* -------------------------------------------------------------- paylines */

/** 25 frontier lines. paylines[line][reel] = row index (0 top … 2 bottom). */
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
  [0, 2, 2, 2, 0],
  [2, 0, 0, 0, 2],
  [1, 2, 0, 2, 1],
  [1, 0, 2, 0, 1],
  [0, 2, 1, 2, 0],
  [2, 0, 1, 0, 2]
]

/* --------------------------------------------------------------- config */

const config: SlotModule['config'] = {
  meta,
  symbols,
  paylines,
  ambientColor: '#b07d3e', // dusty lantern glow behind the machine
  musicMood: 'playful' // honky-tonk bounce
}

const module_: SlotModule = { meta, config }
export default module_
