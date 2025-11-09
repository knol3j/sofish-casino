import { Link } from 'react-router-dom'

// Provider Games - Professional casino slot providers
const providerGames = [
  {
    id: 'endorphina-satoshi',
    name: "Satoshi's Secret",
    provider: 'Endorphina',
    icon: '₿',
    url: '/slots/endorphina/satoshis-secret',
    description: 'Cryptocurrency mystery with respin feature',
    minBet: 10,
    maxWin: '50,000x',
    rtp: '96%',
    color: '#FFD700',
    featured: true,
    volatility: 'High'
  }
]

const slotGames = [
  {
    id: 'classic',
    name: '777 Classic Slots',
    icon: '🎰',
    theme: 'classic',
    description: 'Traditional casino slots with lucky 7s, bars, and cherries',
    minBet: 10,
    maxWin: '100x',
    jackpot: '50,000',
    color: '#FFD700',
    popular: true
  },
  {
    id: 'fruit',
    name: 'Fruit Mania',
    icon: '🍒',
    theme: 'fruit',
    description: 'Juicy fruits with explosive wins and bonus rounds',
    minBet: 5,
    maxWin: '150x',
    jackpot: '75,000',
    color: '#FF6B6B',
    hot: true
  },
  {
    id: 'diamond',
    name: 'Diamond Deluxe',
    icon: '💎',
    theme: 'luxury',
    description: 'Sparkling gems and diamonds for massive payouts',
    minBet: 50,
    maxWin: '500x',
    jackpot: '250,000',
    color: '#00D4FF',
    featured: true
  },
  {
    id: 'dragon',
    name: "Dragon's Fortune",
    icon: '🐉',
    theme: 'asian',
    description: 'Ancient dragons guard incredible treasures',
    minBet: 25,
    maxWin: '300x',
    jackpot: '150,000',
    color: '#FF4500'
  },
  {
    id: 'vegas',
    name: 'Vegas Nights',
    icon: '🌟',
    theme: 'neon',
    description: 'Neon lights and big city wins under the Vegas sky',
    minBet: 20,
    maxWin: '200x',
    jackpot: '100,000',
    color: '#FF00FF',
    new: true
  },
  {
    id: 'ocean',
    name: 'Ocean Treasures',
    icon: '🌊',
    theme: 'underwater',
    description: 'Dive deep for underwater riches and sea creatures',
    minBet: 15,
    maxWin: '250x',
    jackpot: '120,000',
    color: '#00CED1'
  }
]

