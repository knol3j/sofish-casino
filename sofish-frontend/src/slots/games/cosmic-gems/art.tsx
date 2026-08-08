/**
 * games/cosmic-gems/art.tsx
 * ---------------------------------------------------------------------------
 * Original inline-SVG symbol art for Cosmic Gems.
 * Shared style language: 64×64 viewBox, 2.5px round strokes, faceted gems
 * in indigo/violet with starlight highlights and sparkle accents. Every
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
  indigo: '#5b5fd6',
  violet: '#a855f7',
  deepSpace: '#171334',
  starlight: '#e9e6ff',
  rose: '#f472b6',
  sky: '#7dd3fc',
  mint: '#6ee7d8'
}

/** Tiny 4-point sparkle used across symbols. */
function Sparkle({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }): ReactNode {
  return (
    <path
      d={`M${cx} ${cy - r}L${cx + r * 0.28} ${cy - r * 0.28}L${cx + r} ${cy}L${cx + r * 0.28} ${cy + r * 0.28}L${cx} ${cy + r}L${cx - r * 0.28} ${cy + r * 0.28}L${cx - r} ${cy}L${cx - r * 0.28} ${cy - r * 0.28}z`}
      fill={fill}
    />
  )
}

/* ---------------------------------------------------------------- WILD */
/** Supernova — wild starburst. */
export function WildSupernova({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* rays */}
        <g stroke={S.violet} strokeWidth={2.5}>
          <path d="M32 6v10" />
          <path d="M32 48v10" />
          <path d="M6 32h10" />
          <path d="M48 32h10" />
          <path d="M13.6 13.6l7 7" />
          <path d="M43.4 43.4l7 7" />
          <path d="M50.4 13.6l-7 7" />
          <path d="M20.6 43.4l-7 7" />
        </g>
        {/* core */}
        <circle cx="32" cy="32" r="13" fill={S.deepSpace} stroke={S.starlight} strokeWidth={2.5} />
        <circle cx="32" cy="32" r="6.5" fill={S.starlight} />
        <circle cx="29.5" cy="29.5" r="2" fill="#fff" />
        <Sparkle cx={47} cy={15} r={4} fill={S.rose} />
      </g>
    </svg>
  )
}

