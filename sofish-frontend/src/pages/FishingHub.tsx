import { Link } from 'react-router-dom'

const fishingGames = [
  {
    id: 'classic',
    name: 'Classic Fish Hunter',
    icon: '🎣',
    description: 'The original fish shooting experience with skill-based gameplay',
    difficulty: 'Medium',
    fishTypes: 5,
    timeLimit: '30s',
    bullets: 50,
    color: '#00D66B',
    popular: true
  },
  {
    id: 'deep-sea',
    name: 'Deep Sea Adventure',
    icon: '🌊',
    description: 'Dive deep for rare sea creatures and massive rewards',
    difficulty: 'Hard',
    fishTypes: 8,
    timeLimit: '45s',
    bullets: 75,
    color: '#0099CC',
    hot: true
  },
  {
    id: 'tropical',
    name: 'Tropical Reef Paradise',
    icon: '🐠',
    description: 'Colorful tropical fish in a vibrant coral reef setting',
    difficulty: 'Easy',
    fishTypes: 6,
    timeLimit: '40s',
    bullets: 60,
    color: '#FF6B6B',
    featured: true
  },
  {
    id: 'arctic',
    name: 'Arctic Ice Challenge',
    icon: '🐧',
    description: 'Hunt arctic fish in frozen waters for icy prizes',
    difficulty: 'Very Hard',
    fishTypes: 7,
    timeLimit: '35s',
    bullets: 40,
    color: '#00CED1',
    new: true
  },
  {
    id: 'legendary',
    name: 'Legendary Hunt',
    icon: '🐋',
    description: 'Chase legendary sea monsters for epic jackpots',
    difficulty: 'Expert',
    fishTypes: 10,
    timeLimit: '60s',
    bullets: 100,
    color: '#9D00FF'
  }
]

