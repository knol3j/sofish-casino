import { Link } from 'react-router-dom'

export function GamesHub() {
  const gameCategories = [
    {
      name: 'Fish Hunter Games',
      icon: '🎣',
      description: 'Skill-based fishing games with different modes and challenges',
      link: '/fishing-hub',
      games: 5,
      color: '#00D66B'
    },
    {
      name: 'Slot Machines',
      icon: '🎰',
      description: '6 themed slot machines with progressive jackpots',
      link: '/slots-hub',
      games: 6,
      color: '#FFD700'
    },
    {
      name: 'Roulette',
      icon: '🎲',
      description: 'Classic European roulette with multiple betting options',
      link: '/roulette',
      games: 1,
      color: '#FF6B6B'
    },
    {
      name: 'Blackjack',
      icon: '🃏',
      description: 'Beat the dealer in this classic card game',
      link: '/blackjack',
      games: 1,
      color: '#00D4FF'
    },
  ]

  return (
    <div className="games-hub-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">🎮</span>
          All Games
        </h1>

        <div className="categories-grid">
          {gameCategories.map((category, index) => (
            <Link key={index} to={category.link} className="category-card card" style={{ '--category-color': category.color } as any}>
              <div className="category-icon" style={{ color: category.color }}>
                {category.icon}
              </div>

              <h3 className="category-name">{category.name}</h3>
              <p className="category-desc">{category.description}</p>

              <div className="category-footer">
                <div className="game-count">
                  {category.games} Game{category.games > 1 ? 's' : ''}
                </div>
                <button className="play-btn" style={{ background: category.color }}>
                  Play Now →
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        .games-hub-page {
          min-height: 100vh;
          padding: 40px 0 80px;
        }

        .page-title {
          font-size: 48px;
          font-weight: 900;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--text-primary);
        }

        .title-icon {
          font-size: 56px;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
        }

        .category-card {
          padding: 32px;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .category-card:hover {
          transform: translateY(-8px);
          border-color: var(--category-color);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 40px var(--category-color);
        }

        .category-icon {
          font-size: 80px;
          margin-bottom: 20px;
          text-align: center;
        }

        .category-name {
          font-size: 28px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 12px;
          text-align: center;
        }

        .category-desc {
          font-size: 14px;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .category-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid var(--border-subtle);
        }

        .game-count {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .play-btn {
          padding: 10px 24px;
          border: none;
          border-radius: 8px;
          color: #000;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .play-btn:hover {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
