import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShaderBackground } from '../components/ShaderEffects'
import {
  CASINO_IMAGES,
  GlowingOrbs,
  JackpotDisplay,
  GameCard,
  VIPTierCard,
  FeatureCard,
  Reveal,
  FloatingElement,
  GradientText,
  TiltCard,
  Shimmer,
  staggerContainer
} from '../components/EnhancedUI'

// Simulated live wins for the ticker
const generateLiveWin = () => {
  const games = ['Slots', 'Roulette', 'Blackjack', 'Fish Hunter', "Dragon's Fortune", 'Diamond Deluxe']
  const names = ['Alex***', 'John***', 'Sarah***', 'Mike***', 'Emma***', 'Chris***', 'Luna***', 'Max***', 'Zara***', 'Leo***']
  const amounts = [150, 500, 1200, 2500, 5000, 8500, 12000, 25000, 50000, 100000]
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
    description: 'Skill-based arcade action with massive multipliers up to 5,000x',
    image: CASINO_IMAGES.fishing,
    icon: '🎣',
    badge: 'FEATURED',
    badgeColor: '#FFD700',
    rtp: '96.5%',
    maxWin: '5,000x',
    path: '/fishing-hub'
  },
  {
    id: 'dragon-slots',
    name: "Dragon's Fortune",
    description: 'Epic Asian-themed slots with legendary 888x jackpots',
    image: CASINO_IMAGES.slots.dragon,
    icon: '🐉',
    badge: 'HOT',
    badgeColor: '#FF4757',
    rtp: '97.2%',
    maxWin: '888x',
    path: '/slots/dragon'
  },
  {
    id: 'diamond-slots',
    name: 'Diamond Deluxe',
    description: 'Luxury high-roller slots for VIP players',
    image: CASINO_IMAGES.slots.diamond,
    icon: '💎',
    badge: 'VIP',
    badgeColor: '#8B5CF6',
    rtp: '98.1%',
    maxWin: '500x',
    path: '/slots/diamond'
  },
  {
    id: 'roulette',
    name: 'European Roulette',
    description: 'Classic casino table game with immersive graphics',
    image: CASINO_IMAGES.roulette,
    icon: '🎰',
    badge: 'CLASSIC',
    badgeColor: '#0095FF',
    rtp: '97.3%',
    maxWin: '35x',
    path: '/roulette'
  },
  {
    id: 'blackjack',
    name: 'Blackjack Pro',
    description: 'Beat the dealer with strategy and skill',
    image: CASINO_IMAGES.blackjack,
    icon: '🃏',
    badge: 'POPULAR',
    badgeColor: '#00D68F',
    rtp: '99.5%',
    maxWin: '3x',
    path: '/blackjack'
  },
  {
    id: 'satoshi',
    name: "Satoshi's Secret",
    description: 'Crypto-themed adventure with 50,000x potential',
    image: CASINO_IMAGES.slots.vegas,
    icon: '₿',
    badge: 'NEW',
    badgeColor: '#00D4AA',
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

const FEATURES = [
  { icon: '🎮', title: 'Premium Games', description: 'Curated collection of the best casino games with stunning graphics and smooth gameplay' },
  { icon: '⚡', title: 'Instant Payouts', description: 'Win and get your tokens instantly. No waiting, no delays, just pure excitement' },
  { icon: '🔒', title: 'Secure Platform', description: 'Bank-grade security with encrypted transactions and provably fair games' },
  { icon: '🎁', title: 'Daily Rewards', description: 'Claim free tokens every day with our generous daily bonus system' },
  { icon: '📱', title: 'Play Anywhere', description: 'Fully responsive design works perfectly on desktop, tablet, and mobile' },
  { icon: '🏆', title: 'Leaderboards', description: 'Compete with players worldwide and climb to the top of our leaderboards' }
]

// Floating Coins Component
function FloatingCoins() {
  const coins = ['🪙', '💰', '💎', '⭐', '✨', '🎰', '🎲']
  return (
    <div className="floating-coins">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="floating-coin"
          initial={{ y: '110vh', opacity: 0, rotate: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, 0.7, 0.7, 0],
            rotate: 720
          }}
          transition={{
            duration: 10 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            fontSize: `${20 + Math.random() * 30}px`,
            filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))'
          }}
        >
          {coins[Math.floor(Math.random() * coins.length)]}
        </motion.div>
      ))}
    </div>
  )
}

