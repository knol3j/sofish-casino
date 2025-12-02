import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

// Progressive Jackpot Counter Component
function JackpotCounter() {
  const [amount, setAmount] = useState(2847293.58)
  const [isIncrementing, setIsIncrementing] = useState(false)

  useEffect(() => {
    // Simulate progressive jackpot growing
    const interval = setInterval(() => {
      setIsIncrementing(true)
      setAmount(prev => prev + Math.random() * 50 + 10)
      setTimeout(() => setIsIncrementing(false), 300)
    }, 2000 + Math.random() * 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`jackpot-counter ${isIncrementing ? 'incrementing' : ''}`}>
      <div className="jackpot-label">
        <span className="jackpot-icon">🎰</span>
        <span>PROGRESSIVE JACKPOT</span>
      </div>
      <div className="jackpot-amount">
        <span className="currency">$</span>
        <span className="amount">{amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div className="jackpot-glow" />
    </div>
  )
}

// Floating Coins Component
function FloatingCoins() {
  const coins = ['🪙', '💰', '💎', '⭐', '✨']
  return (
    <div className="floating-coins">
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="floating-coin"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            animationDuration: `${8 + Math.random() * 8}s`,
            fontSize: `${20 + Math.random() * 30}px`
          }}
        >
          {coins[Math.floor(Math.random() * coins.length)]}
        </div>
      ))}
    </div>
  )
}

// Simulated live wins for the ticker
const generateLiveWin = () => {
  const games = ['Slots', 'Roulette', 'Blackjack', 'Fish Hunter']
  const names = ['Alex***', 'John***', 'Sarah***', 'Mike***', 'Emma***', 'Chris***', 'Luna***', 'Max***']
  const amounts = [150, 500, 1200, 2500, 5000, 8500, 12000, 25000, 50000]
  return {
    id: Date.now() + Math.random(),
    player: names[Math.floor(Math.random() * names.length)],
    game: games[Math.floor(Math.random() * games.length)],
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    time: 'Just now'
  }
}

const FEATURED_GAMES = [
  {
    id: 'fish-hunter',
    name: 'Fish Hunter',
    description: 'Skill-based arcade action with massive multipliers',
    image: '🎣',
    badge: 'FEATURED',
    badgeType: 'gold',
    rtp: '96.5%',
    maxWin: '5,000x',
    path: '/fishing-hub'
  },
  {
    id: 'dragon-slots',
    name: "Dragon's Fortune",
    description: 'Epic Asian-themed slots with 888x jackpots',
    image: '🐉',
    badge: 'HOT',
    badgeType: 'red',
    rtp: '97.2%',
    maxWin: '888x',
    path: '/slots/dragon'
  },
  {
    id: 'diamond-slots',
    name: 'Diamond Deluxe',
    description: 'Luxury high-roller slots experience',
    image: '💎',
    badge: 'VIP',
    badgeType: 'purple',
    rtp: '98.1%',
    maxWin: '500x',
    path: '/slots/diamond'
  },
  {
    id: 'roulette',
    name: 'European Roulette',
    description: 'Classic casino table game with premium graphics',
    image: '🎰',
    badge: 'CLASSIC',
    badgeType: 'blue',
    rtp: '97.3%',
    maxWin: '35x',
    path: '/roulette'
  },
  {
    id: 'blackjack',
    name: 'Blackjack Pro',
    description: 'Beat the dealer with strategy and skill',
    image: '🃏',
    badge: 'POPULAR',
    badgeType: 'green',
    rtp: '99.5%',
    maxWin: '3x',
    path: '/blackjack'
  },
  {
    id: 'satoshi',
    name: "Satoshi's Secret",
    description: 'Crypto-themed 5-reel adventure',
    image: '₿',
    badge: 'NEW',
    badgeType: 'cyan',
    rtp: '96.8%',
    maxWin: '50,000x',
    path: '/slots/endorphina/satoshis-secret'
  }
]

