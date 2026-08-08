/**
 * games/candy-burst/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Candy Burst.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, soft pastel
 * finish — bubblegum pink, mint, cream and lavender with white sugar-gloss
 * highlights. Legible at 48px. No external assets.
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
  pink: '#ff8fab',
  deepPink: '#e0567f',
  mint: '#7fe0c3',
  deepMint: '#2f9e7f',
  cream: '#fff6ec',
  lavender: '#c9aef2',
  deepLavender: '#8f6cc9',
  lemon: '#ffe08a',
  choco: '#8b5e34'
}

/* ---------------------------------------------------------------- WILD */
/** Rainbow Swirl Lollipop — substitutes for every symbol except the Gumball. */
export function WildLollipop({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* stick */}
        <path d="M32 40v16" stroke={S.cream} strokeWidth={4} />
        <path d="M32 40v16" stroke={S.deepPink} strokeWidth={1.2} opacity={0.4} />
        {/* candy disc */}
        <circle cx="32" cy="24" r="19" fill={S.pink} stroke={S.deepPink} strokeWidth={2.5} />
        {/* swirl */}
        <path
          d="M32 24c0-6 6-8 10-5M32 24c6 0 8 6 5 10M32 24c0 6-6 8-10 5M32 24c-6 0-8-6-5-10"
          stroke={S.mint}
          strokeWidth={4}
          fill="none"
        />
        <path
          d="M32 24c2-9 12-12 17-7M32 24c9 2 12 12 7 17M32 24c-2 9-12 12-17 7M32 24c-9-2-12-12-7-17"
          stroke={S.cream}
          strokeWidth={2.2}
          fill="none"
          opacity={0.9}
        />
        <circle cx="32" cy="24" r="3" fill={S.cream} />
        {/* gloss */}
        <ellipse cx="24" cy="15" rx="5" ry="3" fill="#fff" opacity={0.55} transform="rotate(-30 24 15)" />
        {/* WILD tag */}
        <rect x="20" y="50" width="24" height="10" rx="4" fill={S.deepPink} stroke={S.cream} strokeWidth={1.6} />
        <text x="32" y="58" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="7.5" fill={S.cream} letterSpacing="1.5">
          WILD
        </text>
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** Gumball Machine — 3+ anywhere trigger Sugar Rush Free Spins. */
export function ScatterGumball({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* globe */}
        <circle cx="32" cy="24" r="16" fill={S.cream} stroke={S.deepPink} strokeWidth={2.5} />
        {/* gumballs */}
        <g strokeWidth={1.4}>
          <circle cx="24" cy="20" r="3.4" fill={S.pink} stroke={S.deepPink} />
          <circle cx="33" cy="16" r="3.4" fill={S.mint} stroke={S.deepMint} />
          <circle cx="40" cy="22" r="3.4" fill={S.lavender} stroke={S.deepLavender} />
          <circle cx="27" cy="29" r="3.4" fill={S.lemon} stroke="#c9a227" />
          <circle cx="37" cy="30" r="3.4" fill={S.pink} stroke={S.deepPink} />
        </g>
        {/* globe gloss */}
        <ellipse cx="24" cy="15" rx="5" ry="3" fill="#fff" opacity={0.6} transform="rotate(-25 24 15)" />
        {/* cap */}
        <path d="M24 10h16l-2-5H26z" fill={S.deepPink} stroke={S.deepPink} strokeWidth={2} />
        {/* base + chute */}
        <path d="M22 40h20l3 14H19z" fill={S.pink} stroke={S.deepPink} strokeWidth={2.5} />
        <rect x="27" y="44" width="10" height="6" rx="2" fill={S.cream} stroke={S.deepPink} strokeWidth={1.8} />
        <circle cx="32" cy="47" r="1.8" fill={S.mint} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Frosted Cupcake. */
export function HighCupcake({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* frosting swirl */}
        <path
          d="M18 32c-3-4 0-8 4-9 0-5 4-9 10-9s10 4 10 9c4 1 7 5 4 9z"
          fill={S.cream}
          stroke={S.pink}
          strokeWidth={2.5}
        />
        <path d="M24 24c2-3 5-4 8-4s6 1 8 4" stroke={S.pink} strokeWidth={1.8} fill="none" opacity={0.8} />
        {/* cherry on top */}
        <circle cx="32" cy="12" r="3.6" fill={S.deepPink} stroke={S.pink} strokeWidth={1.6} />
        <path d="M33 9c1-2 3-3 4-3" stroke={S.deepMint} strokeWidth={1.6} fill="none" />
        {/* wrapper */}
        <path d="M18 32h28l-4 18H22z" fill={S.pink} stroke={S.deepPink} strokeWidth={2.5} />
        <g stroke={S.deepPink} strokeWidth={1.6} opacity={0.8}>
          <path d="M25 33l-1 16M32 33v16M39 33l1 16" />
        </g>
        {/* sprinkles */}
        <g strokeWidth={2}>
          <path d="M26 21l2 1.5" stroke={S.mint} />
          <path d="M35 19l2-1" stroke={S.deepLavender} />
          <path d="M39 25l2 1.5" stroke="#c9a227" />
        </g>
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Sugar Strawberry. */
export function HighStrawberry({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* body */}
        <path
          d="M32 54c-8-4-16-12-16-22 0-7 6-12 16-12s16 5 16 12c0 10-8 18-16 22z"
          fill={S.pink}
          stroke={S.deepPink}
          strokeWidth={2.5}
        />
        {/* leaves */}
        <path
          d="M32 20c-3-4-9-5-13-3 2 3 5 5 8 5M32 20c3-4 9-5 13-3-2 3-5 5-8 5M32 20v-5"
          stroke={S.deepMint}
          strokeWidth={2.4}
          fill="none"
        />
        {/* seeds */}
        <g fill={S.cream}>
          <ellipse cx="25" cy="30" rx="1.4" ry="2" />
          <ellipse cx="33" cy="28" rx="1.4" ry="2" />
          <ellipse cx="41" cy="30" rx="1.4" ry="2" />
          <ellipse cx="28" cy="39" rx="1.4" ry="2" />
          <ellipse cx="37" cy="39" rx="1.4" ry="2" />
          <ellipse cx="32" cy="46" rx="1.4" ry="2" />
        </g>
        {/* gloss */}
        <path d="M22 28c1-3 3-5 6-6" stroke="#fff" strokeWidth={2.2} opacity={0.65} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Jelly Bean. */
export function HighJellyBean({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* bean body */}
        <path
          d="M14 36c-3-8 3-16 12-18 7-2 15 0 19 5 5 6 4 14-2 19-7 6-18 7-25 2-3-2-4-5-4-8z"
          fill={S.mint}
          stroke={S.deepMint}
          strokeWidth={2.5}
        />
        {/* inner dimple */}
        <path d="M22 36c4 3 10 3 15 0" stroke={S.deepMint} strokeWidth={1.8} fill="none" opacity={0.7} />
        {/* sugar sparkle */}
        <g stroke={S.cream} strokeWidth={1.8}>
          <path d="M46 12v5M43.5 14.5h5" />
          <path d="M15 14v4M13 16h4" opacity={0.7} />
        </g>
        {/* gloss */}
        <path d="M22 24c3-3 8-5 12-4" stroke="#fff" strokeWidth={2.4} opacity={0.7} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Peppermint Swirl. */
export function HighPeppermint({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* disc */}
        <circle cx="32" cy="32" r="20" fill={S.cream} stroke={S.deepPink} strokeWidth={2.5} />
        {/* peppermint wedges */}
        <path
          d="M32 32L32 12a20 20 0 0 1 14 8zM32 32l17 12a20 20 0 0 1-14 8zM32 32L18 46a20 20 0 0 1-6-14zM32 32L18 18a20 20 0 0 1 14-6z"
          fill={S.pink}
          opacity={0.9}
        />
        <circle cx="32" cy="32" r="20" fill="none" stroke={S.deepPink} strokeWidth={2.5} />
        <circle cx="32" cy="32" r="4" fill={S.cream} stroke={S.deepPink} strokeWidth={1.8} />
        {/* gloss */}
        <ellipse cx="24" cy="20" rx="6" ry="3.4" fill="#fff" opacity={0.5} transform="rotate(-30 24 20)" />
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol badge: letter on a wrapped candy. */
function LowBadge({ size, letter, tint, deep }: ArtProps & { letter: string; tint: string; deep: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* wrapper twists */}
        <path d="M12 32l-7-6v12z" fill={tint} stroke={deep} strokeWidth={2.2} />
        <path d="M52 32l7-6v12z" fill={tint} stroke={deep} strokeWidth={2.2} />
        {/* candy body */}
        <rect x="12" y="20" width="40" height="24" rx="12" fill={tint} stroke={deep} strokeWidth={2.5} />
        {/* stripes */}
        <path d="M22 20v24M42 20v24" stroke={deep} strokeWidth={1.6} opacity={0.55} />
        {/* gloss */}
        <ellipse cx="26" cy="26" rx="6" ry="3" fill="#fff" opacity={0.45} transform="rotate(-15 26 26)" />
        <text x="32" y="39" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="18" fill={deep}>
          {letter}
        </text>
      </g>
    </svg>
  )
}

export function LowA({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="A" tint={S.lavender} deep={S.deepLavender} />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="K" tint={S.mint} deep={S.deepMint} />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="Q" tint={S.lemon} deep="#c9a227" />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="J" tint={S.pink} deep={S.deepPink} />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const CANDY_ART = {
  wild: WildLollipop,
  scatter: ScatterGumball,
  h1: HighCupcake,
  h2: HighStrawberry,
  h3: HighJellyBean,
  h4: HighPeppermint,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