export function SlotsHub() {
  return (
    <div className="slots-hub">
      <div className="container">
        {/* Hero Banner */}
        <div className="hub-hero">
          <h1 className="hub-title">
            <span className="glitter-text">🎰 PREMIUM SLOTS 🎰</span>
          </h1>
          <p className="hub-subtitle">
            Choose from 6 exciting slot machines • Progressive Jackpots • Massive Wins
          </p>
          <div className="jackpot-ticker">
            <div className="ticker-label">🏆 TOTAL JACKPOT</div>
            <div className="ticker-amount glow-text">$745,000</div>
            <div className="ticker-pulse"></div>
          </div>
        </div>

        {/* Provider Games Section */}
        <div className="provider-section">
          <h2 className="section-title">
            <span className="title-icon">🎯</span>
            TOP PROVIDER GAMES
            <span className="title-badge">NEW</span>
          </h2>
          <div className="provider-grid">
            {providerGames.map((game) => (
              <Link
                key={game.id}
                to={game.url}
                className="provider-card"
                style={{ '--provider-color': game.color } as any}
              >
                <div className="provider-badge">{game.provider}</div>
                {game.featured && <div className="slot-badge featured">⭐ FEATURED</div>}

                <div className="provider-icon-wrapper">
                  <div className="provider-icon glow-effect">{game.icon}</div>
                </div>

                <h3 className="provider-game-name">{game.name}</h3>
                <p className="provider-desc">{game.description}</p>

                <div className="provider-stats">
                  <div className="stat">
                    <span className="stat-label">RTP</span>
                    <span className="stat-value highlight">{game.rtp}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Max Win</span>
                    <span className="stat-value highlight">{game.maxWin}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Volatility</span>
                    <span className="stat-value">{game.volatility}</span>
                  </div>
                </div>

                <button className="provider-play-btn">
                  <span>PLAY NOW</span>
                  <span className="btn-arrow">→</span>
                </button>
              </Link>
            ))}

            {/* Coming Soon Cards */}
            <div className="coming-soon-card" style={{ '--provider-color': '#9D00FF' } as any}>
              <div className="provider-badge">BETSOFT</div>
              <div className="coming-soon-label">🚀 COMING SOON</div>
              <div className="provider-icon-wrapper">
                <div className="provider-icon">💃</div>
              </div>
              <h3 className="provider-game-name">Good Girl Bad Girl</h3>
              <p className="provider-desc">Dual-sided 3D cinematic slot</p>
            </div>

            <div className="coming-soon-card" style={{ '--provider-color': '#00D66B' } as any}>
              <div className="provider-badge">BGAMING</div>
              <div className="coming-soon-label">🚀 COMING SOON</div>
              <div className="provider-icon-wrapper">
                <div className="provider-icon">📖</div>
              </div>
              <h3 className="provider-game-name">Book of Cats Megaways</h3>
              <p className="provider-desc">117,649 ways to win</p>
            </div>
          </div>
        </div>

        {/* Original Themed Slots */}
        <h2 className="section-title">
          <span className="title-icon">🎰</span>
          THEMED SLOT MACHINES
        </h2>

        {/* Slots Grid */}
        <div className="slots-grid">
          {slotGames.map((game) => (
            <Link
              key={game.id}
              to={`/slots/${game.id}`}
              className="slot-card"
              style={{ '--slot-color': game.color } as any}
            >
              {game.popular && <div className="slot-badge popular">🔥 POPULAR</div>}
              {game.hot && <div className="slot-badge hot">⚡ HOT</div>}
              {game.featured && <div className="slot-badge featured">⭐ FEATURED</div>}
              {game.new && <div className="slot-badge new">✨ NEW</div>}

              <div className="slot-card-glow"></div>

              <div className="slot-icon pulse-animation">{game.icon}</div>

              <h3 className="slot-name">{game.name}</h3>
              <p className="slot-desc">{game.description}</p>

              <div className="slot-stats">
                <div className="stat">
                  <span className="stat-label">Min Bet</span>
                  <span className="stat-value">{game.minBet}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">Max Win</span>
                  <span className="stat-value highlight">{game.maxWin}</span>
                </div>
              </div>

              <div className="slot-jackpot">
                <div className="jackpot-icon">💰</div>
                <div className="jackpot-info">
                  <span className="jackpot-label">Progressive Jackpot</span>
                  <span className="jackpot-value">${game.jackpot}</span>
                </div>
              </div>

              <button className="play-btn shine-effect">
                <span>PLAY NOW</span>
                <span className="btn-shine"></span>
              </button>
            </Link>
          ))}
        </div>

        {/* Features Banner */}
        <div className="features-banner">
          <div className="feature-item">
            <div className="feature-icon rotate-animation">⚡</div>
            <div className="feature-text">
              <strong>Instant Wins</strong>
              <span>No waiting, instant payouts</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon pulse-animation">💎</div>
            <div className="feature-text">
              <strong>Progressive Jackpots</strong>
              <span>Growing prizes every second</span>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon bounce-animation">🎁</div>
            <div className="feature-text">
              <strong>Bonus Rounds</strong>
              <span>Free spins and multipliers</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slots-hub {
          min-height: 100vh;
          padding: 40px 0 80px;
          background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
        }

        .hub-hero {
          text-align: center;
          margin-bottom: 60px;
          padding: 60px 20px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 0, 255, 0.1));
          border-radius: 20px;
          border: 2px solid rgba(255, 215, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .hub-hero::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            rgba(255, 215, 0, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
          100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
        }

        .hub-title {
          font-size: 56px;
          font-weight: 900;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }

        .glitter-text {
          background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700, #FFA500);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: glitter 3s linear infinite;
          text-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
        }

        @keyframes glitter {
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

        .jackpot-ticker {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: rgba(0, 0, 0, 0.6);
          padding: 20px 40px;
          border-radius: 50px;
          border: 2px solid #FFD700;
          position: relative;
          z-index: 1;
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
        }

        .ticker-label {
          font-size: 14px;
          font-weight: 700;
          color: #FFD700;
          letter-spacing: 1px;
        }

        .ticker-amount {
          font-size: 36px;
          font-weight: 900;
          color: #FFD700;
        }

        .glow-text {
          text-shadow:
            0 0 10px #FFD700,
            0 0 20px #FFD700,
            0 0 30px #FFD700;
          animation: glow-pulse 2s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700; }
          50% { text-shadow: 0 0 20px #FFD700, 0 0 40px #FFD700, 0 0 60px #FFD700; }
        }

        .ticker-pulse {
          width: 12px;
          height: 12px;
          background: #00D66B;
          border-radius: 50%;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }

        .slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 30px;
          margin-bottom: 60px;
        }

        .slot-card {
          background: linear-gradient(135deg, var(--dark-card), #1a1a2e);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 32px;
          text-decoration: none;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .slot-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: var(--slot-color);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 40px var(--slot-color);
        }

        .slot-card-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, var(--slot-color) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .slot-card:hover .slot-card-glow {
          opacity: 0.15;
        }

        .slot-badge {
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

        .slot-badge.popular {
          background: linear-gradient(135deg, #FF6B6B, #FF4444);
          color: white;
          box-shadow: 0 0 20px rgba(255, 107, 107, 0.6);
        }

        .slot-badge.hot {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
        }

        .slot-badge.featured {
          background: linear-gradient(135deg, #00D4FF, #0099CC);
          color: white;
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
        }

        .slot-badge.new {
          background: linear-gradient(135deg, #00D66B, #00A854);
          color: white;
          box-shadow: 0 0 20px rgba(0, 214, 107, 0.6);
        }

        .slot-icon {
          font-size: 72px;
          text-align: center;
          margin-bottom: 20px;
          filter: drop-shadow(0 0 20px var(--slot-color));
        }

        .pulse-animation {
          animation: icon-pulse 2s ease-in-out infinite;
        }

        @keyframes icon-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .rotate-animation {
          animation: rotate 3s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .bounce-animation {
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .slot-name {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
          text-align: center;
        }

        .slot-desc {
          font-size: 14px;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 24px;
          line-height: 1.6;
        }

        .slot-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .stat {
          flex: 1;
          text-align: center;
        }

        .stat-label {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 4px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .stat-value.highlight {
          color: var(--slot-color);
        }

        .slot-jackpot {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 12px;
          margin-bottom: 20px;
        }

        .jackpot-icon {
          font-size: 32px;
          animation: coin-spin 3s linear infinite;
        }

        @keyframes coin-spin {
          0%, 100% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
        }

        .jackpot-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .jackpot-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .jackpot-value {
          font-size: 20px;
          font-weight: 700;
          color: #FFD700;
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

        .btn-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shine 3s infinite;
        }

        @keyframes shine {
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
          border: 1px solid rgba(255, 215, 0, 0.2);
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

        /* Provider Section Styles */
        .provider-section {
          margin-bottom: 60px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 900;
          text-align: center;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
          color: var(--text-primary);
          font-family: 'Cinzel', serif;
        }

        .title-icon {
          font-size: 42px;
        }

        .title-badge {
          background: linear-gradient(135deg, var(--primary), #00A854);
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 1px;
          box-shadow: 0 0 20px rgba(0, 214, 107, 0.5);
          animation: badge-pulse 2s ease-in-out infinite;
        }

        @keyframes badge-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .provider-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 30px;
        }

        .provider-card, .coming-soon-card {
          background: linear-gradient(135deg, var(--dark-card), var(--dark-bg));
          border: 2px solid transparent;
          border-radius: 20px;
          padding: 30px;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          text-decoration: none;
          display: flex;
          flex-direction: column;
        }

        .provider-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent,
            var(--provider-color, var(--primary)),
            transparent
          );
          opacity: 0;
          transform: rotate(45deg);
          transition: opacity 0.5s;
        }

        .provider-card:hover::before {
          opacity: 0.1;
          animation: provider-shine 1.5s linear infinite;
        }

        @keyframes provider-shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }

        .provider-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: var(--provider-color, var(--primary));
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 40px var(--provider-color, var(--primary));
        }

        .coming-soon-card {
          opacity: 0.7;
          cursor: default;
        }

        .coming-soon-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, rgba(0, 214, 107, 0.95), rgba(0, 157, 204, 0.95));
          color: white;
          padding: 15px 30px;
          border-radius: 25px;
          font-size: 18px;
          font-weight: 900;
          z-index: 10;
          box-shadow: 0 0 30px rgba(0, 214, 107, 0.8);
        }

        .provider-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: linear-gradient(135deg, #FF6B00, #FF8C00);
          color: white;
          padding: 6px 16px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 1px;
          box-shadow: 0 0 15px rgba(255, 140, 0, 0.5);
        }

        .provider-icon-wrapper {
          width: 120px;
          height: 120px;
          margin: 20px auto;
          position: relative;
        }

        .provider-icon {
          font-size: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          animation: provider-float 3s ease-in-out infinite;
        }

        @keyframes provider-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .glow-effect {
          filter: drop-shadow(0 0 20px var(--provider-color, #FFD700));
        }

        .provider-game-name {
          font-size: 24px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 12px;
          text-align: center;
          font-family: 'Cinzel', serif;
        }

        .provider-desc {
          font-size: 14px;
          color: var(--text-secondary);
          text-align: center;
          margin-bottom: 25px;
          line-height: 1.6;
        }

        .provider-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 25px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .provider-stats .stat {
          text-align: center;
        }

        .provider-stats .stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .provider-stats .stat-value {
          font-size: 18px;
          font-weight: 900;
          color: var(--text-primary);
        }

        .provider-stats .stat-value.highlight {
          color: var(--provider-color, var(--primary));
          text-shadow: 0 0 10px var(--provider-color, var(--primary));
        }

        .provider-play-btn {
          width: 100%;
          padding: 16px;
          background: linear-gradient(135deg, var(--provider-color, var(--primary)), var(--primary-dark));
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 900;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: auto;
        }

        .provider-play-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px var(--provider-color, var(--primary));
        }

        .btn-arrow {
          font-size: 24px;
          transition: transform 0.3s ease;
        }

        .provider-card:hover .btn-arrow {
          transform: translateX(5px);
        }

        @media (max-width: 768px) {
          .hub-title {
            font-size: 36px;
          }

          .slots-grid {
            grid-template-columns: 1fr;
          }

          .features-banner {
            grid-template-columns: 1fr;
            padding: 24px;
          }
        }
      `}</style>
    </div>
  )
}