// Stats Counter Component
function StatsCounter({ value, label }: { value: string; label: string }) {
  return (
    <motion.div
      className="hero-stat"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className="hero-stat-value"
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <GradientText animate>{value}</GradientText>
      </motion.div>
      <div className="hero-stat-label">{label}</div>
    </motion.div>
  )
}

export function Home() {
  const [liveWins, setLiveWins] = useState<Array<{ id: number; player: string; game: string; amount: number; time: string }>>([])

  useEffect(() => {
    // Initialize with some wins
    const initialWins = Array(8).fill(null).map(() => generateLiveWin())
    setLiveWins(initialWins)

    // Add new wins periodically
    const interval = setInterval(() => {
      setLiveWins(prev => {
        const newWin = generateLiveWin()
        return [newWin, ...prev.slice(0, 11)]
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="home-page">
      {/* Holographic Shader Background */}
      <ShaderBackground type="holographic" />

      {/* Hero Section */}
      <section className="hero">
        {/* Background Image with Overlay */}
        <div className="hero-bg">
          <div className="hero-image-bg" style={{
            backgroundImage: `url(${CASINO_IMAGES.heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            inset: 0,
            opacity: 0.15
          }} />
          <GlowingOrbs count={6} colors={['#FFD700', '#8B5CF6', '#00D4AA', '#FF4757', '#00D9FF']} />
          <FloatingCoins />
          <div className="neon-grid" />
        </div>

        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⭐
              </motion.span>
              <span>Premium Gaming Experience</span>
            </motion.div>

            {/* Progressive Jackpot */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <JackpotDisplay amount={2847293.58} />
            </motion.div>

            {/* Title */}
            <motion.h1
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome to{' '}
              <Shimmer>
                <GradientText
                  gradient="linear-gradient(135deg, #FFE55C, #FFD700, #FFA500, #FFD700)"
                  animate
                >
                  SOFISH
                </GradientText>
              </Shimmer>
              <br />
              <span className="hero-title-sub">Casino</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Experience the thrill of Las Vegas from anywhere. Premium games,
              instant payouts, and exclusive rewards await you.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="hero-stats glass-pro"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <StatsCounter value="$2.5M+" label="Total Payouts" />
              <div className="hero-stat-divider" />
              <StatsCounter value="100K+" label="Active Players" />
              <div className="hero-stat-divider" />
              <StatsCounter value="50M+" label="Games Played" />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Link to="/login">
                <motion.button
                  className="btn btn-primary btn-xl"
                  whileHover={{ scale: 1.05, boxShadow: '0 10px 40px rgba(255, 215, 0, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🎰</span>
                  Start Playing Now
                </motion.button>
              </Link>
              <Link to="/games">
                <motion.button
                  className="btn btn-outline btn-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Games
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              className="hero-trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              {[
                { icon: '🔒', text: 'Secure & Fair' },
                { icon: '⚡', text: 'Instant Payouts' },
                { icon: '🏆', text: '24/7 Support' }
              ].map((item, i) => (
                <motion.div
                  key={item.text}
                  className="trust-item"
                  whileHover={{ scale: 1.1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <span className="trust-icon">{item.icon}</span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, y: { duration: 1.5, repeat: Infinity } }}
        >
          <span>Scroll to explore</span>
          <motion.div className="scroll-arrow">↓</motion.div>
        </motion.div>
      </section>

      {/* Live Wins Ticker */}
      <section className="live-wins-section">
        <div className="live-wins-header">
          <div className="live-indicator">
            <motion.span
              className="live-dot"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span>LIVE WINS</span>
          </div>
        </div>
        <div className="live-wins-ticker">
          <motion.div
            className="ticker-track"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            {[...liveWins, ...liveWins].map((win, i) => (
              <motion.div
                key={`${win.id}-${i}`}
                className="win-item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, borderColor: 'var(--gold)' }}
              >
                <span className="win-player">{win.player}</span>
                <span className="win-text">won</span>
                <motion.span
                  className="win-amount"
                  animate={{ color: ['#FFD700', '#FFA500', '#FFD700'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {win.amount.toLocaleString()}
                </motion.span>
                <span className="win-tokens">tokens</span>
                <span className="win-game">in {win.game}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="featured-section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-label">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                >
                  🔥
                </motion.span>
                Featured Games
              </div>
              <h2 className="section-title">
                Play the <GradientText>Best Games</GradientText>
              </h2>
              <p className="section-subtitle">
                Hand-picked selection of our most popular and rewarding games
              </p>
            </div>
          </Reveal>

          <motion.div
            className="featured-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {FEATURED_GAMES.map((game) => (
              <GameCard
                key={game.id}
                title={game.name}
                description={game.description}
                image={game.image}
                icon={game.icon}
                badge={game.badge}
                badgeColor={game.badgeColor}
                rtp={game.rtp}
                maxWin={game.maxWin}
                href={game.path}
              />
            ))}
          </motion.div>

          <Reveal>
            <div className="section-cta">
              <Link to="/games">
                <motion.button
                  className="btn btn-secondary btn-lg"
                  whileHover={{ scale: 1.05, borderColor: 'var(--gold)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Games
                  <span>→</span>
                </motion.button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Promotions Banner */}
      <section className="promo-section">
        <div className="container">
          <TiltCard glowColor="#FFD700" intensity={8}>
            <motion.div
              className="promo-banner"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="promo-bg">
                <motion.div
                  className="promo-shine"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <div className="promo-content">
                <FloatingElement duration={2} y={10}>
                  <div className="promo-icon">🎁</div>
                </FloatingElement>
                <div className="promo-text">
                  <h3 className="promo-title">
                    <GradientText>Welcome Bonus</GradientText>
                  </h3>
                  <p className="promo-desc">Get 1,000 FREE tokens when you sign up today!</p>
                </div>
                <Link to="/login">
                  <motion.button
                    className="btn btn-primary btn-lg promo-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Claim Now
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </TiltCard>
        </div>
      </section>

      {/* VIP Section */}
      <section className="vip-section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-label">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  👑
                </motion.span>
                Exclusive Rewards
              </div>
              <h2 className="section-title">
                <GradientText>VIP</GradientText> Club Benefits
              </h2>
              <p className="section-subtitle">
                Unlock exclusive perks and rewards as you climb the VIP tiers
              </p>
            </div>
          </Reveal>

          <div className="vip-tiers">
            {VIP_TIERS.map((tier, index) => (
              <VIPTierCard
                key={tier.name}
                name={tier.name}
                icon={tier.icon}
                color={tier.color}
                cashback={tier.cashback}
                bonus={tier.bonus}
                index={index}
              />
            ))}
          </div>

          <Reveal>
            <div className="section-cta">
              <Link to="/vip">
                <motion.button
                  className="btn btn-outline btn-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Learn More About VIP
                  <span>→</span>
                </motion.button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <Reveal>
            <div className="section-header">
              <div className="section-label">
                <motion.span
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                >
                  ✨
                </motion.span>
                Why Choose Us
              </div>
              <h2 className="section-title">
                The <GradientText>Premium</GradientText> Experience
              </h2>
            </div>
          </Reveal>

          <div className="features-grid">
            {FEATURES.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="cta-bg">
              <GlowingOrbs count={4} colors={['#FFD700', '#8B5CF6']} />
            </div>
            <div className="cta-content">
              <motion.h2
                className="cta-title"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GradientText animate>Ready to Win Big?</GradientText>
              </motion.h2>
              <p className="cta-subtitle">
                Join thousands of players and start your winning journey today
              </p>
              <Link to="/login">
                <motion.button
                  className="btn btn-primary btn-xl"
                  whileHover={{ scale: 1.1, boxShadow: '0 15px 50px rgba(255, 215, 0, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>🚀</span>
                  Get Started Free
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .home-page {
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 120px 0 100px;
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

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 1000px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 28px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-full);
          font-size: 14px;
          font-weight: 600;
          color: var(--gold);
          margin-bottom: 32px;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-family: 'Cinzel', serif;
          font-size: 80px;
          font-weight: 900;
          line-height: 1.1;
          margin: 32px 0;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }

        .hero-title-sub {
          font-size: 64px;
          color: var(--text-secondary);
          display: block;
          margin-top: 8px;
        }

        .hero-subtitle {
          font-size: 20px;
          color: var(--text-secondary);
          max-width: 650px;
          margin: 0 auto 48px;
          line-height: 1.8;
        }

        .hero-stats {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 48px;
          margin-bottom: 48px;
          padding: 28px 56px;
          background: rgba(30, 41, 59, 0.7);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          backdrop-filter: blur(20px);
        }

        .hero-stat {
          text-align: center;
        }

        .hero-stat-value {
          font-family: 'Cinzel', serif;
          font-size: 36px;
          font-weight: 800;
        }

        .hero-stat-label {
          font-size: 13px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-top: 6px;
        }

        .hero-stat-divider {
          width: 1px;
          height: 60px;
          background: linear-gradient(180deg, transparent, var(--border-light), transparent);
        }

        .hero-cta {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 48px;
        }

        .hero-trust {
          display: flex;
          justify-content: center;
          gap: 40px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          color: var(--text-secondary);
        }

        .trust-icon {
          font-size: 20px;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: var(--text-muted);
          font-size: 13px;
        }

        .scroll-arrow {
          font-size: 20px;
          color: var(--gold);
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

        /* Neon Grid */
        .neon-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(rgba(255, 215, 0, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.02) 1px, transparent 1px);
          background-size: 60px 60px;
          opacity: 0.5;
        }

        /* Live Wins Section */
        .live-wins-section {
          padding: 20px 0;
          background: var(--bg-dark);
          border-top: 1px solid var(--border-subtle);
          border-bottom: 1px solid var(--border-subtle);
          overflow: hidden;
        }

        .live-wins-header {
          display: flex;
          align-items: center;
          padding: 0 24px;
          margin-bottom: 16px;
        }

        .live-indicator {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
          font-weight: 700;
          color: var(--red);
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }

        .live-dot {
          width: 10px;
          height: 10px;
          background: var(--red);
          border-radius: 50%;
          box-shadow: 0 0 10px var(--red);
        }

        .live-wins-ticker {
          overflow: hidden;
        }

        .ticker-track {
          display: flex;
          gap: 16px;
          width: fit-content;
        }

        .win-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 24px;
          background: var(--bg-glass);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          white-space: nowrap;
          transition: all 0.3s ease;
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
          margin-bottom: 56px;
        }

        .section-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 16px;
        }

        .section-title {
          font-family: 'Cinzel', serif;
          font-size: 48px;
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
          margin-top: 56px;
        }

        /* Featured Games */
        .featured-section {
          padding: 120px 0;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
        }

        /* Promo Banner */
        .promo-section {
          padding: 60px 0;
        }

        .promo-banner {
          position: relative;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 165, 0, 0.1));
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-xl);
          padding: 48px;
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
        }

        .promo-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 32px;
          z-index: 1;
        }

        .promo-icon {
          font-size: 72px;
        }

        .promo-text {
          flex: 1;
        }

        .promo-title {
          font-family: 'Cinzel', serif;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .promo-desc {
          font-size: 18px;
          color: var(--text-secondary);
        }

        /* VIP Section */
        .vip-section {
          padding: 120px 0;
          background: var(--bg-dark);
        }

        .vip-tiers {
          display: flex;
          justify-content: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        /* Features Section */
        .features-section {
          padding: 120px 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 0;
        }

        .cta-card {
          position: relative;
          background: linear-gradient(135deg, var(--bg-card), var(--bg-dark));
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-xl);
          padding: 100px;
          text-align: center;
          overflow: hidden;
          box-shadow: 0 0 60px rgba(255, 215, 0, 0.2);
        }

        .cta-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-title {
          font-family: 'Cinzel', serif;
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 20px;
        }

        .cta-subtitle {
          font-size: 20px;
          color: var(--text-secondary);
          margin-bottom: 40px;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .featured-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-title {
            font-size: 60px;
          }

          .hero-title-sub {
            font-size: 48px;
          }
        }

        @media (max-width: 768px) {
          .hero {
            min-height: auto;
            padding: 80px 0 60px;
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
            padding: 28px;
          }

          .hero-stat-divider {
            width: 60px;
            height: 1px;
          }

          .hero-cta {
            flex-direction: column;
            gap: 16px;
          }

          .hero-trust {
            flex-direction: column;
            gap: 16px;
          }

          .featured-grid,
          .features-grid {
            grid-template-columns: 1fr;
          }

          .vip-tiers {
            flex-direction: column;
            align-items: center;
          }

          .promo-content {
            flex-direction: column;
            text-align: center;
          }

          .section-title {
            font-size: 32px;
          }

          .cta-title {
            font-size: 36px;
          }

          .cta-card {
            padding: 60px 24px;
          }

          .scroll-indicator {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