const VIP_TIERS = [
  { name: 'Bronze', icon: '🥉', cashback: '5%', bonus: '10%', color: '#CD7F32' },
  { name: 'Silver', icon: '🥈', cashback: '10%', bonus: '25%', color: '#C0C0C0' },
  { name: 'Gold', icon: '🥇', cashback: '15%', bonus: '50%', color: '#FFD700' },
  { name: 'Platinum', icon: '💎', cashback: '20%', bonus: '100%', color: '#E5E4E2' },
  { name: 'Diamond', icon: '👑', cashback: '25%', bonus: '200%', color: '#B9F2FF' }
]

export function Home() {
  const [liveWins, setLiveWins] = useState<Array<{ id: number; player: string; game: string; amount: number; time: string }>>([])
  const [activeGameIndex, setActiveGameIndex] = useState(0)

  useEffect(() => {
    // Initialize with some wins
    const initialWins = Array(5).fill(null).map(() => generateLiveWin())
    setLiveWins(initialWins)

    // Add new wins periodically
    const interval = setInterval(() => {
      setLiveWins(prev => {
        const newWin = generateLiveWin()
        return [newWin, ...prev.slice(0, 9)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveGameIndex(prev => (prev + 1) % FEATURED_GAMES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-particles">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="particle" style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }} />
            ))}
          </div>
          <FloatingCoins />
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
          <div className="hero-glow hero-glow-3" />
          <div className="neon-grid" />
        </div>

        <div className="container">
          <div className="hero-content">
            <div className="hero-badge animate-fadeInDown">
              <span className="badge-icon">⭐</span>
              <span>Premium Gaming Experience</span>
            </div>

            {/* Progressive Jackpot */}
            <JackpotCounter />

            <h1 className="hero-title animate-fadeInUp">
              Welcome to <span className="text-gradient-gold">SOFISH</span>
              <br />
              <span className="hero-title-sub">Casino</span>
            </h1>

            <p className="hero-subtitle animate-fadeInUp">
              Experience the thrill of Las Vegas from anywhere. Premium games,
              instant payouts, and exclusive rewards await you.
            </p>

            <div className="hero-stats animate-fadeInUp">
              <div className="hero-stat">
                <div className="hero-stat-value">$2.5M+</div>
                <div className="hero-stat-label">Total Payouts</div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <div className="hero-stat-value">100K+</div>
                <div className="hero-stat-label">Active Players</div>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat">
                <div className="hero-stat-value">50M+</div>
                <div className="hero-stat-label">Games Played</div>
              </div>
            </div>

            <div className="hero-cta animate-fadeInUp">
              <Link to="/login">
                <button className="btn btn-primary btn-xl hero-btn">
                  <span>🎰</span>
                  Start Playing Now
                </button>
              </Link>
              <Link to="/games">
                <button className="btn btn-outline btn-xl">
                  Explore Games
                </button>
              </Link>
            </div>

            <div className="hero-trust animate-fadeIn">
              <div className="trust-item">
                <span className="trust-icon">🔒</span>
                <span>Secure & Fair</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">⚡</span>
                <span>Instant Payouts</span>
              </div>
              <div className="trust-item">
                <span className="trust-icon">🏆</span>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Wins Ticker */}
      <section className="live-wins-section">
        <div className="container">
          <div className="live-wins-header">
            <div className="live-indicator">
              <span className="live-dot" />
              <span>LIVE WINS</span>
            </div>
          </div>
          <div className="live-wins-ticker">
            <div className="ticker-track">
              {liveWins.map((win) => (
                <div key={win.id} className="win-item animate-slideInLeft">
                  <span className="win-player">{win.player}</span>
                  <span className="win-text">won</span>
                  <span className="win-amount">{win.amount.toLocaleString()}</span>
                  <span className="win-tokens">tokens</span>
                  <span className="win-game">in {win.game}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <span className="label-icon">🔥</span>
              Featured Games
            </div>
            <h2 className="section-title">
              Play the <span className="text-gradient-gold">Best Games</span>
            </h2>
            <p className="section-subtitle">
              Hand-picked selection of our most popular and rewarding games
            </p>
          </div>

          <div className="featured-grid">
            {FEATURED_GAMES.map((game, index) => (
              <Link
                key={game.id}
                to={game.path}
                className={`game-card ${index === activeGameIndex ? 'game-card-featured' : ''}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`game-badge badge-${game.badgeType}`}>
                  {game.badge}
                </div>

                <div className="game-icon-wrapper">
                  <div className="game-icon">{game.image}</div>
                  <div className="game-icon-glow" />
                </div>

                <div className="game-info">
                  <h3 className="game-name">{game.name}</h3>
                  <p className="game-desc">{game.description}</p>
                </div>

                <div className="game-stats">
                  <div className="game-stat">
                    <span className="stat-label">RTP</span>
                    <span className="stat-value">{game.rtp}</span>
                  </div>
                  <div className="game-stat">
                    <span className="stat-label">Max Win</span>
                    <span className="stat-value text-gold">{game.maxWin}</span>
                  </div>
                </div>

                <div className="game-play-btn">
                  <span>Play Now</span>
                  <span className="play-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="section-cta">
            <Link to="/games">
              <button className="btn btn-secondary btn-lg">
                View All Games
                <span>→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotions Banner */}
      <section className="promo-section">
        <div className="container">
          <div className="promo-banner">
            <div className="promo-bg">
              <div className="promo-shine" />
            </div>
            <div className="promo-content">
              <div className="promo-icon">🎁</div>
              <div className="promo-text">
                <h3 className="promo-title">Welcome Bonus</h3>
                <p className="promo-desc">Get 1,000 FREE tokens when you sign up today!</p>
              </div>
              <Link to="/login">
                <button className="btn btn-primary btn-lg promo-btn">
                  Claim Now
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Section */}
      <section className="vip-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <span className="label-icon">👑</span>
              Exclusive Rewards
            </div>
            <h2 className="section-title">
              <span className="text-gradient-gold">VIP</span> Club Benefits
            </h2>
            <p className="section-subtitle">
              Unlock exclusive perks and rewards as you climb the VIP tiers
            </p>
          </div>

          <div className="vip-tiers">
            {VIP_TIERS.map((tier, index) => (
              <div
                key={tier.name}
                className="vip-tier"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="tier-icon" style={{ color: tier.color }}>
                  {tier.icon}
                </div>
                <h4 className="tier-name" style={{ color: tier.color }}>
                  {tier.name}
                </h4>
                <div className="tier-benefits">
                  <div className="tier-benefit">
                    <span className="benefit-value">{tier.cashback}</span>
                    <span className="benefit-label">Cashback</span>
                  </div>
                  <div className="tier-benefit">
                    <span className="benefit-value">{tier.bonus}</span>
                    <span className="benefit-label">Bonus</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-cta">
            <Link to="/vip">
              <button className="btn btn-outline btn-lg">
                Learn More About VIP
                <span>→</span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <div className="section-label">
              <span className="label-icon">✨</span>
              Why Choose Us
            </div>
            <h2 className="section-title">
              The <span className="text-gradient-gold">Premium</span> Experience
            </h2>
          </div>

          <div className="features-grid">
            <div className="feature-card animate-fadeInUp">
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎮</span>
              </div>
              <h3 className="feature-title">Premium Games</h3>
              <p className="feature-desc">
                Curated collection of the best casino games with stunning graphics and smooth gameplay
              </p>
            </div>

            <div className="feature-card animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">⚡</span>
              </div>
              <h3 className="feature-title">Instant Payouts</h3>
              <p className="feature-desc">
                Win and get your tokens instantly. No waiting, no delays, just pure excitement
              </p>
            </div>

            <div className="feature-card animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🔒</span>
              </div>
              <h3 className="feature-title">Secure Platform</h3>
              <p className="feature-desc">
                Bank-grade security with encrypted transactions and provably fair games
              </p>
            </div>

            <div className="feature-card animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🎁</span>
              </div>
              <h3 className="feature-title">Daily Rewards</h3>
              <p className="feature-desc">
                Claim free tokens every day with our generous daily bonus system
              </p>
            </div>

            <div className="feature-card animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">📱</span>
              </div>
              <h3 className="feature-title">Play Anywhere</h3>
              <p className="feature-desc">
                Fully responsive design works perfectly on desktop, tablet, and mobile
              </p>
            </div>

            <div className="feature-card animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              <div className="feature-icon-wrapper">
                <span className="feature-icon">🏆</span>
              </div>
              <h3 className="feature-title">Leaderboards</h3>
              <p className="feature-desc">
                Compete with players worldwide and climb to the top of our leaderboards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg">
              <div className="cta-particles">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="cta-particle" style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`
                  }} />
                ))}
              </div>
            </div>
            <div className="cta-content">
              <h2 className="cta-title">Ready to Win Big?</h2>
              <p className="cta-subtitle">
                Join thousands of players and start your winning journey today
              </p>
              <Link to="/login">
                <button className="btn btn-primary btn-xl">
                  <span>🚀</span>
                  Get Started Free
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          padding: 100px 0 80px;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .hero-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .hero-particles .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--gold);
          border-radius: 50%;
          animation: float-particle linear infinite;
          opacity: 0.3;
        }

        @keyframes float-particle {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }

        .hero-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.4;
        }

        .hero-glow-1 {
          width: 600px;
          height: 600px;
          background: var(--gold);
          top: -200px;
          right: -100px;
          animation: glow-pulse 8s ease-in-out infinite;
        }

        .hero-glow-2 {
          width: 400px;
          height: 400px;
          background: var(--accent);
          bottom: 0;
          left: -100px;
          animation: glow-pulse 10s ease-in-out infinite reverse;
        }

        .hero-glow-3 {
          width: 300px;
          height: 300px;
          background: var(--primary);
          top: 50%;
          left: 50%;
          animation: glow-pulse 6s ease-in-out infinite;
        }

        @keyframes glow-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0.5; }
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          background: var(--bg-glass);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-full);
          font-size: 14px;
          font-weight: 600;
          color: var(--gold);
          margin-bottom: 32px;
          backdrop-filter: blur(10px);
        }

        .badge-icon {
          animation: bounce 1s ease-in-out infinite;
        }

        .hero-title {
          font-family: 'Cinzel', serif;
          font-size: 72px;
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 24px;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .hero-title-sub {
          font-size: 56px;
          color: var(--text-secondary);
        }

        .hero-subtitle {
          font-size: 20px;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto 40px;
          line-height: 1.7;
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 40px;
          margin-bottom: 48px;
          padding: 24px 48px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          backdrop-filter: blur(20px);
        }

        .hero-stat {
          text-align: center;
        }

        .hero-stat-value {
          font-family: 'Cinzel', serif;
          font-size: 32px;
          font-weight: 800;
          color: var(--gold);
          text-shadow: 0 0 20px var(--gold-glow);
        }

        .hero-stat-label {
          font-size: 13px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 4px;
        }

        .hero-stat-divider {
          width: 1px;
          height: 50px;
          background: var(--border-light);
        }

        .hero-cta {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 48px;
        }

        .hero-btn {
          animation: glow 2s ease-in-out infinite;
        }

        .hero-trust {
          display: flex;
          justify-content: center;
          gap: 32px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .trust-icon {
          font-size: 18px;
        }

        /* Live Wins Section */
        .live-wins-section {
          padding: 24px 0;
          background: var(--bg-dark);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
        }

        .live-wins-header {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: var(--red);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: var(--red);
          border-radius: 50%;
          animation: pulse 1s ease-in-out infinite;
        }

        .live-wins-ticker {
          overflow: hidden;
        }

        .ticker-track {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          padding: 8px 0;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .ticker-track::-webkit-scrollbar {
          display: none;
        }

        .win-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--bg-glass);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          white-space: nowrap;
          flex-shrink: 0;
        }

        .win-player {
          font-weight: 600;
          color: var(--text-primary);
        }

        .win-text {
          color: var(--text-muted);
        }

        .win-amount {
          font-weight: 700;
          color: var(--gold);
        }

        .win-tokens {
          color: var(--text-muted);
        }

        .win-game {
          color: var(--text-secondary);
          font-size: 13px;
        }

        /* Section Styles */
        .section-header {
          text-align: center;
          margin-bottom: 48px;
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 16px;
        }

        .label-icon {
          font-size: 16px;
        }

        .section-title {
          font-family: 'Cinzel', serif;
          font-size: 42px;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .section-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          max-width: 600px;
          margin: 0 auto;
        }

        .section-cta {
          text-align: center;
          margin-top: 48px;
        }

        /* Featured Games */
        .featured-section {
          padding: 100px 0;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .game-card {
          position: relative;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 28px;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          animation: fadeInUp 0.6s ease backwards;
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
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), var(--shadow-gold);
        }

        .game-card:hover::before {
          transform: scaleX(1);
        }

        .game-card-featured {
          border-color: var(--border-gold);
          box-shadow: var(--shadow-gold);
        }

        .game-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 14px;
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: var(--radius-full);
        }

        .badge-gold {
          background: var(--gradient-gold);
          color: var(--bg-deepest);
        }

        .badge-red {
          background: linear-gradient(135deg, var(--red), var(--red-dark));
          color: white;
        }

        .badge-purple {
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          color: white;
        }

        .badge-blue {
          background: linear-gradient(135deg, var(--blue), var(--blue-dark));
          color: white;
        }

        .badge-green {
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          color: var(--bg-deepest);
        }

        .badge-cyan {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: var(--bg-deepest);
        }

        .game-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin-bottom: 20px;
        }

        .game-icon {
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          background: var(--bg-dark);
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-light);
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
          opacity: 0.3;
        }

        .game-info {
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
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .game-stats {
          display: flex;
          gap: 24px;
          padding: 16px 0;
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          margin-bottom: 20px;
        }

        .game-stat {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .game-play-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          font-weight: 600;
          color: var(--gold);
        }

        .play-arrow {
          transform: translateX(0);
          transition: transform 0.3s ease;
        }

        .game-card:hover .play-arrow {
          transform: translateX(5px);
        }

        /* Promo Banner */
        .promo-section {
          padding: 40px 0;
        }

        .promo-banner {
          position: relative;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1));
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-xl);
          padding: 40px;
          overflow: hidden;
        }

        .promo-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .promo-shine {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 40%,
            rgba(255, 215, 0, 0.1) 50%,
            transparent 60%
          );
          animation: shine 3s linear infinite;
        }

        @keyframes shine {
          from { transform: translateX(-50%) translateY(-50%) rotate(0deg); }
          to { transform: translateX(-50%) translateY(-50%) rotate(360deg); }
        }

        .promo-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 24px;
          z-index: 1;
        }

        .promo-icon {
          font-size: 64px;
          animation: bounce 2s ease-in-out infinite;
        }

        .promo-text {
          flex: 1;
        }

        .promo-title {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 8px;
        }

        .promo-desc {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .promo-btn {
          flex-shrink: 0;
        }

        /* VIP Section */
        .vip-section {
          padding: 100px 0;
          background: var(--bg-dark);
        }

        .vip-tiers {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .vip-tier {
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 32px;
          text-align: center;
          min-width: 180px;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease backwards;
        }

        .vip-tier:hover {
          transform: translateY(-8px);
          border-color: var(--border-gold);
          box-shadow: var(--shadow-gold);
        }

        .tier-icon {
          font-size: 48px;
          margin-bottom: 16px;
          filter: drop-shadow(0 0 10px currentColor);
        }

        .tier-name {
          font-family: 'Cinzel', serif;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .tier-benefits {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .tier-benefit {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .benefit-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .benefit-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Features Section */
        .features-section {
          padding: 100px 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .feature-card {
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 40px 32px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: var(--border-gold);
          box-shadow: var(--shadow-gold);
        }

        .feature-icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, var(--bg-card), var(--bg-dark));
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-icon {
          font-size: 36px;
        }

        .feature-title {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .feature-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* CTA Section */
        .cta-section {
          padding: 80px 0;
        }

        .cta-card {
          position: relative;
          background: linear-gradient(135deg, var(--bg-card), var(--bg-dark));
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-xl);
          padding: 80px;
          text-align: center;
          overflow: hidden;
          box-shadow: var(--shadow-gold);
        }

        .cta-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .cta-particles {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .cta-particle {
          position: absolute;
          width: 6px;
          height: 6px;
          background: var(--gold);
          border-radius: 50%;
          animation: float-particle 10s linear infinite;
          opacity: 0.3;
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-title {
          font-family: 'Cinzel', serif;
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 16px;
          background: var(--gradient-gold-shine);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .cta-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 32px;
        }

        /* Progressive Jackpot Counter */
        .jackpot-counter {
          position: relative;
          margin-bottom: 32px;
          padding: 24px 48px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1));
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-xl);
          display: inline-block;
          overflow: hidden;
          animation: jackpot-pulse 3s ease-in-out infinite;
        }

        .jackpot-counter::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #FFD700, #FF6347, #FFD700, #00D4AA, #FFD700);
          background-size: 400% 400%;
          z-index: -1;
          border-radius: var(--radius-xl);
          animation: gradient-rotate 4s linear infinite;
          filter: blur(3px);
        }

        @keyframes gradient-rotate {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes jackpot-pulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(255, 215, 0, 0.3); }
          50% { transform: scale(1.02); box-shadow: 0 0 60px rgba(255, 215, 0, 0.5); }
        }

        .jackpot-counter.incrementing {
          animation: jackpot-increment 0.3s ease-out;
        }

        @keyframes jackpot-increment {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        .jackpot-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 800;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 3px;
          margin-bottom: 8px;
        }

        .jackpot-icon {
          font-size: 20px;
          animation: slot-spin 2s ease-in-out infinite;
        }

        @keyframes slot-spin {
          0%, 100% { transform: rotate(0deg); }
          10% { transform: rotate(-10deg); }
          20% { transform: rotate(10deg); }
          30% { transform: rotate(0deg); }
        }

        .jackpot-amount {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 4px;
        }

        .jackpot-amount .currency {
          font-family: 'Cinzel', serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--gold);
        }

        .jackpot-amount .amount {
          font-family: 'Cinzel', serif;
          font-size: 48px;
          font-weight: 900;
          background: linear-gradient(135deg, #FFE55C 0%, #FFD700 50%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: none;
          filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.5));
        }

        .jackpot-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 150%;
          height: 150%;
          background: radial-gradient(ellipse, rgba(255, 215, 0, 0.2) 0%, transparent 70%);
          pointer-events: none;
          animation: glow-breathe 4s ease-in-out infinite;
        }

        @keyframes glow-breathe {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }

        /* Floating Coins */
        .floating-coins {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .floating-coin {
          position: absolute;
          bottom: -50px;
          animation: coin-float linear infinite;
          opacity: 0.6;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
        }

        @keyframes coin-float {
          0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-120vh) rotate(720deg) scale(0.8);
            opacity: 0;
          }
        }

        /* Neon Grid Background */
        .neon-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(rgba(255, 215, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: grid-scroll 20s linear infinite;
          opacity: 0.5;
        }

        @keyframes grid-scroll {
          0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
          100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hero {
            min-height: auto;
            padding: 60px 0;
          }

          .hero-title {
            font-size: 42px;
          }

          .hero-title-sub {
            font-size: 36px;
          }

          .hero-subtitle {
            font-size: 16px;
          }

          .hero-stats {
            flex-direction: column;
            gap: 24px;
            padding: 24px;
          }

          .hero-stat-divider {
            width: 50px;
            height: 1px;
          }

          .hero-cta {
            flex-direction: column;
          }

          .featured-grid,
          .features-grid {
            grid-template-columns: 1fr;
          }

          .vip-tiers {
            flex-direction: column;
            align-items: center;
          }

          .vip-tier {
            width: 100%;
            max-width: 300px;
          }

          .promo-content {
            flex-direction: column;
            text-align: center;
          }

          .section-title {
            font-size: 32px;
          }

          .cta-title {
            font-size: 32px;
          }

          .cta-card {
            padding: 48px 24px;
          }
        }
      `}</style>
    </div>
  )
}
