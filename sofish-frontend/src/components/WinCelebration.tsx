import { useState, useEffect, useCallback } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
  type: 'confetti' | 'coin' | 'sparkle' | 'star'
  opacity: number
}

interface WinCelebrationProps {
  show: boolean
  amount?: number
  type?: 'normal' | 'big' | 'mega' | 'jackpot'
  onComplete?: () => void
}

const COLORS = ['#FFD700', '#FF6B6B', '#4ECDC4', '#A855F7', '#00D4AA', '#FF1493', '#00BFFF']
const COIN_EMOJIS = ['🪙', '💰', '💵', '💎', '⭐', '✨']

export function WinCelebration({ show, amount = 0, type = 'normal', onComplete }: WinCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [showOverlay, setShowOverlay] = useState(false)
  const [displayAmount, setDisplayAmount] = useState(0)

  const createParticles = useCallback((count: number) => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const particleType = Math.random() > 0.3
        ? (Math.random() > 0.5 ? 'confetti' : 'sparkle')
        : (Math.random() > 0.5 ? 'coin' : 'star')

      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: Math.random() * window.innerWidth,
        y: -20,
        vx: (Math.random() - 0.5) * 10,
        vy: Math.random() * 5 + 3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: particleType === 'coin' ? 30 : (Math.random() * 15 + 8),
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        type: particleType,
        opacity: 1
      })
    }
    setParticles(prev => [...prev, ...newParticles])
  }, [])

  useEffect(() => {
    if (!show) {
      setParticles([])
      setShowOverlay(false)
      setDisplayAmount(0)
      return
    }

    setShowOverlay(true)

    // Particle counts based on win type
    const particleCounts = {
      normal: 50,
      big: 100,
      mega: 200,
      jackpot: 400
    }

    // Create initial burst
    createParticles(particleCounts[type])

    // Continue adding particles for bigger wins
    const intervals: NodeJS.Timeout[] = []
    if (type !== 'normal') {
      for (let i = 0; i < (type === 'jackpot' ? 5 : type === 'mega' ? 3 : 2); i++) {
        intervals.push(setTimeout(() => createParticles(particleCounts[type] / 2), (i + 1) * 500))
      }
    }

    // Animate display amount
    const duration = type === 'jackpot' ? 3000 : type === 'mega' ? 2000 : 1000
    const steps = 60
    const increment = amount / steps
    let current = 0
    const amountInterval = setInterval(() => {
      current += increment
      if (current >= amount) {
        setDisplayAmount(amount)
        clearInterval(amountInterval)
      } else {
        setDisplayAmount(Math.floor(current))
      }
    }, duration / steps)

    // Auto hide after animation
    const hideTimeout = setTimeout(() => {
      setShowOverlay(false)
      setParticles([])
      onComplete?.()
    }, type === 'jackpot' ? 6000 : type === 'mega' ? 4000 : 3000)

    return () => {
      intervals.forEach(clearTimeout)
      clearInterval(amountInterval)
      clearTimeout(hideTimeout)
    }
  }, [show, type, amount, createParticles, onComplete])

  // Physics animation
  useEffect(() => {
    if (particles.length === 0) return

    const animate = () => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        vy: p.vy + 0.15, // gravity
        rotation: p.rotation + p.rotationSpeed,
        opacity: p.y > window.innerHeight * 0.8 ? p.opacity - 0.02 : p.opacity
      })).filter(p => p.y < window.innerHeight + 50 && p.opacity > 0))
    }

    const frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [particles])

  if (!showOverlay && particles.length === 0) return null

  const getWinTitle = () => {
    switch (type) {
      case 'jackpot': return 'JACKPOT!!!'
      case 'mega': return 'MEGA WIN!'
      case 'big': return 'BIG WIN!'
      default: return 'YOU WIN!'
    }
  }

  const getWinEmoji = () => {
    switch (type) {
      case 'jackpot': return '🎰💎🎰'
      case 'mega': return '🔥⭐🔥'
      case 'big': return '💰✨💰'
      default: return '🎉'
    }
  }

  return (
    <>
      {/* Particle Layer */}
      <div className="celebration-particles">
        {particles.map(p => (
          <div
            key={p.id}
            className={`particle particle-${p.type}`}
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.type === 'confetti' ? p.size * 0.6 : p.size,
              backgroundColor: p.type !== 'coin' ? p.color : undefined,
              transform: `rotate(${p.rotation}deg)`,
              opacity: p.opacity
            }}
          >
            {p.type === 'coin' && COIN_EMOJIS[Math.floor(p.id) % COIN_EMOJIS.length]}
            {p.type === 'star' && '⭐'}
          </div>
        ))}
      </div>

      {/* Win Overlay */}
      {showOverlay && (
        <div className={`win-celebration-overlay win-${type}`}>
          <div className="win-celebration-content">
            <div className="win-emoji">{getWinEmoji()}</div>
            <h1 className={`win-title win-title-${type}`}>{getWinTitle()}</h1>
            <div className="win-amount-display">
              <span className="win-plus">+</span>
              <span className="win-number">{displayAmount.toLocaleString()}</span>
            </div>
            <div className="win-tokens">TOKENS</div>

            {type === 'jackpot' && (
              <div className="jackpot-rays">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="ray" style={{ transform: `rotate(${i * 30}deg)` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .celebration-particles {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 10000;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          border-radius: 3px;
        }

        .particle-confetti {
          animation: confetti-shimmer 0.5s ease-in-out infinite alternate;
        }

        .particle-coin {
          font-size: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none !important;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
          animation: coin-spin 0.3s linear infinite;
        }

        .particle-sparkle {
          border-radius: 50%;
          box-shadow: 0 0 10px currentColor;
        }

        .particle-star {
          font-size: 20px;
          background: none !important;
          filter: drop-shadow(0 0 10px #FFD700);
        }

        @keyframes confetti-shimmer {
          from { opacity: 0.8; }
          to { opacity: 1; }
        }

        @keyframes coin-spin {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(360deg); }
        }

        .win-celebration-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.85);
          z-index: 9999;
          animation: overlay-fade-in 0.3s ease-out;
        }

        @keyframes overlay-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .win-celebration-content {
          text-align: center;
          position: relative;
          animation: content-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes content-pop {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .win-emoji {
          font-size: 80px;
          margin-bottom: 20px;
          animation: emoji-bounce 0.6s ease-in-out infinite;
        }

        @keyframes emoji-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.1); }
        }

        .win-title {
          font-family: 'Cinzel', serif;
          font-weight: 900;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 6px;
        }

        .win-title-normal {
          font-size: 48px;
          color: #00D4AA;
          text-shadow: 0 0 30px rgba(0, 212, 170, 0.5);
        }

        .win-title-big {
          font-size: 56px;
          color: #A855F7;
          text-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
          animation: big-win-pulse 0.5s ease-in-out infinite;
        }

        .win-title-mega {
          font-size: 64px;
          background: linear-gradient(90deg, #FF6B6B, #FFD700, #FF6B6B);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: mega-rainbow 1s linear infinite;
          filter: drop-shadow(0 0 20px rgba(255,215,0,0.5));
        }

        .win-title-jackpot {
          font-size: 80px;
          background: linear-gradient(90deg, #FFD700, #FF6B6B, #A855F7, #00D4AA, #FFD700);
          background-size: 400% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: jackpot-rainbow 2s linear infinite, jackpot-shake 0.1s ease-in-out infinite;
        }

        @keyframes big-win-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes mega-rainbow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes jackpot-rainbow {
          0% { background-position: 0% center; }
          100% { background-position: 400% center; }
        }

        @keyframes jackpot-shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-3px) rotate(-1deg); }
          75% { transform: translateX(3px) rotate(1deg); }
        }

        .win-amount-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .win-plus {
          font-size: 48px;
          font-weight: 900;
          color: #00D4AA;
        }

        .win-number {
          font-family: 'Cinzel', serif;
          font-size: 72px;
          font-weight: 900;
          background: var(--gradient-gold-shine);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 30px rgba(255,215,0,0.5));
        }

        .win-${type === 'jackpot' ? 'jackpot' : ''} .win-number {
          font-size: ${type === 'jackpot' ? '96px' : type === 'mega' ? '84px' : '72px'};
          animation: number-glow 0.5s ease-in-out infinite alternate;
        }

        @keyframes number-glow {
          from { filter: drop-shadow(0 0 30px rgba(255,215,0,0.5)); }
          to { filter: drop-shadow(0 0 60px rgba(255,215,0,0.8)); }
        }

        .win-tokens {
          font-size: 18px;
          color: var(--text-secondary);
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .jackpot-rays {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 800px;
          height: 800px;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: -1;
        }

        .ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400px;
          height: 4px;
          background: linear-gradient(90deg, rgba(255,215,0,0.6), transparent);
          transform-origin: left center;
          animation: ray-rotate 4s linear infinite;
        }

        @keyframes ray-rotate {
          from { opacity: 0.3; }
          to { opacity: 0.8; }
        }

        .win-jackpot .jackpot-rays {
          animation: rays-spin 10s linear infinite;
        }

        @keyframes rays-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </>
  )
}

// Export a hook for easy use
export function useWinCelebration() {
  const [celebrationState, setCelebrationState] = useState<{
    show: boolean
    amount: number
    type: 'normal' | 'big' | 'mega' | 'jackpot'
  }>({ show: false, amount: 0, type: 'normal' })

  const celebrate = (amount: number, betAmount: number = 10) => {
    const multiplier = amount / betAmount
    let type: 'normal' | 'big' | 'mega' | 'jackpot' = 'normal'

    if (multiplier >= 100) type = 'jackpot'
    else if (multiplier >= 50) type = 'mega'
    else if (multiplier >= 10) type = 'big'

    setCelebrationState({ show: true, amount, type })
  }

  const hideCelebration = () => {
    setCelebrationState(prev => ({ ...prev, show: false }))
  }

  return { ...celebrationState, celebrate, hideCelebration }
}
