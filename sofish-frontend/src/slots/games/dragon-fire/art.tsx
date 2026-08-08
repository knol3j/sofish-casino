/**
 * games/dragon-fire/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Dragon Fire.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, charcoal
 * fills with ember highlights and crimson accents — a forge lit by
 * dragon's breath. Every symbol stays recognizable at 48px. Pure SVG.
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
  // shared palette shorthand — crimson / ember / charcoal
  crimson: '#c1272d',
  deepCrimson: '#7d1a20',
  ember: '#ff7a2f',
  flame: '#ffb347',
  charcoal: '#262226',
  darkCoal: '#17151a',
  ash: '#b8adb2',
  steel: '#8e9aa6'
}

/* ---------------------------------------------------------------- WILD */
/** Inferno Wild — a blazing dragon eye. Substitutes for all but the Egg. */
export function WildDragonEye({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* outer flames */}
        <g stroke={S.ember} strokeWidth={2.2} fill="none">
          <path d="M14 18c-3-4-2-8 1-11" />
          <path d="M50 18c3-4 2-8-1-11" />
          <path d="M32 12c0-4 1-7 3-9" />
        </g>
        {/* scaled eye socket */}
        <path d="M8 34c8-12 16-17 24-17s16 5 24 17c-8 12-16 17-24 17S16 46 8 34z" fill={S.deepCrimson} stroke={S.flame} strokeWidth={2.5} />
        {/* iris */}
        <circle cx="32" cy="34" r="10" fill={S.ember} stroke={S.flame} strokeWidth={2} />
        {/* vertical slit pupil */}
        <ellipse cx="32" cy="34" rx="3" ry="8.5" fill={S.darkCoal} />
        <circle cx="29" cy="30" r="1.6" fill={S.flame} />
        {/* scale ticks */}
        <path d="M12 28l4 2M52 28l-4 2M18 22l4 3M46 22l-4 3" stroke={S.flame} strokeWidth={1.6} opacity={0.8} />
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** Dragon Egg — 3+ anywhere trigger Inferno Free Spins. */
export function ScatterEgg({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* nest embers */}
        <path d="M12 54c6-4 34-4 40 0" stroke={S.ember} strokeWidth={2.5} fill="none" />
        <path d="M18 58c4-2 24-2 28 0" stroke={S.flame} strokeWidth={2} fill="none" opacity={0.8} />
        {/* egg */}
        <path d="M32 8c9 0 15 12 15 24 0 10-6 16-15 16s-15-6-15-16c0-12 6-24 15-24z" fill={S.charcoal} stroke={S.crimson} strokeWidth={2.5} />
        {/* cracks glowing from within */}
        <path d="M26 22l4 6-3 5 5 6" stroke={S.flame} strokeWidth={2} fill="none" />
        <path d="M38 26l-3 5 4 5" stroke={S.ember} strokeWidth={1.8} fill="none" />
        {/* scale texture */}
        <path d="M24 40c2 2 5 3 8 3s6-1 8-3" stroke={S.crimson} strokeWidth={1.6} fill="none" opacity={0.8} />
        {/* spark */}
        <circle cx="32" cy="6" r="1.8" fill={S.flame} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Red Dragon head, jaws wreathed in flame. */
export function HighDragon({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* horns */}
        <path d="M20 14L14 4l10 5z" fill={S.ash} stroke={S.flame} strokeWidth={1.8} />
        <path d="M44 14L50 4 40 9z" fill={S.ash} stroke={S.flame} strokeWidth={1.8} />
        {/* head */}
        <path d="M32 10c9 0 15 6 15 14l7 8-8 2c-1 8-7 14-14 14s-13-6-14-14l-8-2 7-8c0-8 6-14 15-14z" fill={S.crimson} stroke={S.flame} strokeWidth={2.5} />
        {/* snout + jaw */}
        <path d="M23 32h18l-9 9z" fill={S.deepCrimson} stroke={S.flame} strokeWidth={1.8} />
        <path d="M26 37l2 3M32 38l0 3M38 37l-2 3" stroke={S.ash} strokeWidth={1.6} />
        {/* eyes */}
        <path d="M23 22l6 2M41 22l-6 2" stroke={S.flame} strokeWidth={2.6} />
        {/* flame breath */}
        <path d="M28 48c-1 4 1 6 4 8 3-2 5-4 4-8" fill={S.ember} stroke={S.flame} strokeWidth={1.6} />
        {/* neck frills */}
        <path d="M16 30l-5 6 6 0M48 30l5 6-6 0" fill={S.deepCrimson} stroke={S.flame} strokeWidth={1.6} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Dragon Knight's helm. */
export function HighKnight({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* plume */}
        <path d="M32 6c6 2 9 6 9 12-3-3-6-4-9-4s-6 1-9 4c0-6 3-10 9-12z" fill={S.crimson} stroke={S.flame} strokeWidth={1.8} />
        {/* helm dome */}
        <path d="M18 32c0-10 6-16 14-16s14 6 14 16v6H18z" fill={S.steel} stroke={S.darkCoal} strokeWidth={2.5} />
        {/* visor slit */}
        <path d="M20 30h24" stroke={S.darkCoal} strokeWidth={3} />
        <path d="M22 30h20" stroke={S.ember} strokeWidth={1.4} />
        {/* face guard */}
        <path d="M22 38h20v10c0 6-4 10-10 10s-10-4-10-10z" fill={S.charcoal} stroke={S.steel} strokeWidth={2.2} />
        <path d="M27 40v10M32 40v12M37 40v10" stroke={S.steel} strokeWidth={1.6} opacity={0.8} />
        {/* rivets */}
        <circle cx="22" cy="24" r="1.4" fill={S.flame} />
        <circle cx="42" cy="24" r="1.4" fill={S.flame} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Castle keep under ember sky. */
export function HighCastle({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* towers */}
        <path d="M12 22h10v34H12z" fill={S.charcoal} stroke={S.ash} strokeWidth={2.2} />
        <path d="M42 22h10v34H42z" fill={S.charcoal} stroke={S.ash} strokeWidth={2.2} />
        {/* battlements */}
        <path d="M10 22v-6h4v4h2v-4h4v6z" fill={S.charcoal} stroke={S.ash} strokeWidth={2} />
        <path d="M40 22v-6h4v4h2v-4h4v6z" fill={S.charcoal} stroke={S.ash} strokeWidth={2} />
        {/* keep */}
        <path d="M20 30h24v26H20z" fill={S.darkCoal} stroke={S.ash} strokeWidth={2.2} />
        <path d="M18 30v-6h5v4h4v-4h5v4h5v-4h4v4h5v-4h4v6z" fill={S.darkCoal} stroke={S.ash} strokeWidth={1.8} />
        {/* gate + windows glowing */}
        <path d="M28 56v-9c0-3 8-3 8 0v9z" fill={S.ember} stroke={S.flame} strokeWidth={1.6} />
        <rect x="15" y="28" width="4" height="6" rx="1" fill={S.flame} />
        <rect x="45" y="28" width="4" height="6" rx="1" fill={S.flame} />
        {/* banner */}
        <path d="M32 8v14" stroke={S.ash} strokeWidth={1.8} />
        <path d="M32 8h10l-3 4 3 4H32z" fill={S.crimson} stroke={S.flame} strokeWidth={1.4} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Flame-forged sword. */
export function HighSword({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* blade */}
        <path d="M32 6l6 8v28H26V14z" fill={S.steel} stroke={S.darkCoal} strokeWidth={2.5} />
        <path d="M32 8v34" stroke={S.darkCoal} strokeWidth={1.6} opacity={0.7} />
        {/* ember fuller */}
        <path d="M29 16v22M35 16v22" stroke={S.ember} strokeWidth={1.4} opacity={0.9} />
        {/* crossguard */}
        <path d="M18 44h28l-3 5H21z" fill={S.flame} stroke={S.darkCoal} strokeWidth={2} />
        {/* grip + pommel */}
        <path d="M29 49h6v7h-6z" fill={S.crimson} stroke={S.darkCoal} strokeWidth={1.8} />
        <circle cx="32" cy="59" r="3.4" fill={S.flame} stroke={S.darkCoal} strokeWidth={1.8} />
        {/* licking flames on blade */}
        <path d="M24 20c-2-3-1-6 1-8M40 20c2-3 1-6-1-8" stroke={S.ember} strokeWidth={2} fill="none" />
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol badge: letter etched on a runed charcoal stone. */
function LowRuneStone({ size, letter, tint }: ArtProps & { letter: string; tint: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <path
        d="M32 8l18 8v32l-18 8-18-8V16z"
        fill={S.charcoal}
        stroke={tint}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <path
        d="M32 12l15 7v26l-15 7-15-7V19z"
        fill="none"
        stroke={tint}
        strokeWidth={1}
        opacity={0.35}
        strokeDasharray="2 4"
      />
      <path d="M22 18c3-2 6-3 10-3" stroke="#fff" strokeWidth={2} opacity={0.12} strokeLinecap="round" fill="none" />
      <text x="32" y="42" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="26" fill={tint}>
        {letter}
      </text>
    </svg>
  )
}

export function LowA({ size }: ArtProps): ReactNode {
  return <LowRuneStone size={size} letter="A" tint={S.ash} />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowRuneStone size={size} letter="K" tint={S.flame} />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowRuneStone size={size} letter="Q" tint={S.ember} />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowRuneStone size={size} letter="J" tint={S.crimson} />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const DRAGON_ART = {
  wild: WildDragonEye,
  scatter: ScatterEgg,
  h1: HighDragon,
  h2: HighKnight,
  h3: HighCastle,
  h4: HighSword,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
