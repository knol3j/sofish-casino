import { useMemo, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { listGames } from '../slots/engine/registry'
import type { GameMeta } from '../slots/engine/types'
import './slots-hub.css'

/* ---------------------------------------------------------------------------
 * SlotsHub — modern slots lobby (SPEC §4)
 * Hero strip + filter chips + search + registry-fed card grid for the new
 * premium slots, followed by a compact "Classic Slots" section that preserves
 * every legacy theme link the old hub offered (those routes still exist).
 * The lobby itself is viewable by everyone — same auth-gate pattern as before.
 * ------------------------------------------------------------------------ */

type FilterId = 'all' | 'high-rtp' | 'high-vol' | 'free-spins' | 'classic'

const FILTERS: { id: FilterId; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '🎰' },
  { id: 'high-rtp', label: 'High RTP', icon: '📈' },
  { id: 'high-vol', label: 'High Volatility', icon: '⚡' },
  { id: 'free-spins', label: 'Free Spins', icon: '🎁' },
  { id: 'classic', label: 'Classic', icon: '7️⃣' }
]

function matchesFilter(meta: GameMeta, filter: FilterId): boolean {
  switch (filter) {
    case 'high-rtp':
      return meta.rtp >= 96
    case 'high-vol':
      return meta.volatility === 'high'
    case 'free-spins':
      return meta.bonus.type.includes('freespins') || meta.bonus.awardSpins !== undefined
    case 'classic':
      return meta.reels === 3
    default:
      return true
  }
}

/* Legacy themes previously listed on this hub — routes still live. */
const LEGACY_THEMES: { id: string; name: string; icon: string; url: string }[] = [
  { id: 'endorphina-satoshi', name: "Satoshi's Secret", icon: '₿', url: '/slots/endorphina/satoshis-secret' },
  { id: 'olympus', name: 'Olympus Glory', icon: '⚡', url: '/slots/olympus' },
  { id: 'vampire', name: "Vampire's Kiss", icon: '🦇', url: '/slots/vampire' },
  { id: 'leprechaun', name: "Leprechaun's Luck", icon: '☘️', url: '/slots/leprechaun' },
  { id: 'viking', name: 'Viking Vault', icon: '🪓', url: '/slots/viking' },
  { id: 'safari', name: 'Safari Strike', icon: '🦁', url: '/slots/safari' },
  { id: 'mafia', name: 'Mafia Mayhem', icon: '🕴️', url: '/slots/mafia' },
  { id: 'forest', name: 'Mystic Forest', icon: '🧚', url: '/slots/forest' },
  { id: 'ninja', name: 'Neon Ninja', icon: '🥷', url: '/slots/ninja' },
  { id: 'pirate', name: "Pirate's Bounty", icon: '🏴‍☠️', url: '/slots/pirate' },
  { id: 'galactic', name: 'Galactic Gems', icon: '💎', url: '/slots/galactic' },
  { id: 'pharaoh', name: "Pharaoh's Tomb", icon: '🛕', url: '/slots/pharaoh' },
  { id: 'cyber', name: 'Cyber Scatter', icon: '🤖', url: '/slots/cyber' },
  { id: 'sugar', name: 'Sugar Rush', icon: '🍬', url: '/slots/sugar' },
  { id: 'wildwest', name: 'Wild West Heist', icon: '🤠', url: '/slots/wildwest' },
  { id: 'classic', name: '777 Classic Slots', icon: '🎰', url: '/slots/classic' },
  { id: 'fruit', name: 'Fruit Mania', icon: '🍒', url: '/slots/fruit' },
  { id: 'diamond', name: 'Diamond Deluxe', icon: '💎', url: '/slots/diamond' },
  { id: 'dragon', name: "Dragon's Fortune", icon: '🐉', url: '/slots/dragon' },
  { id: 'vegas', name: 'Vegas Nights', icon: '🌟', url: '/slots/vegas' },
  { id: 'ocean', name: 'Ocean Treasures', icon: '🌊', url: '/slots/ocean' }
]

const VOL_LABEL: Record<GameMeta['volatility'], string> = {
  low: 'Low Vol',
  medium: 'Med Vol',
  high: 'High Vol'
}

