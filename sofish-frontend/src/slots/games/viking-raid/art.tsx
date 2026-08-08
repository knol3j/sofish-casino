/**
 * games/viking-raid/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Viking Raid.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, storm-slate
 * fills with steel-blue highlights and fire-orange accents — a longship
 * cutting through a North Sea gale. Recognizable at 48px. Pure SVG.
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
  // shared palette shorthand — steel blue / storm / orange
  steel: '#7fa3c4',
  deepSteel: '#3e5f7e',
  storm: '#2b3644',
  darkStorm: '#1a212b',
  orange: '#ff8c3a',
  ember: '#ffc46b',
  bone: '#e8e2d4',
  iron: '#9aa7b2',
  wood: '#8a6a4a'
}

/* ---------------------------------------------------------------- WILD */
/** Odin's Raven — substitutes for every symbol except the Battle Horn. */
export function WildRaven({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* spread wings */}
        <path d="M30 30C22 22 12 18 4 20c4 2 6 4 7 7-4 0-6-1-8-2 3 4 8 7 14 8-3 1-6 1-9 0 5 4 12 5 20 3z" fill={S.darkStorm} stroke={S.steel} strokeWidth={2.2} />
        <path d="M34 30c8-8 18-12 26-10-4 2-6 4-7 7 4 0 6-1 8-2-3 4-8 7-14 8 3 1 6 1 9 0-5 4-12 5-20 3z" fill={S.darkStorm} stroke={S.steel} strokeWidth={2.2} />
        {/* body */}
        <path d="M32 26c5 0 8 5 8 12s-3 14-8 18c-5-4-8-11-8-18s3-12 8-12z" fill={S.storm} stroke={S.steel} strokeWidth={2.5} />
        {/* head + beak */}
        <circle cx="32" cy="20" r="6.5" fill={S.storm} stroke={S.steel} strokeWidth={2.2} />
        <path d="M36 20l9 3-9 3z" fill={S.orange} stroke={S.darkStorm} strokeWidth={1.6} />
        <circle cx="33.5" cy="18.5" r="1.6" fill={S.ember} />
        {/* tail */}
        <path d="M32 56l-4 5M32 56v6M32 56l4 5" stroke={S.steel} strokeWidth={2} />
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** Battle Horn — 3+ anywhere sound the Raid Free Spins. */
export function ScatterHorn({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* horn body */}
        <path d="M10 44c0-14 12-24 28-24 8 0 14 3 16 8 2 6-2 12-10 14-10 3-20 8-24 16-6-2-10-7-10-14z" fill={S.bone} stroke={S.deepSteel} strokeWidth={2.5} />
        {/* mouthpiece + rim bands */}
        <path d="M10 44c0-3 1-6 3-8l6 5c-2 2-3 5-3 8z" fill={S.iron} stroke={S.deepSteel} strokeWidth={2} />
        <path d="M44 22c4 1 7 3 8 6M40 40c4-1 8-3 10-6" stroke={S.orange} strokeWidth={2.2} fill="none" />
        {/* carved bands */}
        <path d="M22 34c6-4 14-6 22-6" stroke={S.deepSteel} strokeWidth={1.6} fill="none" opacity={0.8} />
        {/* sound waves */}
        <path d="M54 14c3 2 5 5 5 9M58 10c4 3 7 7 7 13" stroke={S.ember} strokeWidth={2.2} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Viking warrior — braided beard and iron helm. */
export function HighWarrior({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* helm */}
        <path d="M18 24c0-8 6-14 14-14s14 6 14 14v4H18z" fill={S.iron} stroke={S.darkStorm} strokeWidth={2.5} />
        <path d="M32 6v12" stroke={S.darkStorm} strokeWidth={2} />
        <circle cx="32" cy="8" r="2.4" fill={S.orange} stroke={S.darkStorm} strokeWidth={1.4} />
        {/* nasal guard */}
        <path d="M30 24h4v8h-4z" fill={S.iron} stroke={S.darkStorm} strokeWidth={1.6} />
        {/* face */}
        <path d="M22 28h20v8c0 5-4 8-10 8s-10-3-10-8z" fill={S.ember} stroke={S.darkStorm} strokeWidth={2.2} />
        {/* eyes */}
        <path d="M25 32h4M35 32h4" stroke={S.darkStorm} strokeWidth={2.4} />
        {/* braided beard */}
        <path d="M22 38c0 8 4 16 10 18 6-2 10-10 10-18-3 2-6 3-10 3s-7-1-10-3z" fill={S.orange} stroke={S.darkStorm} strokeWidth={2} />
        <path d="M28 46l4 4 4-4M32 50v6" stroke={S.darkStorm} strokeWidth={1.6} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Valkyrie — winged helm and spear. */
export function HighValkyrie({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* winged helm */}
        <path d="M22 20c-5-4-10-5-15-4 3 1 5 3 6 5-3 0-5-1-7-2 3 4 8 6 14 5z" fill={S.bone} stroke={S.deepSteel} strokeWidth={1.8} />
        <path d="M42 20c5-4 10-5 15-4-3 1-5 3-6 5 3 0 5-1 7-2-3 4-8 6-14 5z" fill={S.bone} stroke={S.deepSteel} strokeWidth={1.8} />
        <path d="M20 24c0-7 5-12 12-12s12 5 12 12v3H20z" fill={S.steel} stroke={S.darkStorm} strokeWidth={2.4} />
        {/* face */}
        <path d="M23 27h18v7c0 5-4 9-9 9s-9-4-9-9z" fill={S.ember} stroke={S.darkStorm} strokeWidth={2.2} />
        <path d="M26 31h4M34 31h4" stroke={S.darkStorm} strokeWidth={2.2} />
        {/* hair braids */}
        <path d="M22 34c-1 5-1 9 1 13M42 34c1 5 1 9-1 13" stroke={S.orange} strokeWidth={2.4} fill="none" />
        {/* spear */}
        <path d="M50 8v46" stroke={S.iron} strokeWidth={2.2} />
        <path d="M50 4l-4 8h8z" fill={S.steel} stroke={S.darkStorm} strokeWidth={1.8} />
        {/* gorget */}
        <path d="M26 46c2 2 4 3 6 3s4-1 6-3" stroke={S.steel} strokeWidth={2.2} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Longship under full sail. */
export function HighLongship({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* mast + striped sail */}
        <path d="M32 8v20" stroke={S.darkStorm} strokeWidth={2.2} />
        <path d="M16 12h32v16H16z" fill={S.bone} stroke={S.darkStorm} strokeWidth={2.2} />
        <path d="M22 12v16M28 12v16M36 12v16M42 12v16" stroke={S.orange} strokeWidth={2.4} />
        {/* hull */}
        <path d="M8 36c4 8 12 12 24 12s20-4 24-12l4-8c-4 3-8 4-12 4H16c-4 0-8-1-12-4z" fill={S.deepSteel} stroke={S.darkStorm} strokeWidth={2.5} />
        {/* dragon prow */}
        <path d="M8 28c-2-5 0-9 4-11-1 3 0 5 2 6z" fill={S.orange} stroke={S.darkStorm} strokeWidth={1.8} />
        {/* shields along the gunwale */}
        <circle cx="18" cy="39" r="3.4" fill={S.orange} stroke={S.darkStorm} strokeWidth={1.6} />
        <circle cx="27" cy="41" r="3.4" fill={S.steel} stroke={S.darkStorm} strokeWidth={1.6} />
        <circle cx="37" cy="41" r="3.4" fill={S.orange} stroke={S.darkStorm} strokeWidth={1.6} />
        <circle cx="46" cy="39" r="3.4" fill={S.steel} stroke={S.darkStorm} strokeWidth={1.6} />
        {/* waves */}
        <path d="M8 54c4-3 8-3 12 0s8 3 12 0 8-3 12 0 8-3 12 0" stroke={S.steel} strokeWidth={2.2} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Bearded battle axe. */
export function HighAxe({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* haft */}
        <path d="M40 8L22 56" stroke={S.wood} strokeWidth={4} />
        <path d="M40 8L22 56" stroke={S.darkStorm} strokeWidth={1.2} opacity={0.5} />
        {/* axe head — broad bearded blade */}
        <path d="M36 10c8-2 16 0 20 6-2 1-4 3-5 5 2 1 4 1 6 0-4 7-12 11-21 10l-4-8z" fill={S.iron} stroke={S.darkStorm} strokeWidth={2.4} />
        {/* cutting edge highlight */}
        <path d="M52 15c2 2 3 4 3 6-3 5-9 8-15 8" stroke={S.bone} strokeWidth={1.8} fill="none" />
        {/* rune etching */}
        <path d="M42 16l3 4-4 2" stroke={S.orange} strokeWidth={1.8} fill="none" />
        {/* pommel wrap */}
        <path d="M20 52l6 4" stroke={S.orange} strokeWidth={3} />
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol badge: letter carved on a storm-gray runestone. */
function LowRunestone({ size, letter, tint }: ArtProps & { letter: string; tint: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <path
        d="M32 6l16 10v32l-16 10-16-10V16z"
        fill={S.storm}
        stroke={tint}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M32 11l12 8v26l-12 8-12-8V19z"
        fill="none"
        stroke={tint}
        strokeWidth={1}
        opacity={0.35}
        strokeDasharray="2 4"
      />
      <path d="M23 17c3-2 6-3 9-3" stroke="#fff" strokeWidth={2} opacity={0.12} strokeLinecap="round" fill="none" />
      <text x="32" y="42" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="26" fill={tint}>
        {letter}
      </text>
    </svg>
  )
}

export function LowA({ size }: ArtProps): ReactNode {
  return <LowRunestone size={size} letter="A" tint={S.steel} />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowRunestone size={size} letter="K" tint={S.bone} />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowRunestone size={size} letter="Q" tint={S.ember} />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowRunestone size={size} letter="J" tint={S.orange} />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const VIKING_ART = {
  wild: WildRaven,
  scatter: ScatterHorn,
  h1: HighWarrior,
  h2: HighValkyrie,
  h3: HighLongship,
  h4: HighAxe,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