export function FishingHub() {
  return (
    <div className="fishing-hub">
      <div className="container">
        {/* Hero Banner */}
        <div className="hub-hero">
          <h1 className="hub-title">
            <span className="wave-text">🎣 FISHING GAMES 🎣</span>
          </h1>
          <p className="hub-subtitle">
            5 Exciting Fishing Modes • Skill-Based Gameplay • Massive Multipliers
          </p>
          <div className="stats-banner">
            <div className="stat-item">
              <div className="stat-value glow-text">50+</div>
              <div className="stat-label">Fish Types</div>
            </div>
            <div className="stat-item">
              <div className="stat-value glow-text">1000x</div>
              <div className="stat-label">Max Multiplier</div>
            </div>
            <div className="stat-item">
              <div className="stat-value glow-text">∞</div>
              <div className="stat-label">Replayability</div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="fishing-grid">
          {fishingGames.map((game) => (
            <Link
              key={game.id}
              to={`/fishing/${game.id}`}
              className="fishing-card"
              style={{ '--game-color': game.color } as any}
            >
              {game.popular && <div className="game-badge popular">🔥 POPULAR</div>}
              {game.hot && <div className="game-badge hot">⚡ HOT</div>}
              {game.featured && <div className="game-badge featured">⭐ FEATURED</div>}
              {game.new && <div className="game-badge new">✨ NEW</div>}

              <div className="card-glow"></div>
              <div className="water-ripple"></div>

              <div className="game-icon float-animation">{game.icon}</div>

              <h3 className="game-name">{game.name}</h3>
              <p className="game-desc">{game.description}</p>

              <div className="game-stats">
                <div className="stat">
                  <span className="stat-icon">⚔️</span>
                  <div className="stat-info">
                    <span className="stat-label">Difficulty</span>
                    <span className="stat-value highlight">{game.difficulty}</span>
                  </div>
                </div>
                <div className="stat">
                  <span className="stat-icon">🐟</span>
                  <div className="stat-info">
                    <span className="stat-label">Fish Types</span>
                    <span className="stat-value">{game.fishTypes}</span>
                  </div>
                </div>
              </div>

              <div className="game-details">
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <span className="detail-text">{game.timeLimit}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🎯</span>
                  <span className="detail-text">{game.bullets} bullets</span>
                </div>
              </div>

              <button className="play-btn ripple-effect">
                <span>START FISHING</span>
                <span className="btn-waves"></span>
              </button>
            </Link>
          ))}
        </div>

        {/* Features Banner */}
        <div className="features-banner">
          <div className="feature-item">
            <div className="feature-icon swim-animation">🐠</div>
            <div className="feature-text">
              <strong>Skill-Based Gameplay</strong>
              <span>Your aim determines your rewards</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon bounce-animation">💰</div>
            <div className="feature-text">
              <strong>Instant Payouts</strong>
              <span>Cash out wins immediately</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon pulse-animation">⚡</div>
            <div className="feature-text">
              <strong>Power-Ups</strong>
              <span>Upgrade your shooting power</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .fishing-hub {
          min-height: 100vh;
          padding: 40px 0 80px;
          background: linear-gradient(180deg, #0a1628 0%, #0f2744 50%, #0a1628 100%);
          position: relative;
        }

        .fishing-hub::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(circle at 20% 30%, rgba(0, 214, 107, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(0, 157, 204, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }

        .hub-hero {
          text-align: center;
          margin-bottom: 60px;
          padding: 60px 20px;
          background: linear-gradient(135deg, rgba(0, 214, 107, 0.1), rgba(0, 157, 204, 0.1));
          border-radius: 20px;
          border: 2px solid rgba(0, 214, 107, 0.3);
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .hub-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 214, 107, 0.2), transparent);
          animation: wave-shimmer 3s infinite;
        }

        @keyframes wave-shimmer {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        .hub-title {
          font-size: 56px;
          font-weight: 900;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .wave-text {
          background: linear-gradient(90deg, #00D66B, #00CED1, #0099CC, #00CED1, #00D66B);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: wave-flow 4s linear infinite;
          filter: drop-shadow(0 0 20px rgba(0, 214, 107, 0.5));
        }

        @keyframes wave-flow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .hub-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 30px;
          position: relative;
          z-index: 1;
        }

        .stats-banner {
          display: flex;
          justify-content: center;
          gap: 40px;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          font-size: 40px;
          font-weight: 900;
          color: #00D66B;
          display: block;
          margin-bottom: 8px;
        }

        .glow-text {
          text-shadow:
            0 0 10px #00D66B,
            0 0 20px #00D66B,
            0 0 30px #00D66B;
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 10px #00D66B, 0 0 20px #00D66B; }
          50% { text-shadow: 0 0 20px #00D66B, 0 0 40px #00D66B, 0 0 60px #00D66B; }
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .fishing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
          position: relative;
          z-index: 1;
        }

        .fishing-card {
          background: linear-gradient(135deg, var(--dark-card), #0f2744);
          border: 2px solid rgba(0, 214, 107, 0.2);
          border-radius: 20px;
          padding: 32px;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .fishing-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: var(--game-color);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 40px var(--game-color);
        }

        .card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, var(--game-color) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .fishing-card:hover .card-glow {
          opacity: 0.15;
        }

        .water-ripple {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--game-color), transparent);
          animation: ripple 3s ease-in-out infinite;
        }

        @keyframes ripple {
          0%, 100% { transform: scaleX(0.8); opacity: 0.5; }
          50% { transform: scaleX(1.2); opacity: 1; }
        }

        .game-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          z-index: 2;
          animation: badge-float 2s ease-in-out infinite;
        }

        @keyframes badge-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .game-badge.popular {
          background: linear-gradient(135deg, #FF6B6B, #FF4444);
          color: white;
          box-shadow: 0 0 20px rgba(255, 107, 107, 0.6);
        }

        .game-badge.hot {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
        }

        .game-badge.featured {
          background: linear-gradient(135deg, #00D4FF, #0099CC);
          color: white;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
        }

        .game-badge.new {
          background: linear-gradient(135deg, #00D66B, #00A854);
          color: white;
          box-shadow: 0 0 20px rgba(0, 214, 107, 0.6);
        }

        .game-icon {
          font-size: 72px;
          text-align: center;
          margin-bottom: 20px;
          filter: drop-shadow(0 0 20px var(--game-color));
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .swim-animation {
          animation: swim 4s ease-in-out infinite;
        }

        @keyframes swim {
          0%, 100% { transform: translateX(0px); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .pulse-animation {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .bounce-animation {
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .game-name {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          text-align: center;
        }

        .game-desc {
          font-size: 14px;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .game-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .stat {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-icon {
          font-size: 24px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-value.highlight {
          color: var(--game-color);
        }

        .game-details {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
          padding: 12px;
          background: linear-gradient(135deg, rgba(0, 214, 107, 0.1), rgba(0, 157, 204, 0.1));
          border: 1px solid rgba(0, 214, 107, 0.2);
          border-radius: 12px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .detail-icon {
          font-size: 20px;
        }

        .detail-text {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .play-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border: none;
          border-radius: 12px;
          color: #000;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .play-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px var(--primary);
        }

        .btn-waves {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: waves 3s infinite;
        }

        @keyframes waves {
          0% { left: -100%; }
          50%, 100% { left: 100%; }
        }

        .features-banner {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          padding: 40px;
          background: var(--dark-card);
          border-radius: 20px;
          border: 1px solid rgba(0, 214, 107, 0.2);
          position: relative;
          z-index: 1;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .feature-icon {
          font-size: 40px;
        }

        .feature-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .feature-text strong {
          font-size: 16px;
          color: var(--text-primary);
        }

        .feature-text span {
          font-size: 13px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .hub-title {
            font-size: 36px;
          }

          .fishing-grid {
            grid-template-columns: 1fr;
          }

          .features-banner {
            grid-template-columns: 1fr;
            padding: 24px;
          }

          .stats-banner {
            gap: 20px;
          }
        }
      `}</style>
    </div>
  )
}
