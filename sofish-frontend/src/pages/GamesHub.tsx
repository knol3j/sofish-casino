import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Game {
  id: string
  name: string
  description: string
  icon: string
  category: string
  badge?: string
  badgeType?: string
  rtp: string
  maxWin: string
  minBet: number
  path: string
  isNew?: boolean
  isHot?: boolean
  provider?: string
}

const GAMES: Game[] = [
  // Slots
  {
    id: 'slots-classic',
    name: '777 Classic',
    description: 'The original Vegas experience with triple 7 jackpots',
    icon: '🎰',
    category: 'slots',
    badge: 'CLASSIC',
    badgeType: 'blue',
    rtp: '96.5%',
    maxWin: '777x',
    minBet: 10,
    path: '/slots/classic'
  },
  {
    id: 'slots-fruit',
    name: 'Fruit Mania',
    description: 'Sweet and juicy wins with classic fruit symbols',
    icon: '🍒',
    category: 'slots',
    badge: 'POPULAR',
    badgeType: 'green',
    rtp: '97.0%',
    maxWin: '500x',
    minBet: 5,
    path: '/slots/fruit'
  },
  {
    id: 'slots-diamond',
    name: 'Diamond Deluxe',
    description: 'High roller VIP experience with luxury payouts',
    icon: '💎',
    category: 'slots',
    badge: 'VIP',
    badgeType: 'purple',
    rtp: '98.1%',
    maxWin: '1000x',
    minBet: 50,
    path: '/slots/diamond',
    isHot: true
  },
  {
    id: 'slots-dragon',
    name: "Dragon's Fortune",
    description: 'Legendary Asian-themed slots with 888x jackpots',
    icon: '🐉',
    category: 'slots',
    badge: 'JACKPOT',
    badgeType: 'gold',
    rtp: '97.2%',
    maxWin: '888x',
    minBet: 100,
    path: '/slots/dragon',
    isHot: true
  },
  {
    id: 'slots-vegas',
    name: 'Vegas Nights',
    description: 'Sin City glamour with neon lights and big wins',
    icon: '🌃',
    category: 'slots',
    rtp: '96.8%',
    maxWin: '300x',
    minBet: 25,
    path: '/slots/vegas'
  },
  {
    id: 'slots-ocean',
    name: 'Ocean Treasures',
    description: 'Deep sea adventure with pirate treasure multipliers',
    icon: '🏴‍☠️',
    category: 'slots',
    badge: 'NEW',
    badgeType: 'cyan',
    rtp: '96.5%',
    maxWin: '400x',
    minBet: 20,
    path: '/slots/ocean',
    isNew: true
  },
  {
    id: 'satoshi-secret',
    name: "Satoshi's Secret",
    description: '5-reel crypto adventure with 50,000x max win',
    icon: '₿',
    category: 'slots',
    badge: 'MEGA WIN',
    badgeType: 'gold',
    rtp: '96.8%',
    maxWin: '50,000x',
    minBet: 10,
    path: '/slots/endorphina/satoshis-secret',
    provider: 'Endorphina',
    isHot: true
  },
  // Table Games
  {
    id: 'roulette',
    name: 'European Roulette',
    description: 'Classic casino table game with 37-number wheel',
    icon: '🎲',
    category: 'table',
    badge: 'CLASSIC',
    badgeType: 'blue',
    rtp: '97.3%',
    maxWin: '35x',
    minBet: 10,
    path: '/roulette'
  },
  {
    id: 'blackjack',
    name: 'Blackjack Pro',
    description: 'Beat the dealer and hit 21 for big wins',
    icon: '🃏',
    category: 'table',
    badge: 'SKILL',
    badgeType: 'green',
    rtp: '99.5%',
    maxWin: '3x',
    minBet: 10,
    path: '/blackjack'
  },
  // Arcade
  {
    id: 'fish-classic',
    name: 'Fish Hunter Classic',
    description: 'Skill-based arcade shooting with big multipliers',
    icon: '🎣',
    category: 'arcade',
    badge: 'FEATURED',
    badgeType: 'gold',
    rtp: '96.5%',
    maxWin: '5,000x',
    minBet: 10,
    path: '/fishing-hub',
    isHot: true
  },
  {
    id: 'fish-deep',
    name: 'Deep Sea Hunter',
    description: 'Dive deep for legendary fish and massive rewards',
    icon: '🦈',
    category: 'arcade',
    badge: 'NEW',
    badgeType: 'cyan',
    rtp: '96.0%',
    maxWin: '10,000x',
    minBet: 25,
    path: '/fishing/deep-sea',
    isNew: true
  }
]

