/**
 * games/aztec-jungle/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Aztec Jungle.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, carved-stone
 * shapes in emerald/jade with sun-gold highlights. Every symbol stays
 * recognizable at 48px. No external assets — pure SVG.
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
  gold: '#f2b134', // sun gold
  paleGold: '#ffdf6b',
  jade: '#35c48d',
  emerald: '#0e5c3f',
  deepJungle: '#0a2e22',
  stone: '#9fb8a4',
  ochre: '#d98e32'
}

/* ---------------------------------------------------------------- WILD */
/** Sun God Mask — golden sun disc with a carved face. */
export function WildSunMask({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* rays */}
        <g stroke={S.gold} strokeWidth={2.5}>
          <path d="M32 4v8" />
          <path d="M32 52v8" />
          <path d="M4 32h8" />
          <path d="M52 32h8" />
          <path d="M12.2 12.2l5.7 5.7" />
          <path d="M46.1 46.1l5.7 5.7" />
          <path d="M51.8 12.2l-5.7 5.7" />
          <path d="M17.9 46.1l-5.7 5.7" />
        </g>
        {/* face disc */}
        <circle cx="32" cy="32" r="17" fill={S.deepJungle} stroke={S.gold} strokeWidth={2.5} />
        {/* eyes + mouth (carved) */}
        <circle cx="26" cy="29" r="2.6" fill={S.paleGold} />
        <circle cx="38" cy="29" r="2.6" fill={S.paleGold} />
        <path d="M25 39c3 3 11 3 14 0" stroke={S.paleGold} strokeWidth={2.2} fill="none" />
        {/* nose ridge + headdress notch */}
        <path d="M32 24v6" stroke={S.gold} strokeWidth={1.8} />
        <circle cx="32" cy="19" r="1.6" fill={S.jade} />
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** Golden Idol — 3+ open the Temple Jackpot. */
export function ScatterIdol({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* headdress */}
        <path d="M20 14l4 6M32 10v8M44 14l-4 6" stroke={S.jade} strokeWidth={2.4} />
        {/* head */}
        <rect x="21" y="18" width="22" height="16" rx="3" fill={S.ochre} stroke={S.gold} strokeWidth={2.5} />
        <rect x="25" y="23" width="5" height="5" rx="1" fill={S.deepJungle} />
        <rect x="34" y="23" width="5" height="5" rx="1" fill={S.deepJungle} />
        <path d="M28 31h8" stroke={S.deepJungle} strokeWidth={2} />
        {/* body */}
        <path d="M24 34h16l4 12H20z" fill={S.gold} stroke={S.paleGold} strokeWidth={2.5} />
        <path d="M27 38h10M29 42h6" stroke={S.deepJungle} strokeWidth={1.8} />
        {/* base */}
        <rect x="16" y="46" width="32" height="8" rx="2" fill={S.emerald} stroke={S.jade} strokeWidth={2.2} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Jaguar — spotted jungle cat head. */
export function HighJaguar({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* ears */}
        <path d="M18 20l-4-9 10 4z" fill={S.emerald} stroke={S.gold} strokeWidth={2.2} />
        <path d="M46 20l4-9-10 4z" fill={S.emerald} stroke={S.gold} strokeWidth={2.2} />
        {/* head */}
        <path
          d="M32 14c12 0 18 8 18 18 0 12-8 20-18 20s-18-8-18-20c0-10 6-18 18-18z"
          fill={S.ochre}
          stroke={S.gold}
          strokeWidth={2.5}
        />
        {/* spots */}
        <g fill={S.deepJungle} opacity={0.85}>
          <circle cx="22" cy="26" r="1.8" />
          <circle cx="42" cy="26" r="1.8" />
          <circle cx="20" cy="36" r="1.6" />
          <circle cx="44" cy="36" r="1.6" />
        </g>
        {/* eyes */}
        <circle cx="26" cy="31" r="2.8" fill={S.paleGold} />
        <circle cx="38" cy="31" r="2.8" fill={S.paleGold} />
        <circle cx="26" cy="31" r="1.2" fill={S.deepJungle} />
        <circle cx="38" cy="31" r="1.2" fill={S.deepJungle} />
        {/* muzzle */}
        <path d="M27 40c2 3 8 3 10 0" stroke={S.deepJungle} strokeWidth={2} fill="none" />
        <path d="M32 37v5" stroke={S.deepJungle} strokeWidth={2} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Temple Pyramid — stepped pyramid in the canopy. */
export function HighPyramid({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* steps */}
        <path d="M26 12h12v8H26z" fill={S.emerald} stroke={S.jade} strokeWidth={2.2} />
        <path d="M21 20h22v9H21z" fill={S.deepJungle} stroke={S.jade} strokeWidth={2.2} />
        <path d="M16 29h32v9H16z" fill={S.emerald} stroke={S.jade} strokeWidth={2.2} />
        <path d="M11 38h42v10H11z" fill={S.deepJungle} stroke={S.jade} strokeWidth={2.2} />
        {/* central stairway */}
        <path d="M32 12v36" stroke={S.gold} strokeWidth={2} opacity={0.9} />
        <path d="M29 48l3-36 3 36" fill={S.gold} opacity={0.25} stroke="none" />
        {/* sun glint on top */}
        <circle cx="32" cy="9" r="2.4" fill={S.paleGold} />
        {/* base line */}
        <path d="M8 53h48" stroke={S.gold} strokeWidth={2.2} opacity={0.8} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Emerald Serpent — coiled jade snake. */
export function HighSerpent({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* coiled body */}
        <path
          d="M14 48c0-6 8-8 18-8s18 2 18-4-8-8-16-8-14-2-14-7 6-8 12-8"
          stroke={S.jade}
          strokeWidth={5}
        />
        <path
          d="M14 48c0-6 8-8 18-8s18 2 18-4-8-8-16-8-14-2-14-7 6-8 12-8"
          stroke={S.emerald}
          strokeWidth={2}
          strokeDasharray="3 4"
        />
        {/* head */}
        <circle cx="34" cy="13" r="6" fill={S.emerald} stroke={S.jade} strokeWidth={2.2} />
        <circle cx="36.5" cy="11.5" r="1.4" fill={S.paleGold} />
        {/* tongue */}
        <path d="M40 13h6M46 13l2-2M46 13l2 2" stroke={S.gold} strokeWidth={1.8} />
        {/* tail rattle */}
        <path d="M14 48l-4 4" stroke={S.gold} strokeWidth={2.4} />
        <circle cx="9" cy="53" r="2" fill={S.gold} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Quetzal — jade bird with long tail plumes. */
export function HighQuetzal({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* tail plumes */}
        <g stroke={S.jade} strokeWidth={2.2} fill="none">
          <path d="M30 34c-2 10-8 16-14 20" />
          <path d="M34 34c0 11-3 18-8 23" />
          <path d="M38 34c2 10 1 18-2 24" opacity={0.7} />
        </g>
        {/* body */}
        <ellipse cx="33" cy="28" rx="11" ry="9" fill={S.emerald} stroke={S.jade} strokeWidth={2.5} />
        {/* chest */}
        <path d="M38 22c3 3 4 8 2 12-3 2-8 2-11-1 4-1 7-5 9-11z" fill={S.gold} opacity={0.85} stroke="none" />
        {/* head + crest */}
        <circle cx="44" cy="17" r="6" fill={S.emerald} stroke={S.jade} strokeWidth={2.2} />
        <path d="M40 12c-2-3-5-4-8-3" stroke={S.jade} strokeWidth={2} fill="none" />
        <circle cx="46" cy="16" r="1.4" fill={S.paleGold} />
        {/* beak */}
        <path d="M50 17l6 2-6 2z" fill={S.gold} stroke="none" />
        {/* wing */}
        <path d="M26 26c3-2 8-2 11 1" stroke={S.jade} strokeWidth={1.8} fill="none" />
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol: letter carved into a jungle stone glyph. */
function LowGlyph({ size, letter, tint }: ArtProps & { letter: string; tint: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <rect x="12" y="12" width="40" height="40" rx="7" fill={S.deepJungle} stroke={tint} strokeWidth={2.5} />
      <rect
        x="17"
        y="17"
        width="30"
        height="30"
        rx="5"
        fill="none"
        stroke={tint}
        strokeWidth={1}
        opacity={0.4}
        strokeDasharray="3 4"
      />
      {/* carved corner notches */}
      <g fill={tint} opacity={0.55}>
        <circle cx="19" cy="19" r="1.4" />
        <circle cx="45" cy="19" r="1.4" />
        <circle cx="19" cy="45" r="1.4" />
        <circle cx="45" cy="45" r="1.4" />
      </g>
      <text
        x="32"
        y="42"
        textAnchor="middle"
        fontFamily="'Georgia', serif"
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
  return <LowGlyph size={size} letter="A" tint={S.gold} />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowGlyph size={size} letter="K" tint={S.jade} />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowGlyph size={size} letter="Q" tint={S.stone} />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowGlyph size={size} letter="J" tint={S.paleGold} />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const AZTEC_ART = {
  wild: WildSunMask,
  scatter: ScatterIdol,
  h1: HighJaguar,
  h2: HighPyramid,
  h3: HighSerpent,
  h4: HighQuetzal,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
