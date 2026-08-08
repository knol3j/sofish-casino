/**
 * games/neon-nights/index.ts (SPEC §6, row 3)
 * ---------------------------------------------------------------------------
 * Neon Nights · 5×3 · 243 ways · high volatility · multiplier-trail bonus.
 *
 * Discovered automatically by slots/engine/registry.ts via import.meta.glob —
 * NO edits to shared files. 243-ways: meta.paylines = 0 and config.paylines
 * is OMITTED entirely (engine evaluates with evaluateWays).
 *
 * Bonus wiring: bonus.type 'multiplier-trail' — consecutive wins climb the
 * trail (×1 ×2 ×3 ×5 ×8 ×12); 3+ Midnight Racer scatters award 8 free spins
 * where the trail steps up every spin (engine-driven).
 *
 * Math notes (ways games): pays are multipliers of TOTAL BET per way, and
 * the engine divides by WAYS_BET_DIVISOR (10) per way. Tuned by Monte-Carlo
 * simulation of the engine math: ~95.4% RTP (label 95.5), ~2.4% free-spin
 * trigger rate, high-volatility profile with ~48% of RTP in the feature.
 */

import type { SlotModule, SymbolDef } from '../../engine/types'
import { NEON_ART } from './art'
import './skin.css'

/* ------------------------------------------------------------------ meta */

const meta: SlotModule['meta'] = {
  id: 'neon-nights',
  title: 'Neon Nights',
  tagline: 'Cruise the midnight strip — every win cranks the multiplier', // 60 chars
  rtp: 95.5,
  volatility: 'high',
  minBet: 1,
  maxBet: 500,
  reels: 5,
  rows: 3,
  paylines: 0, // 243 ways — config.paylines omitted
  bonus: {
    type: 'multiplier-trail',
    triggerScatters: 3,
    awardSpins: 8,
    label: 'Midnight Multiplier Trail',
    description:
      'Every consecutive win climbs the multiplier trail: ×1 ×2 ×3 ×5 ×8 ×12. ' +
      'Land 3 or more Midnight Racer scatters to win 8 free spins where the ' +
      'trail steps up on every spin and never resets.'
  },
  palette: {
    primary: '#ff2fb3', // hot magenta
    secondary: '#22e5ff', // electric cyan
    bg: '#0a0412', // midnight black
    accent: '#b537f2' // ultraviolet
  },
  iconEmoji: '🌆',
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
    name: 'Neon Sunset',
    kind: 'wild',
    render: (size) => NEON_ART.wild({ size }),
    weight: 2,
    pays: { 3: 4, 4: 12, 5: 50 }
  },
  {
    id: 'scatter',
    name: 'Midnight Racer',
    kind: 'scatter',
    render: (size) => NEON_ART.scatter({ size }),
    weight: 4,
    pays: { 3: 2, 4: 8, 5: 25 } // scatter pays ANYWHERE
  },
  {
    id: 'h1',
    name: 'Neon Flamingo',
    kind: 'high',
    render: (size) => NEON_ART.h1({ size }),
    weight: 5,
    pays: { 3: 3, 4: 9.5, 5: 37 }
  },
  {
    id: 'h2',
    name: 'Neon Cocktail',
    kind: 'high',
    render: (size) => NEON_ART.h2({ size }),
    weight: 6,
    pays: { 3: 2.2, 4: 6.5, 5: 26 }
  },
  {
    id: 'h3',
    name: 'Chrome Cassette',
    kind: 'high',
    render: (size) => NEON_ART.h3({ size }),
    weight: 7,
    pays: { 3: 1.9, 4: 5.2, 5: 18.5 }
  },
  {
    id: 'h4',
    name: 'Laser Dice',
    kind: 'high',
    render: (size) => NEON_ART.h4({ size }),
    weight: 8,
    pays: { 3: 1.5, 4: 4.1, 5: 15 }
  },
  {
    id: 'l1',
    name: 'Neon A',
    kind: 'low',
    render: (size) => NEON_ART.l1({ size }),
    weight: 14,
    pays: { 3: 0.55, 4: 1.7, 5: 6 }
  },
  {
    id: 'l2',
    name: 'Neon K',
    kind: 'low',
    render: (size) => NEON_ART.l2({ size }),
    weight: 15,
    pays: { 3: 0.45, 4: 1.5, 5: 5.2 }
  },
  {
    id: 'l3',
    name: 'Neon Q',
    kind: 'low',
    render: (size) => NEON_ART.l3({ size }),
    weight: 16,
    pays: { 3: 0.38, 4: 1.3, 5: 4.5 }
  },
  {
    id: 'l4',
    name: 'Neon J',
    kind: 'low',
    render: (size) => NEON_ART.l4({ size }),
    weight: 17,
    pays: { 3: 0.28, 4: 1.1, 5: 3.8 }
  }
]

/* --------------------------------------------------------------- config */

const config: SlotModule['config'] = {
  meta,
  symbols,
  // NO paylines key — 243-ways evaluation (meta.paylines === 0)
  ambientColor: '#ff2fb3', // magenta neon glow behind the machine
  musicMood: 'dark' // slow synthwave pulse
}

const module_: SlotModule = { meta, config }
export default module_
