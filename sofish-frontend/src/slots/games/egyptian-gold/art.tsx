/**
 * games/egyptian-gold/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Egyptian Gold.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, onyx fills
 * with sand highlights and gold accents — a royal tomb at torchlight.
 * Every symbol stays recognizable at 48px. No external assets — pure SVG.
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
  // shared palette shorthand — sand / onyx / gold
  gold: '#f0c75e',
  deepGold: '#c9932b',
  sand: '#e6cf9c',
  dune: '#a8845a',
  onyx: '#241c14',
  darkOnyx: '#171310',
  lapis: '#3f6ea5',
  torch: '#ff9d45'
}

/* ---------------------------------------------------------------- WILD */
/** Golden Scarab — substitutes for every symbol except the Pyramid. */
export function WildScarab({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* legs */}
        <g stroke={S.deepGold} strokeWidth={2.2}>
          <path d="M16 26l-8-4M16 34H7M16 42l-8 4" />
          <path d="M48 26l8-4M48 34h9M48 42l8 4" />
        </g>
        {/* wing cases */}
        <path d="M32 16c-10 0-16 8-16 18s6 18 16 18 16-8 16-18-6-18-16-18z" fill={S.deepGold} stroke={S.gold} strokeWidth={2.5} />
        {/* elytra split + wing sheen */}
        <path d="M32 16v36" stroke={S.darkOnyx} strokeWidth={2} />
        <path d="M24 24c-3 3-4 7-4 10M40 24c3 3 4 7 4 10" stroke={S.gold} strokeWidth={1.6} opacity={0.8} fill="none" />
        {/* head + horns */}
        <circle cx="32" cy="12" r="5" fill={S.gold} stroke={S.deepGold} strokeWidth={2} />
        <path d="M28 9c-2-3-5-4-7-4M36 9c2-3 5-4 7-4" stroke={S.gold} strokeWidth={2.2} fill="none" />
        {/* sun disc */}
        <circle cx="32" cy="30" r="6" fill={S.torch} opacity={0.85} />
        <circle cx="32" cy="30" r="6" stroke={S.gold} strokeWidth={1.4} />
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** Pyramid at sundown — 3+ anywhere awaken Pharaoh's Wilds. */
export function ScatterPyramid({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* sun */}
        <circle cx="32" cy="18" r="8" fill={S.torch} stroke={S.gold} strokeWidth={2} />
        {/* pyramid faces */}
        <path d="M32 12L8 52h48z" fill={S.dune} stroke={S.sand} strokeWidth={2.5} />
        <path d="M32 12v40" stroke={S.onyx} strokeWidth={2} />
        <path d="M32 12L8 52h24z" fill={S.sand} opacity={0.35} stroke="none" />
        {/* capstone */}
        <path d="M32 12l-7 10h14z" fill={S.gold} stroke={S.deepGold} strokeWidth={1.8} />
        {/* sand line */}
        <path d="M4 56h56" stroke={S.sand} strokeWidth={2.2} />
        <path d="M14 60h16M38 60h12" stroke={S.dune} strokeWidth={2} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Pharaoh's burial mask. */
export function HighPharaoh({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* nemes headdress */}
        <path
          d="M32 6c12 0 20 8 20 20v14l-6 8H18l-6-8V26C12 14 20 6 32 6z"
          fill={S.deepGold}
          stroke={S.gold}
          strokeWidth={2.5}
        />
        {/* headdress stripes */}
        <path d="M20 14c-3 4-4 8-4 12M44 14c3 4 4 8 4 12M16 34h32" stroke={S.onyx} strokeWidth={2} fill="none" opacity={0.8} />
        {/* face */}
        <path d="M22 26c0-5 4-9 10-9s10 4 10 9v10c0 6-4 12-10 12s-10-6-10-12z" fill={S.gold} stroke={S.onyx} strokeWidth={2} />
        {/* eyes + brow */}
        <path d="M25 30h5M34 30h5" stroke={S.onyx} strokeWidth={2.4} />
        <path d="M24 26l7 1M40 26l-7 1" stroke={S.lapis} strokeWidth={2} />
        {/* false beard */}
        <path d="M29 46h6v9c0 2-6 2-6 0z" fill={S.lapis} stroke={S.onyx} strokeWidth={1.8} />
        {/* uraeus cobra */}
        <circle cx="32" cy="13" r="3" fill={S.torch} stroke={S.onyx} strokeWidth={1.6} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Eye of Horus. */
export function HighHorusEye({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* almond eye */}
        <path d="M8 30c8-10 16-14 24-14s16 4 24 14c-8 10-16 14-24 14S16 40 8 30z" fill={S.onyx} stroke={S.gold} strokeWidth={2.5} />
        {/* iris + pupil */}
        <circle cx="32" cy="30" r="8" fill={S.lapis} stroke={S.gold} strokeWidth={2} />
        <circle cx="32" cy="30" r="3.4" fill={S.darkOnyx} />
        <circle cx="30" cy="28" r="1.4" fill={S.sand} />
        {/* brow line */}
        <path d="M10 24C18 13 46 13 54 24" stroke={S.gold} strokeWidth={2.5} fill="none" />
        {/* horus markings */}
        <path d="M26 44c0 5-2 8-6 10" stroke={S.gold} strokeWidth={2.5} fill="none" />
        <path d="M38 44c3 2 4 6 3 10" stroke={S.gold} strokeWidth={2.5} fill="none" />
        <circle cx="19" cy="55" r="2" fill={S.gold} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Anubis, jackal guardian of the tomb. */
export function HighAnubis({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* ears */}
        <path d="M22 20L16 4l12 8z" fill={S.onyx} stroke={S.gold} strokeWidth={2.2} />
        <path d="M42 20L48 4 36 12z" fill={S.onyx} stroke={S.gold} strokeWidth={2.2} />
        {/* head + snout */}
        <path d="M32 12c8 0 13 5 13 12l8 6-7 3c-1 8-7 13-14 13s-13-5-14-13l-7-3 8-6c0-7 5-12 13-12z" fill={S.onyx} stroke={S.gold} strokeWidth={2.5} />
        {/* snout tip */}
        <path d="M24 30h16l-8 8z" fill={S.darkOnyx} stroke={S.gold} strokeWidth={1.8} />
        {/* eyes */}
        <path d="M24 22l5 2M40 22l-5 2" stroke={S.torch} strokeWidth={2.4} />
        {/* collar */}
        <path d="M20 50c4 4 8 6 12 6s8-2 12-6" stroke={S.gold} strokeWidth={2.5} fill="none" />
        <path d="M24 54c2 2 5 3 8 3s6-1 8-3" stroke={S.lapis} strokeWidth={2} fill="none" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Ankh — key of life. */
export function HighAnkh({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g stroke={S.gold} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
        {/* loop */}
        <ellipse cx="32" cy="18" rx="9" ry="11" fill={S.onyx} />
        {/* stem + arms */}
        <path d="M32 29v26" />
        <path d="M18 36h28" />
        {/* foot */}
        <path d="M26 55h12" />
      </g>
      {/* inlay */}
      <ellipse cx="32" cy="18" rx="4.5" ry="6" fill={S.lapis} />
      <circle cx="32" cy="42" r="3" fill={S.torch} />
      <circle cx="32" cy="18" r="14.5" stroke={S.gold} strokeWidth={1.2} opacity={0.45} strokeDasharray="3 5" fill="none" />
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol badge: letter on a sandstone cartouche. */
function LowCartouche({ size, letter, tint }: ArtProps & { letter: string; tint: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <rect x="14" y="8" width="36" height="48" rx="17" fill={S.onyx} stroke={tint} strokeWidth={2.5} />
      <rect
        x="14"
        y="8"
        width="36"
        height="48"
        rx="17"
        fill="none"
        stroke={tint}
        strokeWidth={1}
        opacity={0.4}
        strokeDasharray="2 4"
        transform="rotate(4 32 32)"
      />
      <path d="M22 14c-2 3-3 6-3 10" stroke="#fff" strokeWidth={2} opacity={0.15} strokeLinecap="round" fill="none" />
      <text x="32" y="42" textAnchor="middle" fontFamily="'Georgia', serif" fontWeight="900" fontSize="26" fill={tint}>
        {letter}
      </text>
    </svg>
  )
}

export function LowA({ size }: ArtProps): ReactNode {
  return <LowCartouche size={size} letter="A" tint={S.sand} />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowCartouche size={size} letter="K" tint={S.gold} />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowCartouche size={size} letter="Q" tint="#8fb6d9" />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowCartouche size={size} letter="J" tint={S.torch} />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const EGYPT_ART = {
  wild: WildScarab,
  scatter: ScatterPyramid,
  h1: HighPharaoh,
  h2: HighHorusEye,
  h3: HighAnubis,
  h4: HighAnkh,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
