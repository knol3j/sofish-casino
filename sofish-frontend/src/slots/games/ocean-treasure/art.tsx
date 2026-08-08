/**
 * games/ocean-treasure/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Ocean Treasure.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, deep-teal
 * fills with aqua highlights and gold accents. Every symbol stays
 * recognizable at 48px. No external assets — pure SVG.
 *
 * GAME AUTHORS: copy this pattern — one component per symbol, consistent
 * stroke/fill treatment, export a record keyed by symbol id.
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
  // shared palette shorthand
  gold: '#f5c453',
  aqua: '#5fd4d0',
  teal: '#0f6e7e',
  deepTeal: '#0b4453',
  foam: '#bfeeea',
  coral: '#ff8a7a',
  pearl: '#f3e9ff'
}

/* ---------------------------------------------------------------- WILD */
/** Golden Trident — substitutes for every symbol except the Kraken. */
export function WildTrident({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g stroke={S.gold} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        {/* center shaft */}
        <path d="M32 14v36" />
        {/* three prongs */}
        <path d="M32 14c0-5 2-7 2-9" fill={S.gold} />
        <path d="M20 12v8c0 7 5 10 12 10" />
        <path d="M44 12v8c0 7-5 10-12 10" />
        <path d="M20 12l-2 4 4-1z" fill={S.gold} stroke="none" />
        <path d="M44 12l2 4-4-1z" fill={S.gold} stroke="none" />
        <path d="M32 5l-2.5 5h5z" fill={S.gold} stroke="none" />
        {/* grip + pommel */}
        <path d="M26 50h12" />
        <circle cx="32" cy="54" r="3" fill={S.gold} stroke="none" />
      </g>
      <circle cx="32" cy="32" r="26" stroke={S.gold} strokeWidth={1.4} opacity={0.45} strokeDasharray="3 5" />
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** The Kraken — 3+ anywhere trigger Kraken Free Spins. */
export function ScatterKraken({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* mantle */}
        <path
          d="M32 8c9 0 15 7 15 16 0 6-3 9-5 11H22c-2-2-5-5-5-11 0-9 6-16 15-16z"
          fill={S.deepTeal}
          stroke={S.aqua}
          strokeWidth={2.5}
        />
        {/* eyes */}
        <circle cx="26" cy="22" r="3" fill={S.foam} />
        <circle cx="38" cy="22" r="3" fill={S.foam} />
        <circle cx="26" cy="22" r="1.3" fill="#062a33" />
        <circle cx="38" cy="22" r="1.3" fill="#062a33" />
        {/* tentacles */}
        <g stroke={S.aqua} strokeWidth={2.5} fill="none">
          <path d="M22 35c-4 2-6 6-5 11" />
          <path d="M27 36c-2 3-3 8-1 13" />
          <path d="M32 37v14" />
          <path d="M37 36c2 3 3 8 1 13" />
          <path d="M42 35c4 2 6 6 5 11" />
        </g>
        {/* suction cups */}
        <g fill={S.gold}>
          <circle cx="18" cy="42" r="1.4" />
          <circle cx="26" cy="44" r="1.4" />
          <circle cx="32" cy="46" r="1.4" />
          <circle cx="38" cy="44" r="1.4" />
          <circle cx="46" cy="42" r="1.4" />
        </g>
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Treasure Chest bursting with gold. */
export function HighChest({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* lid open */}
        <path d="M14 26c0-8 8-13 18-13s18 5 18 13l-4 2H18z" fill={S.teal} stroke={S.gold} strokeWidth={2.5} />
        {/* gold spill */}
        <path d="M18 28h28v6H18z" fill={S.gold} opacity={0.9} />
        <circle cx="24" cy="31" r="2" fill="#ffe9a8" />
        <circle cx="33" cy="30" r="2" fill="#ffe9a8" />
        <circle cx="41" cy="31" r="2" fill="#ffe9a8" />
        {/* body */}
        <path d="M16 34h32v14c0 3-2 5-5 5H21c-3 0-5-2-5-5z" fill={S.deepTeal} stroke={S.gold} strokeWidth={2.5} />
        {/* bands + lock */}
        <path d="M24 34v19M40 34v19" stroke={S.gold} strokeWidth={2} />
        <rect x="28" y="38" width="8" height="9" rx="2" fill={S.gold} />
        <circle cx="32" cy="42" r="1.6" fill="#5a3d0e" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Pearl in an open shell. */
export function HighPearl({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* shell fan */}
        <path
          d="M32 52C20 52 12 44 12 34c4-8 11-16 20-20 9 4 16 12 20 20 0 10-8 18-20 18z"
          fill={S.teal}
          stroke={S.aqua}
          strokeWidth={2.5}
        />
        <path
          d="M32 52V16M22 50c-2-10-2-20 3-28M42 50c2-10 2-20-3-28"
          stroke={S.aqua}
          strokeWidth={1.6}
          opacity={0.7}
          fill="none"
        />
        {/* pearl */}
        <circle cx="32" cy="36" r="9" fill={S.pearl} stroke="#cbb7ea" strokeWidth={1.6} />
        <circle cx="29" cy="33" r="2.4" fill="#fff" opacity={0.9} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Ship's Helm. */
export function HighHelm({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g stroke={S.gold} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <circle cx="32" cy="32" r="17" />
        <circle cx="32" cy="32" r="24" opacity={0.5} strokeWidth={1.4} />
        {Array.from({ length: 8 }, (_, i) => {
          const a = (i * Math.PI) / 4
          const x1 = 32 + Math.cos(a) * 17
          const y1 = 32 + Math.sin(a) * 17
          const x2 = 32 + Math.cos(a) * 26
          const y2 = 32 + Math.sin(a) * 26
          return <path key={i} d={`M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`} />
        })}
        <circle cx="32" cy="32" r="6" fill={S.gold} stroke="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Sea Turtle. */
export function HighTurtle({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* flippers */}
        <path d="M16 24c-4-2-7-1-9 2 3 2 7 3 10 2z" fill={S.aqua} />
        <path d="M48 24c4-2 7-1 9 2-3 2-7 3-10 2z" fill={S.aqua} />
        <path d="M18 44c-3 2-4 5-3 8 3 0 6-2 8-5z" fill={S.aqua} />
        <path d="M46 44c3 2 4 5 3 8-3 0-6-2-8-5z" fill={S.aqua} />
        {/* head */}
        <circle cx="32" cy="14" r="6" fill={S.aqua} />
        <circle cx="30" cy="13" r="1.2" fill="#062a33" />
        <circle cx="34" cy="13" r="1.2" fill="#062a33" />
        {/* shell */}
        <ellipse cx="32" cy="34" rx="16" ry="15" fill={S.teal} stroke={S.foam} strokeWidth={2.5} />
        <path
          d="M32 22v24M20 30c4 3 8 4 12 4s8-1 12-4M22 42c3 2 6 3 10 3s7-1 10-3"
          stroke={S.foam}
          strokeWidth={1.6}
          fill="none"
          opacity={0.85}
        />
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol badge: letter on a bubble-gem. */
function LowBadge({ size, letter, tint }: ArtProps & { letter: string; tint: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <circle cx="32" cy="32" r="22" fill={S.deepTeal} stroke={tint} strokeWidth={2.5} />
      <circle
        cx="32"
        cy="32"
        r="22"
        fill="none"
        stroke={tint}
        strokeWidth={1}
        opacity={0.4}
        strokeDasharray="2 4"
        transform="rotate(15 32 32)"
      />
      <circle cx="24" cy="22" r="4" fill="#fff" opacity={0.18} />
      <text x="32" y="41" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="26" fill={tint}>
        {letter}
      </text>
    </svg>
  )
}

export function LowA({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="A" tint={S.foam} />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="K" tint={S.aqua} />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="Q" tint="#8fd8a0" />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="J" tint={S.coral} />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const OCEAN_ART = {
  wild: WildTrident,
  scatter: ScatterKraken,
  h1: HighChest,
  h2: HighPearl,
  h3: HighHelm,
  h4: HighTurtle,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
