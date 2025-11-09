import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to Sofish Casino
            </h1>
            <p className="hero-subtitle">
              The ultimate social gambling platform with skill-based games and instant rewards
            </p>
            <div className="hero-cta">
              <Link to="/login">
                <button className="btn btn-primary btn-lg">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">$1.2M+</div>
              <div className="stat-label">Total Payouts</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Players</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">10M+</div>
              <div className="stat-label">Games Played</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="games-section">
        <div className="container">
          <h2 className="section-title">Popular Games</h2>
          <div className="games-grid">
            <Link to="/fishing" className="game-card">
              <div className="game-card-badge new">NEW</div>
              <div className="game-card-icon">🎣</div>
              <h3 className="game-card-title">Fish Hunter</h3>
              <p className="game-card-desc">Shoot fish and win rewards. Skill-based arcade action.</p>
              <div className="game-card-footer">
                <span className="game-tag">Skill Game</span>
              </div>
            </Link>

            <Link to="/slots" className="game-card">
              <div className="game-card-badge hot">HOT</div>
              <div className="game-card-icon">🎰</div>
              <h3 className="game-card-title">Slots</h3>
              <p className="game-card-desc">Spin the reels and win up to 100x your bet.</p>
              <div className="game-card-footer">
                <span className="game-tag">Classic</span>
              </div>
            </Link>

            <Link to="/roulette" className="game-card">
              <div className="game-card-icon">🎲</div>
              <h3 className="game-card-title">Roulette</h3>
              <p className="game-card-desc">Place your bets on red, black, or numbers.</p>
              <div className="game-card-footer">
                <span className="game-tag">Table Game</span>
              </div>
            </Link>

            <Link to="/blackjack" className="game-card">
              <div className="game-card-icon">🃏</div>
              <h3 className="game-card-title">Blackjack</h3>
              <p className="game-card-desc">Beat the dealer and get 21. Classic card game.</p>
              <div className="game-card-footer">
                <span className="game-tag">Card Game</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Sofish?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Instant Deposits</h3>
              <p className="feature-desc">Start playing immediately with instant token deposits</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure & Fair</h3>
              <p className="feature-desc">Provably fair games with secure authentication</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎁</div>
              <h3 className="feature-title">Daily Rewards</h3>
              <p className="feature-desc">Get free tokens every day just for logging in</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Mobile Ready</h3>
              <p className="feature-desc">Play on any device, anywhere, anytime</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          min-height: 100vh;
        }

        .hero {
          padding: 80px 0 60px;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 700;
          margin-bottom: 20px;
          color: var(--text-primary);
          letter-spacing: -1px;
        }

        .hero-subtitle {
          font-size: 20px;
          color: var(--text-secondary);
          margin-bottom: 40px;
          line-height: 1.6;
        }

        .hero-cta {
          margin-top: 32px;
        }

        .stats-section {
          padding: 60px 0;
          background: var(--dark-card);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 32px;
        }

        .stat-card {
          text-align: center;
        }

        .stat-number {
          font-size: 40px;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .games-section {
          padding: 80px 0;
        }

        .section-title {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 40px;
          color: var(--text-primary);
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .game-card {
          background: var(--dark-card);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 24px;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }

        .game-card:hover {
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-4px);
        }

        .game-card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .game-card-badge.new {
          background: var(--primary);
          color: #000;
        }

        .game-card-badge.hot {
          background: var(--red);
          color: white;
        }

        .game-card-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .game-card-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .game-card-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
        }

        .game-card-footer {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .game-tag {
          font-size: 12px;
          color: var(--text-muted);
          padding: 4px 12px;
          background: var(--dark-bg);
          border-radius: 6px;
          border: 1px solid var(--border-subtle);
        }

        .features-section {
          padding: 80px 0;
          background: var(--dark-card);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 32px;
        }

        .feature-card {
          text-align: center;
        }

        .feature-icon {
          font-size: 40px;
          margin-bottom: 16px;
        }

        .feature-title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .feature-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .section-title {
            font-size: 24px;
          }

          .games-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