const CATEGORIES = [
  { id: 'all', name: 'All Games', icon: '🎮' },
  { id: 'slots', name: 'Slots', icon: '🎰' },
  { id: 'table', name: 'Table Games', icon: '🎲' },
  { id: 'arcade', name: 'Arcade', icon: '🕹️' }
]

export function GamesHub() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGames = GAMES.filter(game => {
    const matchesCategory = activeCategory === 'all' || game.category === activeCategory
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const hotGames = GAMES.filter(g => g.isHot)

  return (
    <div className="games-hub">
      <div className="container">
        {/* Header */}
        <div className="hub-header">
          <div className="header-content">
            <h1 className="hub-title">
              <span className="title-icon">🎮</span>
              Game <span className="text-gradient-gold">Library</span>
            </h1>
            <p className="hub-subtitle">
              Explore our collection of premium casino games
            </p>
          </div>

          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Quick Access - Hot Games */}
        {!searchQuery && activeCategory === 'all' && (
          <section className="quick-section">
            <div className="section-header">
              <h2 className="section-title">
                <span className="title-icon">🔥</span>
                Hot Games
              </h2>
              <p className="section-desc">Most played this week</p>
            </div>

            <div className="hot-games-grid">
              {hotGames.map((game, index) => (
                <Link
                  key={game.id}
                  to={game.path}
                  className="hot-game-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="hot-game-bg">
                    <div className="hot-game-icon">{game.icon}</div>
                  </div>
                  <div className="hot-game-info">
                    <h3 className="hot-game-name">{game.name}</h3>
                    <div className="hot-game-meta">
                      <span className="meta-item">{game.maxWin} Max</span>
                    </div>
                  </div>
                  <div className="hot-badge">HOT</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        <div className="categories-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
              <span className="cat-count">
                {cat.id === 'all' ? GAMES.length : GAMES.filter(g => g.category === cat.id).length}
              </span>
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="games-section">
          {searchQuery && (
            <p className="search-results">
              Found <strong>{filteredGames.length}</strong> games matching "{searchQuery}"
            </p>
          )}

          <div className="games-grid">
            {filteredGames.map((game, index) => (
              <Link
                key={game.id}
                to={game.path}
                className="game-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {game.badge && (
                  <div className={`game-badge badge-${game.badgeType}`}>
                    {game.badge}
                  </div>
                )}

                <div className="game-visual">
                  <div className="game-icon-wrapper">
                    <div className="game-icon">{game.icon}</div>
                    <div className="game-icon-glow" />
                  </div>
                  {game.provider && (
                    <div className="game-provider">{game.provider}</div>
                  )}
                </div>

                <div className="game-content">
                  <h3 className="game-name">{game.name}</h3>
                  <p className="game-desc">{game.description}</p>

                  <div className="game-stats">
                    <div className="stat">
                      <span className="stat-label">RTP</span>
                      <span className="stat-value">{game.rtp}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Max Win</span>
                      <span className="stat-value gold">{game.maxWin}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">Min Bet</span>
                      <span className="stat-value">{game.minBet}</span>
                    </div>
                  </div>
                </div>

                <div className="game-action">
                  <span className="play-text">Play Now</span>
                  <span className="play-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>

          {filteredGames.length === 0 && (
            <div className="no-results">
              <span className="no-results-icon">🎮</span>
              <h3>No games found</h3>
              <p>Try a different search term or category</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .games-hub {
          min-height: 100vh;
          padding: 40px 0 80px;
        }

        /* Header */
        .hub-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 32px;
          margin-bottom: 48px;
        }

        .header-content {
          flex: 1;
        }

        .hub-title {
          font-family: 'Cinzel', serif;
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .title-icon {
          font-size: 36px;
        }

        .hub-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          min-width: 300px;
          transition: all 0.2s ease;
        }

        .search-box:focus-within {
          border-color: var(--gold);
          box-shadow: 0 0 20px var(--gold-glow);
        }

        .search-icon {
          font-size: 18px;
          opacity: 0.6;
        }

        .search-input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          font-size: 15px;
          color: var(--text-primary);
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        /* Quick Section - Hot Games */
        .quick-section {
          margin-bottom: 48px;
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-title {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 4px;
        }

        .section-desc {
          font-size: 14px;
          color: var(--text-muted);
        }

        .hot-games-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        .hot-game-card {
          position: relative;
          padding: 24px;
          background: linear-gradient(135deg, rgba(255, 71, 87, 0.1), rgba(255, 215, 0, 0.05));
          border: 1px solid rgba(255, 71, 87, 0.2);
          border-radius: var(--radius-xl);
          text-decoration: none;
          overflow: hidden;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease backwards;
        }

        .hot-game-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 71, 87, 0.5);
          box-shadow: 0 20px 40px rgba(255, 71, 87, 0.2);
        }

        .hot-game-bg {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.2;
        }

        .hot-game-bg .hot-game-icon {
          font-size: 80px;
        }

        .hot-game-info {
          position: relative;
          z-index: 1;
        }

        .hot-game-name {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .hot-game-meta {
          display: flex;
          gap: 12px;
        }

        .meta-item {
          font-size: 13px;
          color: var(--gold);
          font-weight: 600;
        }

        .hot-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 4px 12px;
          background: linear-gradient(135deg, var(--red), var(--red-dark));
          color: white;
          font-size: 10px;
          font-weight: 800;
          border-radius: var(--radius-full);
          letter-spacing: 1px;
        }

        /* Categories */
        .categories-bar {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          margin-bottom: 32px;
          overflow-x: auto;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 24px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .category-btn:hover {
          color: var(--text-primary);
          background: var(--bg-card);
        }

        .category-btn.active {
          background: rgba(255, 215, 0, 0.1);
          border-color: var(--border-gold);
          color: var(--gold);
        }

        .cat-icon {
          font-size: 18px;
        }

        .cat-count {
          padding: 2px 8px;
          background: var(--bg-dark);
          border-radius: var(--radius-full);
          font-size: 11px;
          color: var(--text-muted);
        }

        .category-btn.active .cat-count {
          background: var(--gold);
          color: var(--bg-deepest);
        }

        /* Games Grid */
        .search-results {
          margin-bottom: 24px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .game-card {
          position: relative;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 24px;
          text-decoration: none;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease backwards;
          overflow: hidden;
        }

        .game-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: var(--gradient-gold);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .game-card:hover {
          transform: translateY(-8px);
          border-color: var(--border-gold);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), var(--shadow-gold);
        }

        .game-card:hover::before {
          transform: scaleX(1);
        }

        .game-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 5px 12px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--radius-full);
          z-index: 2;
        }

        .badge-gold {
          background: var(--gradient-gold);
          color: var(--bg-deepest);
        }

        .badge-blue {
          background: linear-gradient(135deg, var(--blue), var(--blue-dark));
          color: white;
        }

        .badge-green {
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          color: var(--bg-deepest);
        }

        .badge-purple {
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          color: white;
        }

        .badge-cyan {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--bg-deepest);
        }

        .game-visual {
          margin-bottom: 20px;
          position: relative;
        }

        .game-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
        }

        .game-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          background: var(--bg-dark);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          position: relative;
          z-index: 1;
        }

        .game-icon-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100px;
          height: 100px;
          background: var(--gold);
          border-radius: 50%;
          filter: blur(40px);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .game-card:hover .game-icon-glow {
          opacity: 0.2;
        }

        .game-provider {
          position: absolute;
          bottom: 0;
          left: 90px;
          padding: 4px 10px;
          background: var(--bg-dark);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-sm);
          font-size: 10px;
          color: var(--text-muted);
        }

        .game-content {
          margin-bottom: 20px;
        }

        .game-name {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .game-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .game-stats {
          display: flex;
          gap: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-value.gold {
          color: var(--gold);
        }

        .game-action {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
          color: var(--gold);
          font-weight: 600;
          font-size: 14px;
        }

        .play-arrow {
          transform: translateX(0);
          transition: transform 0.3s ease;
        }

        .game-card:hover .play-arrow {
          transform: translateX(5px);
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 80px 20px;
        }

        .no-results-icon {
          font-size: 64px;
          opacity: 0.3;
          margin-bottom: 16px;
          display: block;
        }

        .no-results h3 {
          font-size: 20px;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .no-results p {
          font-size: 14px;
          color: var(--text-muted);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .hot-games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 1024px) {
          .games-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hub-header {
            flex-direction: column;
            align-items: stretch;
          }

          .search-box {
            min-width: auto;
          }

          .hub-title {
            font-size: 28px;
          }

          .hot-games-grid,
          .games-grid {
            grid-template-columns: 1fr;
          }

          .categories-bar {
            padding: 12px;
            gap: 8px;
          }

          .category-btn {
            padding: 12px 16px;
            font-size: 13px;
          }

          .cat-name {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
