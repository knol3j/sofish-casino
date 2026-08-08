/**
 * games/fruit-frenzy-deluxe/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Fruit Frenzy Deluxe.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, glossy
 * classic-casino finish — deep red felt, glossy greens, gold trim, white
 * specular highlights on every fruit. Legible at 48px. No external assets.
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
  red: '#e63946',
  deepRed: '#a4133c',
  green: '#57cc5b',
  deepGreen: '#1e6b2f',
  gold: '#ffd166',
  cream: '#fff3e0',
  orange: '#ff9f43',
  lemon: '#ffe45c'
}

/* ---------------------------------------------------------------- WILD */
/** Lucky Frenzy Seven — substitutes for every symbol except the Bell. */
export function WildSeven({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* starburst behind the seven */}
        <g stroke={S.gold} strokeWidth={1.6} opacity={0.7}>
          <path d="M32 4v7M32 53v7M4 32h7M53 32h7M12 12l5 5M47 47l5 5M52 12l-5 5M17 47l-5 5" />
        </g>
        {/* the seven */}
        <path
          d="M18 14h28l-4 10c-7 6-11 15-12 26H22c1-10 5-19 11-25H18z"
          fill={S.red}
          stroke={S.gold}
          strokeWidth={2.5}
        />
        <path d="M22 18h16" stroke={S.cream} strokeWidth={2} opacity={0.8} />
        {/* WILD ribbon */}
        <rect x="12" y="42" width="40" height="12" rx="4" fill={S.deepGreen} stroke={S.gold} strokeWidth={1.8} />
        <text x="32" y="51.5" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="9" fill={S.gold} letterSpacing="1.5">
          WILD
        </text>
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** Golden Liberty Bell — 3+ anywhere pay; 2 award a respin. */
export function ScatterBell({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* clapper swing marks */}
        <path d="M12 22c-2 3-2 6 0 9M52 22c2 3 2 6 0 9" stroke={S.gold} strokeWidth={1.6} opacity={0.6} />
        {/* bell body */}
        <path
          d="M32 10c-9 0-14 7-14 16 0 8-3 12-6 14h40c-3-2-6-6-6-14 0-9-5-16-14-16z"
          fill={S.gold}
          stroke={S.deepRed}
          strokeWidth={2.5}
        />
        {/* gloss */}
        <path d="M25 16c-3 2-5 6-5 10" stroke={S.cream} strokeWidth={2.4} opacity={0.85} fill="none" />
        {/* crown loop */}
        <path d="M28 10c0-4 8-4 8 0" stroke={S.deepRed} strokeWidth={2.5} fill="none" />
        {/* mouth + clapper */}
        <path d="M12 40h40" stroke={S.deepRed} strokeWidth={2.5} />
        <circle cx="32" cy="47" r="4.5" fill={S.deepRed} stroke={S.gold} strokeWidth={1.8} />
        {/* crack — liberty bell */}
        <path d="M34 22l-2 5 3 4-2 5" stroke={S.deepRed} strokeWidth={1.6} fill="none" opacity={0.8} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Twin Cherries on a shared stem. */
export function HighCherry({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* stems */}
        <path d="M24 30c2-10 8-16 16-20M40 34c0-8 0-14 0-20" stroke={S.deepGreen} strokeWidth={2.5} fill="none" />
        {/* leaf */}
        <path d="M40 10c6-4 12-3 14 1-4 4-11 4-14-1z" fill={S.green} stroke={S.deepGreen} strokeWidth={2} />
        {/* cherries */}
        <circle cx="24" cy="40" r="12" fill={S.red} stroke={S.deepRed} strokeWidth={2.5} />
        <circle cx="42" cy="42" r="11" fill={S.deepRed} stroke={S.red} strokeWidth={2.5} />
        {/* gloss */}
        <ellipse cx="20" cy="35" rx="3.5" ry="2.4" fill="#fff" opacity={0.75} transform="rotate(-25 20 35)" />
        <ellipse cx="38" cy="37.5" rx="3" ry="2" fill="#fff" opacity={0.6} transform="rotate(-25 38 37.5)" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Watermelon slice. */
export function HighMelon({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* wedge */}
        <path d="M10 22h44c0 16-9 26-22 26S10 38 10 22z" fill={S.red} stroke={S.deepRed} strokeWidth={2} />
        {/* rind */}
        <path
          d="M10 22h44c0 16-9 26-22 26S10 38 10 22z"
          fill="none"
          stroke={S.green}
          strokeWidth={5}
          strokeDasharray="0"
          opacity={0.95}
          clipPath="none"
        />
        <path d="M10 22h44c0 16-9 26-22 26S10 38 10 22z" fill="none" stroke={S.deepGreen} strokeWidth={2.5} />
        {/* face of the slice */}
        <path d="M15 22h34c0 12-7 20-17 20S15 34 15 22z" fill={S.red} stroke="none" />
        {/* seeds */}
        <g fill={S.deepGreen}>
          <ellipse cx="24" cy="30" rx="1.6" ry="2.4" />
          <ellipse cx="32" cy="33" rx="1.6" ry="2.4" />
          <ellipse cx="40" cy="30" rx="1.6" ry="2.4" />
        </g>
        {/* gloss */}
        <path d="M17 25c4-2 8-3 12-2" stroke="#fff" strokeWidth={2} opacity={0.6} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Orange wheel slice. */
export function HighOrange({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* half wheel */}
        <path d="M10 40a22 22 0 0 1 44 0z" fill={S.orange} stroke="#c96a10" strokeWidth={2.5} />
        {/* segments */}
        <g stroke={S.cream} strokeWidth={2}>
          <path d="M32 40V20" />
          <path d="M32 40L17 27" />
          <path d="M32 40L47 27" />
          <path d="M32 40L12 40" opacity={0} />
        </g>
        <path d="M13 38a19 19 0 0 1 38 0" fill="none" stroke={S.cream} strokeWidth={1.6} opacity={0.8} />
        {/* leaf on top */}
        <path d="M32 16c4-5 10-6 13-4-2 5-8 7-13 4z" fill={S.green} stroke={S.deepGreen} strokeWidth={2} />
        {/* gloss */}
        <path d="M20 26c3-3 7-4 10-4" stroke="#fff" strokeWidth={2} opacity={0.55} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Glossy Lemon. */
export function HighLemon({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* body with pointed tips */}
        <path
          d="M14 32c0-9 8-15 18-15 8 0 14 4 16 9l4-3c2 5 2 13-1 18l-3-3c-3 5-9 8-16 8-10 0-18-6-18-14z"
          fill={S.lemon}
          stroke="#c9a227"
          strokeWidth={2.5}
        />
        {/* dimple texture */}
        <g fill="#c9a227" opacity={0.55}>
          <circle cx="28" cy="30" r="1.3" />
          <circle cx="35" cy="27" r="1.3" />
          <circle cx="40" cy="33" r="1.3" />
          <circle cx="30" cy="37" r="1.3" />
        </g>
        {/* leaf */}
        <path d="M30 16c2-5 8-8 12-7-1 5-6 9-12 7z" fill={S.green} stroke={S.deepGreen} strokeWidth={2} />
        {/* gloss */}
        <path d="M20 27c3-4 8-6 12-6" stroke="#fff" strokeWidth={2.2} opacity={0.7} fill="none" />
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol badge: glossy casino-chip letter. */
function LowBadge({ size, letter, tint, rim }: ArtProps & { letter: string; tint: string; rim: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <circle cx="32" cy="32" r="22" fill={tint} stroke={rim} strokeWidth={2.5} />
      {/* chip notches */}
      <g stroke={rim} strokeWidth={2.5}>
        <path d="M32 10v5M32 49v5M10 32h5M49 32h5" />
      </g>
      <circle cx="32" cy="32" r="15" fill="none" stroke={rim} strokeWidth={1.2} opacity={0.6} />
      {/* gloss */}
      <ellipse cx="24" cy="22" rx="6" ry="4" fill="#fff" opacity={0.35} transform="rotate(-30 24 22)" />
      <text x="32" y="40" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="22" fill={rim}>
        {letter}
      </text>
    </svg>
  )
}

export function LowA({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="A" tint={S.cream} rim={S.deepRed} />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="K" tint={S.cream} rim={S.deepGreen} />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="Q" tint="#ffe9ec" rim={S.red} />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowBadge size={size} letter="J" tint="#e9ffe9" rim={S.green} />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const FRUIT_ART = {
  wild: WildSeven,
  scatter: ScatterBell,
  h1: HighCherry,
  h2: HighMelon,
  h3: HighOrange,
  h4: HighLemon,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