/* -------------------------------------------------------------- SCATTER */
/** Shooting Star — 3+ trigger Starfall Cascades free spins. */
export function ScatterComet({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* tail streaks */}
        <g stroke={S.sky} strokeWidth={2.2}>
          <path d="M8 14l18 12" opacity={0.9} />
          <path d="M6 26l16 8" opacity={0.6} />
          <path d="M16 8l14 14" opacity={0.6} />
        </g>
        {/* star */}
        <path
          d="M40 22l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3-9.3-4.9-9.3 4.9 1.8-10.3-7.5-7.3 10.4-1.5z"
          fill={S.starlight}
          stroke={S.violet}
          strokeWidth={2.5}
        />
        <circle cx="40" cy="36" r="2.4" fill={S.violet} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H1 */
/** Nebula Heart — rose heart-cut gem. */
export function HighHeartGem({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M32 54C20 44 12 36 12 26c0-7 5-12 11-12 4 0 7 2 9 5 2-3 5-5 9-5 6 0 11 5 11 12 0 10-8 18-20 28z"
          fill={S.deepSpace}
          stroke={S.rose}
          strokeWidth={2.5}
        />
        {/* facets */}
        <g stroke={S.rose} strokeWidth={1.5} opacity={0.75} fill="none">
          <path d="M23 20l9 12 9-12" />
          <path d="M32 32v18" />
          <path d="M14 28h36" />
        </g>
        <Sparkle cx={22} cy={24} r={3.4} fill={S.starlight} />
        <Sparkle cx={45} cy={40} r={2.6} fill={S.starlight} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H2 */
/** Sapphire Drop — teardrop gem. */
export function HighDropGem({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M32 8c8 10 16 18 16 28a16 16 0 11-32 0c0-10 8-18 16-28z"
          fill={S.deepSpace}
          stroke={S.sky}
          strokeWidth={2.5}
        />
        <g stroke={S.sky} strokeWidth={1.5} opacity={0.75} fill="none">
          <path d="M32 14v34" />
          <path d="M20 32h24" />
          <path d="M24 22l8 10 8-10" />
        </g>
        <Sparkle cx={26} cy={26} r={3.2} fill={S.starlight} />
        <circle cx="38" cy="40" r="2" fill={S.starlight} opacity={0.9} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H3 */
/** Amethyst Crown — hex-cut violet gem. */
export function HighHexGem({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M32 8l20 12v24L32 56 12 44V20z"
          fill={S.deepSpace}
          stroke={S.violet}
          strokeWidth={2.5}
        />
        <g stroke={S.violet} strokeWidth={1.5} opacity={0.75} fill="none">
          <path d="M32 8v48" />
          <path d="M12 20l20 12 20-12" />
          <path d="M12 44l20-12 20 12" />
        </g>
        <path d="M32 20l10 6v12l-10 6-10-6V26z" fill={S.violet} opacity={0.3} stroke="none" />
        <Sparkle cx={24} cy={18} r={3.2} fill={S.starlight} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ H4 */
/** Moonstone — pale emerald-cut gem. */
export function HighEmeraldCut({ size }: ArtProps): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <g strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M20 12h24l8 10v20l-8 10H20l-8-10V22z"
          fill={S.deepSpace}
          stroke={S.mint}
          strokeWidth={2.5}
        />
        <path
          d="M25 20h14l5 6v12l-5 6H25l-5-6V26z"
          fill="none"
          stroke={S.mint}
          strokeWidth={1.5}
          opacity={0.8}
        />
        <g stroke={S.mint} strokeWidth={1.4} opacity={0.7} fill="none">
          <path d="M20 12l5 8M44 12l-5 8M20 52l5-8M44 52l-5-8" />
        </g>
        <Sparkle cx={26} cy={26} r={3} fill={S.starlight} />
        <Sparkle cx={42} cy={44} r={2.4} fill={S.starlight} />
      </g>
    </svg>
  )
}

/* --------------------------------------------------------------- LOWS */
/** Shared low-symbol: letter on a constellation badge. */
function LowConstellation({
  size,
  letter,
  tint
}: ArtProps & { letter: string; tint: string }): ReactNode {
  return (
    <svg {...svgProps(size)}>
      <circle cx="32" cy="32" r="22" fill={S.deepSpace} stroke={tint} strokeWidth={2.5} />
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
      {/* starfield dots */}
      <g fill={S.starlight} opacity={0.8}>
        <circle cx="20" cy="20" r="1.2" />
        <circle cx="45" cy="18" r="1" />
        <circle cx="48" cy="42" r="1.2" />
        <circle cx="18" cy="44" r="1" />
      </g>
      <text
        x="32"
        y="41"
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
  return <LowConstellation size={size} letter="A" tint={S.starlight} />
}
export function LowK({ size }: ArtProps): ReactNode {
  return <LowConstellation size={size} letter="K" tint={S.sky} />
}
export function LowQ({ size }: ArtProps): ReactNode {
  return <LowConstellation size={size} letter="Q" tint={S.violet} />
}
export function LowJ({ size }: ArtProps): ReactNode {
  return <LowConstellation size={size} letter="J" tint={S.rose} />
}

/** Lookup used by index.ts to build the SymbolDef list. */
export const COSMIC_ART = {
  wild: WildSupernova,
  scatter: ScatterComet,
  h1: HighHeartGem,
  h2: HighDropGem,
  h3: HighHexGem,
  h4: HighEmeraldCut,
  l1: LowA,
  l2: LowK,
  l3: LowQ,
  l4: LowJ
} as const