function GameCard({ meta }: { meta: GameMeta }) {
  const navigate = useNavigate()
  const style = {
    '--sh-primary': meta.palette.primary,
    '--sh-secondary': meta.palette.secondary,
    '--sh-bg': meta.palette.bg,
    '--sh-accent': meta.palette.accent
  } as CSSProperties

  return (
    <article className="sh-card" style={style}>
      <div className="sh-card__tile">
        <span className="sh-card__icon" aria-hidden="true">
          {meta.iconEmoji}
        </span>
        <span className="sh-card__rtp">RTP {meta.rtp.toFixed(1)}%</span>
        <span className={`sh-card__vol sh-card__vol--${meta.volatility}`}>
          {VOL_LABEL[meta.volatility]}
        </span>
      </div>

      <div className="sh-card__body">
        <h3 className="sh-card__title">{meta.title}</h3>
        <p className="sh-card__tagline">{meta.tagline}</p>
        <span className="sh-card__bonus">{meta.bonus.label}</span>
        <button
          type="button"
          className="sh-card__play"
          onClick={() => navigate(`/slots/play/${meta.id}`)}
        >
          PLAY
          <span className="sh-card__play-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </article>
  )
}

export function SlotsHub() {
  const [filter, setFilter] = useState<FilterId>('all')
  const [query, setQuery] = useState('')

  const games = useMemo(() => listGames(), [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return games.filter((meta) => {
      if (!matchesFilter(meta, filter)) return false
      if (!q) return true
      return (
        meta.title.toLowerCase().includes(q) || meta.tagline.toLowerCase().includes(q)
      )
    })
  }, [games, filter, query])

  return (
    <div className="sh-page">
      <div className="sh-container">
        {/* Hero strip */}
        <header className="sh-hero">
          <div className="sh-hero__glow" aria-hidden="true" />
          <p className="sh-hero__eyebrow">✨ Fresh off the reels</p>
          <h1 className="sh-hero__title">10 New Premium Slots</h1>
          <p className="sh-hero__subtitle">
            A brand-new slot fleet built on our modern engine — cinematic spins,
            real bonus mechanics, tiered win celebrations and synthesized sound.
          </p>
          <div className="sh-hero__stats">
            <span className="sh-hero__stat">🎰 {games.length} live now</span>
            <span className="sh-hero__stat">🎁 Real bonus rounds</span>
            <span className="sh-hero__stat">🔊 WebAudio soundtrack</span>
          </div>
        </header>

        {/* Filter chips + search */}
        <div className="sh-controls">
          <div className="sh-chips" role="group" aria-label="Filter slots">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                className={`sh-chip${filter === f.id ? ' sh-chip--active' : ''}`}
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
              >
                <span aria-hidden="true">{f.icon}</span> {f.label}
              </button>
            ))}
          </div>
          <div className="sh-search">
            <span className="sh-search__icon" aria-hidden="true">
              🔍
            </span>
            <input
              type="search"
              className="sh-search__input"
              placeholder="Search by title or tagline…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search slots"
            />
          </div>
        </div>

        {/* Card grid */}
        {visible.length > 0 ? (
          <div className="sh-grid">
            {visible.map((meta) => (
              <GameCard key={meta.id} meta={meta} />
            ))}
          </div>
        ) : (
          <div className="sh-empty">
            <div className="sh-empty__icon" aria-hidden="true">
              🎰
            </div>
            <p className="sh-empty__text">
              No slots match {filter !== 'all' ? 'this filter' : 'your search'}.
            </p>
            <button
              type="button"
              className="sh-empty__reset"
              onClick={() => {
                setFilter('all')
                setQuery('')
              }}
            >
              Reset filters
            </button>
          </div>
        )}

        {/* Classic Slots — legacy themes */}
        <section className="sh-classic">
          <h2 className="sh-classic__title">
            <span aria-hidden="true">🕹️</span> Classic Slots
          </h2>
          <p className="sh-classic__subtitle">
            The original Sofish themed machines — still spinning strong.
          </p>
          <div className="sh-classic__grid">
            {LEGACY_THEMES.map((game) => (
              <Link key={game.id} to={game.url} className="sh-classic__link">
                <span className="sh-classic__icon" aria-hidden="true">
                  {game.icon}
                </span>
                <span className="sh-classic__name">{game.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
