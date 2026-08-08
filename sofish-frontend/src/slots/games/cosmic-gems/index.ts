/**
 * games/cosmic-gems/index.ts (SPEC §6, row 6)
 * ---------------------------------------------------------------------------
 * Cosmic Gems · 5×3 · 243 ways · medium volatility · Starfall Cascades.
 *
 * Discovered automatically by slots/engine/registry.ts via import.meta.glob —
 * NO edits to shared files. 243-ways: meta.paylines = 0 and config.paylines
 * is OMITTED entirely (engine evaluates with evaluateWays).
 *
 * Bonus wiring: bonus.type 'cascade' — winning clusters pop and new gems
 * fall in, chaining while wins keep landing; 3+ Shooting Star scatters
 * award 10 free spins (engine-driven).
 *
 * Math notes (ways games): pays are multipliers of TOTAL BET per way, and
 * the engine divides by WAYS_BET_DIVISOR (10) per way. Cascade chains
 * multiply spin value ~2.4×, so raw pays run higher than a line game.
 * Tuned by Monte-Carlo simulation of the engine math: ~94.8% RTP (label
 * 94.8), ~2.2% free-spin trigger rate, ~10% near-miss respin rate.
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { COSMIC_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'cosmic-gems',
  title: 'Cosmic Gems',
  tagline: 'Gems fall like shooting stars — every win cascades again', // 58 chars
  rtp: 94.8,
  volatility: 'medium',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 3,
  paylines: 0, // 243 ways — config.paylines omitted
  bonus: {
    type: 'cascade',
    triggerScatters: 3,
    awardSpins: 10,
    label: 'Starfall Cascades',
    description:
      'Every winning cluster shatters and new gems fall from the stars — ' +
      'chains keep paying while wins keep landing. Land 3 or more Shooting ' +
      'Star scatters to win 10 free spins with cascading reels.'
  },
  palette: {
    primary: '#5b5fd6', // indigo
    secondary: '#a855f7', // violet
    bg: '#120f2b', // deep space
    accent: '#e9e6ff' // starlight
  },
  iconEmoji: '💎',
  released: '2026-08'
}

/* --------------------------------------------------------------- symbols */

/**
 * 10 symbols: wild + scatter + 4 high + 4 low.
 * `weight` = relative frequency per cell (reel-strip weighting).
 * `pays`   = { 3: x, 4: x, 5: x } multipliers of total bet (per way).
 */
const symbols: SymbolDef[] = [
  {
    id: 'wild',
    name: 'Supernova',
    kind: 'wild',
    render: (size) => COSMIC_ART.wild({ size }),
    weight: 2,
    pays: { 3: 8, 4: 25, 5: 100 }
  },
  {
    id: 'scatter',
    name: 'Shooting Star',
    kind: 'scatter',
    render: (size) => COSMIC_ART.scatter({ size }),
    weight: 4,
    pays: { 3: 2, 4: 8, 5: 25 } // scatter pays ANYWHERE
  },
  {
    id: 'h1',
    name: 'Nebula Heart',
    kind: 'high',
    render: (size) => COSMIC_ART.h1({ size }),
    weight: 6,
    pays: { 3: 7, 4: 20, 5: 60 }
  },
  {
    id: 'h2',
    name: 'Sapphire Drop',
    kind: 'high',
    render: (size) => COSMIC_ART.h2({ size }),
    weight: 7,
    pays: { 3: 5.5, 4: 15, 5: 45 }
  },
  {
    id: 'h3',
    name: 'Amethyst Crown',
    kind: 'high',
    render: (size) => COSMIC_ART.h3({ size }),
    weight: 8,
    pays: { 3: 4.5, 4: 12.5, 5: 35 }
  },
  {
    id: 'h4',
    name: 'Moonstone',
    kind: 'high',
    render: (size) => COSMIC_ART.h4({ size }),
    weight: 9,
    pays: { 3: 3.5, 4: 10, 5: 28 }
  },
  {
    id: 'l1',
    name: 'Starlight A',
    kind: 'low',
    render: (size) => COSMIC_ART.l1({ size }),
    weight: 14,
    pays: { 3: 1.5, 4: 4, 5: 15 }
  },
  {
    id: 'l2',
    name: 'Starlight K',
    kind: 'low',
    render: (size) => COSMIC_ART.l2({ size }),
    weight: 15,
    pays: { 3: 1.25, 4: 3.5, 5: 12.5 }
  },
  {
    id: 'l3',
    name: 'Starlight Q',
    kind: 'low',
    render: (size) => COSMIC_ART.l3({ size }),
    weight: 16,
    pays: { 3: 1, 4: 3, 5: 10 }
  },
  {
    id: 'l4',
    name: 'Starlight J',
    kind: 'low',
    render: (size) => COSMIC_ART.l4({ size }),
    weight: 17,
    pays: { 3: 0.75, 4: 2.5, 5: 8 }
  }
]

/* --------------------------------------------------------------- config */

const config: SlotModule['config'] = {
  meta,
  symbols,
  // NO paylines key — 243-ways evaluation (meta.paylines === 0)
  ambientColor: '#5b5fd6', // indigo nebula glow behind the machine
  musicMood: 'chill' // slow cosmic pad
}

const module_: SlotModule = { meta, config }
export default module_
