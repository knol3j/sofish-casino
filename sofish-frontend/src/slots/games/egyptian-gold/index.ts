/**
 * games/egyptian-gold/index.ts — Egyptian Gold (SPEC §6, row 2)
 * ---------------------------------------------------------------------------
 * Egyptian Gold · 5×3 · 20 paylines · high volatility · Pharaoh's Wilds
 * (expanding wilds — any reel holding a wild becomes fully wild).
 *
 * Discovered automatically by slots/engine/registry.ts via import.meta.glob.
 *
 * Math notes (LocalSpinAdapter, verified by simulation):
 *   - pays are multipliers of TOTAL bet, applied per winning payline
 *   - expanding wilds apply on every spin (engine expandWilds), so pays are
 *     tuned leaner than ocean-treasure to hold RTP in band
 *   - ~95.4% simulated RTP (label 95.4), ~35% hit frequency
 *   - 3+ Pyramid scatters still trigger the bonus banner; the feature is the
 *     ever-present expanding wilds, so awardSpins is intentionally omitted
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { EGYPT_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'egyptian-gold',
  title: 'Egyptian Gold',
  tagline: 'Awaken the Pharaoh — wilds expand to claim the whole reel', // 58 chars
  rtp: 95.4,
  volatility: 'high',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 3,
  paylines: 20,
  bonus: {
    type: 'expanding-wilds',
    triggerScatters: 3,
    label: "Pharaoh's Wilds",
    description:
      'The Golden Scarab expands to fill its entire reel whenever it lands. ' +
      'Land 3 or more Pyramid scatters to invoke the Pharaoh’s blessing — ' +
      'whole reels of solid gold wilds.'
  },
  palette: {
    primary: '#c9932b', // desert gold
    secondary: '#e6cf9c', // sand
    bg: '#171310', // onyx tomb
    accent: '#f0c75e' // torchlit gold
  },
  iconEmoji: '🏺',
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
    name: 'Golden Scarab',
    kind: 'wild',
    render: (size) => EGYPT_ART.wild({ size }),
    weight: 2,
    pays: { 3: 3.8, 4: 19, 5: 90 }
  },
  {
    id: 'scatter',
    name: 'Pyramid',
    kind: 'scatter',
    render: (size) => EGYPT_ART.scatter({ size }),
    weight: 4,
    pays: { 3: 3.8, 4: 19, 5: 90 } // scatter pays ANYWHERE
  },
  {
    id: 'h1',
    name: "Pharaoh's Mask",
    kind: 'high',
    render: (size) => EGYPT_ART.h1({ size }),
    weight: 6,
    pays: { 3: 1.9, 4: 7.5, 5: 37 }
  },
  {
    id: 'h2',
    name: 'Eye of Horus',
    kind: 'high',
    render: (size) => EGYPT_ART.h2({ size }),
    weight: 7,
    pays: { 3: 1.5, 4: 5.5, 5: 22 }
  },
  {
    id: 'h3',
    name: 'Anubis',
    kind: 'high',
    render: (size) => EGYPT_ART.h3({ size }),
    weight: 8,
    pays: { 3: 1, 4: 3.8, 5: 15 }
  },
  {
    id: 'h4',
    name: 'Ankh',
    kind: 'high',
    render: (size) => EGYPT_ART.h4({ size }),
    weight: 9,
    pays: { 3: 0.75, 4: 2.7, 5: 10.5 }
  },
  {
    id: 'l1',
    name: 'Cartouche A',
    kind: 'low',
    render: (size) => EGYPT_ART.l1({ size }),
    weight: 15,
    pays: { 3: 0.4, 4: 1.35, 5: 5.2 }
  },
  {
    id: 'l2',
    name: 'Cartouche K',
    kind: 'low',
    render: (size) => EGYPT_ART.l2({ size }),
    weight: 16,
    pays: { 3: 0.3, 4: 1.1, 5: 4.4 }
  },
  {
    id: 'l3',
    name: 'Cartouche Q',
    kind: 'low',
    render: (size) => EGYPT_ART.l3({ size }),
    weight: 17,
    pays: { 3: 0.3, 4: 0.95, 5: 3.7 }
  },
  {
    id: 'l4',
    name: 'Cartouche J',
    kind: 'low',
    render: (size) => EGYPT_ART.l4({ size }),
    weight: 18,
    pays: { 3: 0.22, 4: 0.75, 5: 2.9 }
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
  ambientColor: '#8a6420', // torch-gold glow behind the machine
  musicMood: 'epic' // cinematic desert-dynasty score
}

const module_: SlotModule = { meta, config }
export default module_
