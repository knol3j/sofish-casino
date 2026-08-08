/**
 * games/neon-nights/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Neon Nights.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, near-black
 * fills lit by magenta/cyan neon outlines with a violet accent. Every
 * symbol stays recognizable at 48px. No external assets — pure SVG.
 */

import type { CSSProperties, ReactNode } from 'react'

interface ArtProps {
  size: number
}

const svgProps = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 64 64',
  fill: 'none' as const,
  'aria-hidden': true as const,
  style: { display: 'block' } as CSSProperties
})

const S = {
  magenta: '#ff2fb3',
  cyan: '#22e5ff',
  violet: '#b537f2',
  ink: '#14062a', // near-black panel fill
  deepInk: '#0a0412',
  pale: '#ffd7f1',
  paleCyan: '#c9f7ff'
}

/* ---------------------------------------------------------------- WILD */
/** Neon Sunset — striped sun over a chrome grid horizon. */
export function WildSunset({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* sun disc with retro stripe gaps */}
        <circle cx="32" cy="28" r="15" fill={S.ink} stroke={S.magenta} strokeWidth={2.5} />
        <g stroke={S.magenta} strokeWidth={2}>
          <path d="M18.5 24h27" />
          <path d="M17 28h30" />
          <path d="M18.5 32h27" />
          <path d="M21.5 36h21" />
        </g>
        {/* horizon grid */}
        <g stroke={S.cyan} strokeWidth={1.6} opacity={0.9}>
          <path d="M8 46h48" />
          <path d="M12 52h40" />
          <path d="M32 42v12" />
          <path d="M22 42l-4 12" />
          <path d="M42 42l4 12" />
        </g>
        <circle cx="32" cy="28" r="20" stroke={S.violet} strokeWidth={1.2} opacity={0.5} strokeDasharray="2 5" />
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** Midnight Racer — neon street car, 3+ trigger the multiplier trail. */
export function ScatterRacer({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* body */}
        <path
          d="M10 40l4-10c1-2 3-3 5-3h26c2 0 4 1 5 3l4 10v6H10z"
          fill={S.ink}
          stroke={S.cyan}
          strokeWidth={2.5}
        />
        {/* windshield + roof glow */}
        <path d="M22 27l4-8h12l4 8" fill={S.deepInk} stroke={S.magenta} strokeWidth={2.2} />
        {/* headlights */}
        <circle cx="17" cy="37" r="2.4" fill={S.paleCyan} />
        <circle cx="47" cy="37" r="2.4" fill={S.paleCyan} />
        {/* grille */}
        <path d="M26 37h12" stroke={S.violet} strokeWidth={2} />
        {/* wheels */}
        <circle cx="20" cy="47" r="4.5" fill={S.deepInk} stroke={S.magenta} strokeWidth={2.5} />
        <circle cx="44" cy="47" r="4.5" fill={S.deepInk} stroke={S.magenta} strokeWidth={2.5} />
        <circle cx="20" cy="47" r="1.4" fill={S.cyan} />
        <circle cx="44" cy="47" r="1.4" fill={S.cyan} />
        {/* neon underglow */}
        <path d="M8 56h48" stroke={S.magenta} strokeWidth={2.4} opacity={0.85} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Neon Flamingo. */
export function HighFlamingo({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* body */}
        <ellipse cx="30" cy="36" rx="13" ry="9" fill={S.ink} stroke={S.magenta} strokeWidth={2.5} />
        {/* wing */}
        <path d="M22 34c4-3 12-3 16 1" stroke={S.violet} strokeWidth={1.8} />
        {/* S-neck + head */}
        <path
          d="M41 32c4-4 3-9-1-12-3-2-7-2-9 1"
          stroke={S.magenta}
          strokeWidth={2.5}
        />
        <circle cx="33" cy="19" r="4" fill={S.ink} stroke={S.magenta} strokeWidth={2.5} />
        {/* beak */}
        <path d="M29.5 20l-6 3 6 2z" fill={S.cyan} stroke="none" />
        <circle cx="34" cy="18" r="1.1" fill={S.paleCyan} />
        {/* legs */}
        <path d="M28 45v10" stroke={S.cyan} strokeWidth={2.2} />
        <path d="M35 45c0 4-3 5-3 8" stroke={S.cyan} strokeWidth={2.2} opacity={0.7} />
        <path d="M23 56h10" stroke={S.cyan} strokeWidth={2.2} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Neon Cocktail — martini glass with lime. */
export function HighCocktail({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* glass */}
        <path d="M14 14h36L32 36z" fill={S.ink} stroke={S.cyan} strokeWidth={2.5} />
        {/* drink surface */}
        <path d="M20 20h24" stroke={S.magenta} strokeWidth={2.4} />
        <path d="M23 24l9 12 9-12" fill={S.magenta} opacity={0.28} stroke="none" />
        {/* stem + base */}
        <path d="M32 36v12" stroke={S.cyan} strokeWidth={2.5} />
        <path d="M22 50h20" stroke={S.cyan} strokeWidth={2.5} />
        {/* straw */}
        <path d="M40 10l8-6" stroke={S.violet} strokeWidth={2.2} />
        {/* lime wheel */}
        <circle cx="47" cy="18" r="5" fill={S.deepInk} stroke={S.magenta} strokeWidth={2.2} />
        <path d="M47 14v8M43 18h8" stroke={S.magenta} strokeWidth={1.4} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Neon Cassette — mixtape. */
export function HighCassette({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <rect x="10" y="18" width="44" height="30" rx="4" fill={S.ink} stroke={S.violet} strokeWidth={2.5} />
        {/* window */}
        <rect x="16" y="24" width="32" height="12" rx="3" fill={S.deepInk} stroke={S.cyan} strokeWidth={2} />
        {/* reels */}
        <circle cx="25" cy="30" r="3.6" fill="none" stroke={S.magenta} strokeWidth={2} />
        <circle cx="39" cy="30" r="3.6" fill="none" stroke={S.magenta} strokeWidth={2} />
        <circle cx="25" cy="30" r="1" fill={S.magenta} />
        <circle cx="39" cy="30" r="1" fill={S.magenta} />
        {/* tape path */}
        <path d="M25 33.6c3 2 11 2 14 0" stroke={S.pale} strokeWidth={1.4} opacity={0.8} />
        {/* label + screws */}
        <path d="M16 42h32" stroke={S.cyan} strokeWidth={1.8} opacity={0.8} />
        <circle cx="14" cy="22" r="1.2" fill={S.cyan} />
        <circle cx="50" cy="22" r="1.2" fill={S.cyan} />
        <circle cx="14" cy="44" r="1.2" fill={S.cyan} />
        <circle cx="50" cy="44" r="1.2" fill={S.cyan} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Laser Dice — hot-pink die. */
export function HighDice({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="12" width="40" height="40" rx="8" fill={S.ink} stroke={S.magenta} strokeWidth={2.5} />
        <rect
          x="16"
          y="16"
          width="32"
          height="32"
          rx="6"
          fill="none"
          stroke={S.violet}
          strokeWidth={1.2}
          opacity={0.6}
          strokeDasharray="2 4"
        />
        {/* pips: five */}
        <g fill={S.cyan}>
          <circle cx="23" cy="23" r="3.2" />
          <circle cx="41" cy="23" r="3.2" />
          <circle cx="32" cy="32" r="3.2" />
          <circle cx="23" cy="41" r="3.2" />
          <circle cx="41" cy="41" r="3.2" />
        </g>
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol: letter on a neon tube sign. */
function LowSign({ size, letter, tint }: ArtProps & { letter: string; tint: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <rect x="13" y="13" width="38" height="38" rx="9" fill={S.deepInk} stroke={tint} strokeWidth={2.5} />
      <rect
        x="17"
        y="17"
        width="30"
        height="30"
        rx="7"
        fill="none"
        stroke={tint}
        strokeWidth={1}
        opacity={0.4}
        strokeDasharray="2 4"
      />
      <circle cx="20" cy="19" r="3" fill="#fff" opacity={0.14} />
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontFamily="'Arial Black', 'Segoe UI', sans-serif"
        fontWeight="900"
        fontSize="26"
        fill={tint}
      >
        {letter}
      </text>
    </svg>
  )
}

export function LowA({ size }: ArtProps): ReactNode {
  return <LowSign size={size} letter="A" tint={S.magenta} />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowSign size={size} letter="K" tint={S.cyan} />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowSign size={size} letter="Q" tint={S.violet} />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowSign size={size} letter="J" tint={S.pale} />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const NEON_ART = {
  wild: WildSunset,
  scatter: ScatterRacer,
  h1: HighFlamingo,
  h2: HighCocktail,
  h3: HighCassette,
  h4: HighDice,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
