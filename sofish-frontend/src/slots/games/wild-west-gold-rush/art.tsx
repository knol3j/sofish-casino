/**
 * games/wild-west-gold-rush/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Wild West Gold Rush.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, frontier
 * finish — worn leather browns, desert dust tans, brass/gold hardware,
 * cream highlights. Legible at 48px. No external assets.
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
  leather: '#8b5e34',
  darkLeather: '#5a3a1e',
  dust: '#d9b380',
  brass: '#d4af37',
  deepBrass: '#9a7b1e',
  wood: '#6b4423',
  cream: '#f5e6c8',
  night: '#2a1a0e'
}

/* ---------------------------------------------------------------- WILD */
/** Sheriff's Star Badge — substitutes for every symbol except the Saloon. */
export function WildSheriff({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* six-point star */}
        <path
          d="M32 8l5.5 9.5L48 15l-2 10.7L56 32l-10 6.3L48 49l-10.5-2.5L32 56l-5.5-9.5L16 49l2-10.7L8 32l10-6.3L16 15l10.5 2.5z"
          fill={S.brass}
          stroke={S.deepBrass}
          strokeWidth={2.5}
        />
        {/* ball tips */}
        <g fill={S.cream} stroke={S.deepBrass} strokeWidth={1.4}>
          <circle cx="32" cy="8" r="2.6" />
          <circle cx="52" cy="20" r="2.6" />
          <circle cx="52" cy="44" r="2.6" />
          <circle cx="32" cy="56" r="2.6" />
          <circle cx="12" cy="44" r="2.6" />
          <circle cx="12" cy="20" r="2.6" />
        </g>
        {/* center medallion */}
        <circle cx="32" cy="32" r="11" fill={S.darkLeather} stroke={S.cream} strokeWidth={2} />
        <text x="32" y="36.5" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="9.5" fill={S.brass} letterSpacing="1">
          WILD
        </text>
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** Saloon Batwing Doors — 3+ anywhere trigger the Saloon Showdown pick-me. */
export function ScatterSaloon({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* doorway glow */}
        <rect x="10" y="10" width="44" height="44" rx="3" fill={S.night} stroke={S.brass} strokeWidth={2.5} />
        <circle cx="32" cy="22" r="6" fill={S.brass} opacity={0.5} />
        {/* left door */}
        <path
          d="M14 24c5 0 9 2 12 5v18c-3-2-7-3-12-3z"
          fill={S.wood}
          stroke={S.dust}
          strokeWidth={2.2}
        />
        {/* right door */}
        <path
          d="M50 24c-5 0-9 2-12 5v18c3-2 7-3 12-3z"
          fill={S.wood}
          stroke={S.dust}
          strokeWidth={2.2}
        />
        {/* slats */}
        <g stroke={S.dust} strokeWidth={1.4} opacity={0.85}>
          <path d="M16 30c3 0 5 .8 7 2M16 36c3 0 5 .6 7 1.6M48 30c-3 0-5 .8-7 2M48 36c-3 0-5 .6-7 1.6" />
        </g>
        {/* SCATTER plaque */}
        <rect x="16" y="12" width="32" height="9" rx="2" fill={S.darkLeather} stroke={S.brass} strokeWidth={1.6} />
        <text x="32" y="19" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="7" fill={S.brass} letterSpacing="1">
          SALOON
        </text>
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Gold Nuggets in a pan. */
export function HighNugget({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* pan */}
        <path d="M8 36h48c-2 9-11 15-24 15S10 45 8 36z" fill={S.darkLeather} stroke={S.dust} strokeWidth={2.5} />
        <path d="M8 36h48" stroke={S.dust} strokeWidth={2.5} />
        {/* nuggets */}
        <path d="M18 33c-2-4 1-8 5-7 3-4 9-3 10 1 4-1 7 2 6 6z" fill={S.brass} stroke={S.deepBrass} strokeWidth={2} />
        <path d="M34 33c0-4 4-7 8-5 3-2 8 0 8 5z" fill={S.brass} stroke={S.deepBrass} strokeWidth={2} />
        {/* sparkle */}
        <g stroke={S.cream} strokeWidth={1.8}>
          <path d="M46 12v6M43 15h6" />
          <path d="M16 14v5M13.5 16.5h5" opacity={0.7} />
        </g>
        {/* water line in pan */}
        <path d="M16 42c5 2 10 3 16 3s11-1 16-3" stroke={S.dust} strokeWidth={1.6} opacity={0.7} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Frontier Revolver. */
export function HighRevolver({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* barrel */}
        <path d="M10 22h30v8H10z" fill={S.brass} stroke={S.deepBrass} strokeWidth={2.5} />
        <path d="M10 22v8" stroke={S.deepBrass} strokeWidth={2.5} />
        {/* muzzle sight */}
        <path d="M10 20v3" stroke={S.deepBrass} strokeWidth={2.2} />
        {/* cylinder */}
        <circle cx="42" cy="26" r="7" fill={S.dust} stroke={S.deepBrass} strokeWidth={2.5} />
        <circle cx="42" cy="26" r="2" fill={S.deepBrass} />
        {/* hammer + trigger */}
        <path d="M47 20c3-2 5-2 6 0" stroke={S.deepBrass} strokeWidth={2.2} fill="none" />
        <path d="M46 33c0 3-2 5-4 5" stroke={S.deepBrass} strokeWidth={2} fill="none" />
        {/* grip */}
        <path d="M44 32l6 14c1 3-1 6-4 6l-8-2c-2-1-3-3-2-5l4-12z" fill={S.leather} stroke={S.darkLeather} strokeWidth={2.5} />
        <path d="M40 38l5 10" stroke={S.darkLeather} strokeWidth={1.6} opacity={0.7} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Cowboy Hat. */
export function HighHat({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* brim */}
        <path
          d="M8 38c6 4 14 6 24 6s18-2 24-6c2 5-4 9-12 10-8 1-16 1-24 0-8-1-14-5-12-10z"
          fill={S.leather}
          stroke={S.darkLeather}
          strokeWidth={2.5}
        />
        {/* crown */}
        <path
          d="M20 38c0-12 4-20 12-20s12 8 12 20c-4 2-8 3-12 3s-8-1-12-3z"
          fill={S.leather}
          stroke={S.darkLeather}
          strokeWidth={2.5}
        />
        {/* crown crease */}
        <path d="M27 20c1-2 3-3 5-3s4 1 5 3" stroke={S.darkLeather} strokeWidth={2} fill="none" />
        {/* band + concho */}
        <path d="M21 33c7 3 15 3 22 0" stroke={S.brass} strokeWidth={3.4} fill="none" />
        <circle cx="32" cy="35" r="2.4" fill={S.brass} stroke={S.deepBrass} strokeWidth={1.2} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Lucky Horseshoe. */
export function HighHorseshoe({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* shoe — open end up for luck */}
        <path
          d="M18 14v14c0 12 6 20 14 20s14-8 14-20V14h-8v14c0 8-3 12-6 12s-6-4-6-12V14z"
          fill={S.brass}
          stroke={S.deepBrass}
          strokeWidth={2.5}
        />
        {/* nail holes */}
        <g fill={S.deepBrass}>
          <circle cx="22" cy="22" r="1.6" />
          <circle cx="22" cy="31" r="1.6" />
          <circle cx="42" cy="22" r="1.6" />
          <circle cx="42" cy="31" r="1.6" />
        </g>
        {/* heel plates */}
        <path d="M14 14h8M42 14h8" stroke={S.deepBrass} strokeWidth={2.5} />
        {/* gloss */}
        <path d="M26 44c2 2 4 3 6 3s4-1 6-3" stroke={S.cream} strokeWidth={1.8} opacity={0.8} fill="none" />
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol badge: letter branded on a wooden plank. */
function LowBadge({ size, letter }: ArtProps & { letter: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      {/* plank */}
      <rect x="10" y="14" width="44" height="36" rx="4" fill={S.wood} stroke={S.darkLeather} strokeWidth={2.5} />
      {/* grain */}
      <g stroke={S.darkLeather} strokeWidth={1.2} opacity={0.6}>
        <path d="M14 22c8 2 28-2 36 1M14 42c10-2 26 2 36-1" fill="none" />
      </g>
      {/* corner nails */}
      <g fill={S.brass}>
        <circle cx="15" cy="19" r="1.6" />
        <circle cx="49" cy="19" r="1.6" />
        <circle cx="15" cy="45" r="1.6" />
        <circle cx="49" cy="45" r="1.6" />
      </g>
      <text x="32" y="41" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="24" fill={S.dust} stroke={S.darkLeather} strokeWidth="0.6">
        {letter}
      </text>
    </svg>
  )
}

export function LowA({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="A" />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="K" />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="Q" />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="J" />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const WEST_ART = {
  wild: WildSheriff,
  scatter: ScatterSaloon,
  h1: HighNugget,
  h2: HighRevolver,
  h3: HighHat,
  h4: HighHorseshoe,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
