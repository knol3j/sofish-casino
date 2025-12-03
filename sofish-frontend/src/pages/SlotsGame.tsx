import { useState, useRef, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useSpinSlots, useUserBalance } from '../hooks/useGames'

interface SlotTheme {
  name: string
  subtitle: string
  symbols: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
    glow: string
  }
  minBet: number
  multipliers: { [key: string]: number }
  background: string
}

const THEMES: { [key: string]: SlotTheme } = {
  classic: {
    name: '777 CLASSIC',
    subtitle: 'The Original Vegas Experience',
    symbols: ['🍒', '🔔', '💎', '⭐', 'BAR', '7️⃣', '💰'],
    colors: { primary: '#FFD700', secondary: '#FF6347', accent: '#9370DB', glow: 'rgba(255, 215, 0, 0.5)' },
    minBet: 10,
    multipliers: { '7️⃣7️⃣7️⃣': 777, '💎💎💎': 100, '⭐⭐⭐': 50 },
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
  },
  fruit: {
    name: 'FRUIT MANIA',
    subtitle: 'Sweet & Juicy Wins',
    symbols: ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓', '🍌'],
    colors: { primary: '#FF1493', secondary: '#32CD32', accent: '#FF8C00', glow: 'rgba(255, 20, 147, 0.5)' },
    minBet: 5,
    multipliers: { '🍒🍒🍒': 50, '🍋🍋🍋': 40, '🍊🍊🍊': 30 },
    background: 'linear-gradient(135deg, #2d1f3d 0%, #1a2a1a 50%, #0f1f0f 100%)'
  },
  diamond: {
    name: 'DIAMOND DELUXE',
    subtitle: 'High Roller VIP Experience',
    symbols: ['💎', '💍', '👑', '⭐', '🔷', '✨', '🌟'],
    colors: { primary: '#00D9FF', secondary: '#9D00FF', accent: '#FFD700', glow: 'rgba(0, 217, 255, 0.5)' },
    minBet: 50,
    multipliers: { '💎💎💎': 500, '💍💍💍': 250, '👑👑👑': 200 },
    background: 'linear-gradient(135deg, #0a1628 0%, #1a0a28 50%, #0a0a1a 100%)'
  },
  dragon: {
    name: "DRAGON'S FORTUNE",
    subtitle: 'Legendary Asian Jackpots',
    symbols: ['🐉', '🔥', '🏮', '🎋', '⚡', '🌙', '🔮'],
    colors: { primary: '#FF0000', secondary: '#FFD700', accent: '#8B0000', glow: 'rgba(255, 0, 0, 0.5)' },
    minBet: 100,
    multipliers: { '🐉🐉🐉': 888, '🔥🔥🔥': 188, '🏮🏮🏮': 88 },
    background: 'linear-gradient(135deg, #2a0a0a 0%, #1a1a0a 50%, #0a0a0a 100%)'
  },
  vegas: {
    name: 'VEGAS NIGHTS',
    subtitle: 'Sin City Glamour',
    symbols: ['🎰', '🎲', '🃏', '💵', '🎩', '🍾', '🌃'],
    colors: { primary: '#FFD700', secondary: '#000000', accent: '#FF0000', glow: 'rgba(255, 215, 0, 0.5)' },
    minBet: 25,
    multipliers: { '🎰🎰🎰': 300, '🎲🎲🎲': 150, '🃏🃏🃏': 100 },
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)'
  },
  ocean: {
    name: 'OCEAN TREASURES',
    subtitle: 'Deep Sea Riches',
    symbols: ['🐚', '🦀', '🐙', '🐠', '⚓', '🏴‍☠️', '💰'],
    colors: { primary: '#00CED1', secondary: '#4169E1', accent: '#FFD700', glow: 'rgba(0, 206, 209, 0.5)' },
    minBet: 20,
    multipliers: { '🏴‍☠️🏴‍☠️🏴‍☠️': 400, '💰💰💰': 200, '⚓⚓⚓': 100 },
    background: 'linear-gradient(135deg, #0a1a2a 0%, #0a2a3a 50%, #0a0a1a 100%)'
  }
}

export function SlotsGame() {
  const { theme = 'classic' } = useParams<{ theme: string }>()
  const currentTheme = THEMES[theme] || THEMES.classic
  const [betAmount, setBetAmount] = useState(currentTheme.minBet)
  const [result, setResult] = useState<number[] | null>(null)
  const [winAmount, setWinAmount] = useState<number>(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [showWin, setShowWin] = useState(false)
  const [reelPositions, setReelPositions] = useState([0, 0, 0])
  const [reelBlurs, setReelBlurs] = useState([0, 0, 0])
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, color: string}>>([])
  const [showCelebration, setShowCelebration] = useState(false)
  const [celebrationType, setCelebrationType] = useState<'normal' | 'big' | 'mega' | 'jackpot'>('normal')
  const animationFrameRef = useRef<number>()

  const spinMutation = useSpinSlots()
  const { data: balanceData, refetch: refetchBalance } = useUserBalance()

  const SYMBOL_HEIGHT = 120

  // Reset bet when theme changes
  useEffect(() => {
    setBetAmount(currentTheme.minBet)
    setResult(null)
    setShowWin(false)
    setReelPositions([0, 0, 0])
  }, [theme, currentTheme.minBet])

  const animateReel = (reelIndex: number, targetSymbol: number, duration: number) => {
    const startTime = Date.now()
    const startPosition = reelPositions[reelIndex]
    const totalSpins = 3 + reelIndex
    const targetPosition = targetSymbol + (totalSpins * currentTheme.symbols.length)
    const distance = (targetPosition - startPosition) * SYMBOL_HEIGHT

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      let eased: number
      let blurAmount: number

      if (progress < 0.15) {
        // Acceleration
        const accelProgress = progress / 0.15
        eased = 0.5 * Math.pow(accelProgress, 2) * 0.15
        blurAmount = accelProgress * 15
      } else if (progress < 0.85) {
        // Constant high speed
        const constProgress = (progress - 0.15) / 0.7
        eased = 0.075 + (constProgress * 0.75)
        blurAmount = 15
      } else {
        // Deceleration with elastic bounce
        const decelProgress = (progress - 0.85) / 0.15
        const c4 = (2 * Math.PI) / 4.5
        eased = 0.825 + (0.175 * (decelProgress === 1
          ? 1
          : Math.pow(2, -10 * decelProgress) * Math.sin((decelProgress * 10 - 0.75) * c4) + 1))
        blurAmount = Math.max(0, (1 - decelProgress) * 15)
      }

      const currentPositionPx = startPosition * SYMBOL_HEIGHT + distance * eased
      const currentPositionIndex = (currentPositionPx / SYMBOL_HEIGHT) % currentTheme.symbols.length

      setReelPositions(prev => {
        const newPositions = [...prev]
        newPositions[reelIndex] = currentPositionIndex
        return newPositions
      })

      setReelBlurs(prev => {
        const newBlurs = [...prev]
        newBlurs[reelIndex] = blurAmount
        return newBlurs
      })

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setReelPositions(prev => {
          const newPositions = [...prev]
          newPositions[reelIndex] = targetSymbol
          return newPositions
        })
        setReelBlurs(prev => {
          const newBlurs = [...prev]
          newBlurs[reelIndex] = 0
          return newBlurs
        })
      }
    }

    animate()
  }

  const handleSpin = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setShowWin(false)
    setShowCelebration(false)
    setParticles([])

    try {
      const data = await spinMutation.mutateAsync(betAmount)
      const spinDurations = [1600, 2000, 2400]

      spinDurations.forEach((duration, reelIndex) => {
        animateReel(reelIndex, data.result[reelIndex] - 1, duration)
      })

      setTimeout(() => {
        setResult(data.result)
        setWinAmount(data.winAmount)
        setIsSpinning(false)
        refetchBalance()

        if (data.isWin) {
          setShowWin(true)
          const multiplier = data.winAmount / betAmount

          if (multiplier >= 100) {
            setCelebrationType('jackpot')
            triggerJackpotCelebration()
          } else if (multiplier >= 50) {
            setCelebrationType('mega')
            triggerMegaWin()
          } else if (multiplier >= 10) {
            setCelebrationType('big')
            triggerBigWin()
          } else {
            setCelebrationType('normal')
            triggerNormalWin()
          }
          setShowCelebration(true)
        }
      }, Math.max(...spinDurations) + 300)

    } catch (error) {
      console.error('Spin failed:', error)
      setIsSpinning(false)
    }
  }

  const createParticle = (color?: string) => {
    const id = Date.now() + Math.random()
    const particle = {
      id,
      x: 20 + Math.random() * 60,
      y: Math.random() * 100,
      color: color || currentTheme.colors.primary
    }
    setParticles(prev => [...prev, particle])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id))
    }, 3000)
  }

  const triggerNormalWin = () => {
    for (let i = 0; i < 30; i++) {
      setTimeout(() => createParticle(), i * 30)
    }
  }

  const triggerBigWin = () => {
    for (let i = 0; i < 60; i++) {
      setTimeout(() => createParticle(), i * 20)
    }
  }

  const triggerMegaWin = () => {
    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        createParticle([currentTheme.colors.primary, currentTheme.colors.secondary, currentTheme.colors.accent][Math.floor(Math.random() * 3)])
      }, i * 15)
    }
    document.body.classList.add('screen-shake')
    setTimeout(() => document.body.classList.remove('screen-shake'), 600)
  }

  const triggerJackpotCelebration = () => {
    for (let i = 0; i < 150; i++) {
      setTimeout(() => {
        createParticle(['#FFD700', '#FF6347', '#9370DB', '#00CED1', '#FF1493'][Math.floor(Math.random() * 5)])
      }, i * 10)
    }
    document.body.classList.add('screen-shake')
    setTimeout(() => document.body.classList.remove('screen-shake'), 1000)
  }

  const getSymbol = (value: number) => {
    const index = Math.floor(value + currentTheme.symbols.length) % currentTheme.symbols.length
    return currentTheme.symbols[index] || '❓'
  }

  const maxBet = () => {
    const max = Math.min(1000, balanceData?.balance || 0)
    setBetAmount(max)
  }

  return (
    <div className="slots-page" style={{ background: currentTheme.background }}>
      {/* Ambient Background Effects */}
      <div className="ambient-bg">
        <div className="ambient-orb orb-1" style={{ background: currentTheme.colors.primary }} />
        <div className="ambient-orb orb-2" style={{ background: currentTheme.colors.secondary }} />
        <div className="ambient-orb orb-3" style={{ background: currentTheme.colors.accent }} />
      </div>

      <div className="container">
        {/* Header */}
        <div className="game-header">
          <Link to="/slots-hub" className="back-btn">
            <span>←</span>
            <span>All Slots</span>
          </Link>

          <div className="header-info">
            <h1 className="game-title" style={{ color: currentTheme.colors.primary }}>
              {currentTheme.name}
            </h1>
            <p className="game-subtitle">{currentTheme.subtitle}</p>
          </div>

          <div className="balance-card">
            <div className="balance-label">BALANCE</div>
            <div className="balance-value" style={{ color: currentTheme.colors.primary }}>
              <span className="balance-icon">💰</span>
              <span className="balance-amount">{balanceData?.balance?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Slot Machine */}
        <div className="slot-machine">
          {/* Top Decorations */}
          <div className="machine-top">
            <div className="marquee-lights">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className={`light ${isSpinning ? 'spinning' : ''}`}
                  style={{
                    background: currentTheme.colors.primary,
                    animationDelay: `${i * 0.08}s`,
                    boxShadow: `0 0 10px ${currentTheme.colors.glow}`
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main Display */}
          <div className="machine-body">
            {/* Win Line Indicator */}
            <div className="win-line" style={{ background: currentTheme.colors.primary, boxShadow: `0 0 20px ${currentTheme.colors.glow}` }} />

            {/* Reels */}
            <div className="reels-container">
              {[0, 1, 2].map((reelIndex) => (
                <div key={reelIndex} className="reel-wrapper">
                  <div className="reel-frame" style={{ borderColor: `${currentTheme.colors.primary}40` }}>
                    <div
                      className="reel"
                      style={{
                        filter: `blur(${reelBlurs[reelIndex]}px)`,
                        transform: `translateY(${-((reelPositions[reelIndex] % currentTheme.symbols.length) * SYMBOL_HEIGHT) + SYMBOL_HEIGHT}px)`
                      }}
                    >
                      {/* Extended symbols for smooth scrolling */}
                      {[...currentTheme.symbols, ...currentTheme.symbols, ...currentTheme.symbols].map((symbol, symIndex) => (
                        <div key={symIndex} className="symbol">
                          {symbol}
                        </div>
                      ))}
                    </div>

                    {/* Gradient Overlays */}
                    <div className="reel-gradient-top" />
                    <div className="reel-gradient-bottom" />
                  </div>

                  {/* Reel Glow on Stop */}
                  {!isSpinning && result && (
                    <div
                      className="reel-glow-effect"
                      style={{
                        animationDelay: `${reelIndex * 0.15}s`,
                        boxShadow: `0 0 40px ${currentTheme.colors.glow}, inset 0 0 30px ${currentTheme.colors.glow}`
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Current Result Display */}
            {result && !isSpinning && (
              <div className="result-display">
                {result.map((r, i) => (
                  <span key={i} className="result-symbol">
                    {getSymbol(r - 1)}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Win Display Overlay */}
          {showCelebration && showWin && winAmount > 0 && (
            <div className={`win-overlay ${celebrationType}`}>
              <div className="win-content">
                {celebrationType === 'jackpot' && (
                  <>
                    <div className="win-icon">🎰</div>
                    <div className="win-label jackpot-text">JACKPOT!</div>
                  </>
                )}
                {celebrationType === 'mega' && (
                  <>
                    <div className="win-icon">🔥</div>
                    <div className="win-label mega-text">MEGA WIN!</div>
                  </>
                )}
                {celebrationType === 'big' && (
                  <>
                    <div className="win-icon">⭐</div>
                    <div className="win-label big-text">BIG WIN!</div>
                  </>
                )}
                {celebrationType === 'normal' && (
                  <>
                    <div className="win-icon">✨</div>
                    <div className="win-label">YOU WIN!</div>
                  </>
                )}
                <div className="win-amount" style={{ color: currentTheme.colors.primary }}>
                  +{winAmount.toLocaleString()}
                </div>
                <div className="win-tokens">TOKENS</div>
              </div>
            </div>
          )}

          {/* Particles */}
          <div className="particles-container">
            {particles.map(particle => (
              <div
                key={particle.id}
                className="particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  background: particle.color,
                  boxShadow: `0 0 10px ${particle.color}`
                }}
              />
            ))}
          </div>

          {/* Bottom Decorations */}
          <div className="machine-bottom">
            <div className="marquee-lights">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className={`light ${isSpinning ? 'spinning' : ''}`}
                  style={{
                    background: currentTheme.colors.primary,
                    animationDelay: `${i * 0.08}s`,
                    boxShadow: `0 0 10px ${currentTheme.colors.glow}`
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          {/* Bet Controls */}
          <div className="bet-panel">
            <div className="panel-header">
              <span className="panel-icon">💰</span>
              <span>BET AMOUNT</span>
            </div>

            <div className="bet-controls">
              <button
                className="bet-btn minus"
                onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
                disabled={isSpinning}
              >
                -10
              </button>

              <div className="bet-display">
                <input
                  type="number"
                  className="bet-input"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Math.max(1, Math.min(1000, Number(e.target.value))))}
                  disabled={isSpinning}
                />
              </div>

              <button
                className="bet-btn plus"
                onClick={() => setBetAmount(Math.min(1000, betAmount + 10))}
                disabled={isSpinning}
              >
                +10
              </button>
            </div>

            <div className="quick-bets">
              {[10, 25, 50, 100, 250, 500].map((amount) => (
                <button
                  key={amount}
                  className={`quick-bet ${betAmount === amount ? 'active' : ''}`}
                  onClick={() => setBetAmount(amount)}
                  disabled={isSpinning}
                  style={betAmount === amount ? { borderColor: currentTheme.colors.primary, color: currentTheme.colors.primary } : {}}
                >
                  {amount}
                </button>
              ))}
              <button className="quick-bet max-btn" onClick={maxBet} disabled={isSpinning}>
                MAX
              </button>
            </div>
          </div>

          {/* Spin Button */}
          <button
            className={`spin-btn ${isSpinning ? 'spinning' : ''}`}
            onClick={handleSpin}
            disabled={isSpinning || !balanceData || balanceData.balance < betAmount}
            style={{
              background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
              boxShadow: `0 8px 40px ${currentTheme.colors.glow}`
            }}
          >
            <div className="spin-btn-content">
              {isSpinning ? (
                <>
                  <div className="spinner" />
                  <span>SPINNING...</span>
                </>
              ) : (
                <>
                  <span className="spin-icon">🎰</span>
                  <span>SPIN</span>
                </>
              )}
            </div>
          </button>

          {balanceData && balanceData.balance < betAmount && (
            <div className="insufficient-alert">
              <span>⚠️</span>
              <span>Insufficient balance</span>
              <Link to="/daily-bonus" className="claim-link">Claim Bonus</Link>
            </div>
          )}
        </div>

        {/* Paytable */}
        <div className="paytable">
          <div className="paytable-header">
            <span className="paytable-icon">📋</span>
            <h3>PAYTABLE</h3>
          </div>

          <div className="paytable-grid">
            {Object.entries(currentTheme.multipliers).slice(0, 3).map(([combo, mult]) => (
              <div key={combo} className="paytable-item jackpot-item">
                <div className="combo">{combo.replace(/(.)/gu, '$1 ').trim()}</div>
                <div className="payout" style={{ color: currentTheme.colors.primary }}>{mult}x</div>
                {mult >= 500 && <div className="jackpot-badge">JACKPOT</div>}
              </div>
            ))}
            <div className="paytable-item">
              <div className="combo">Any 3 Matching</div>
              <div className="payout">10x</div>
            </div>
            <div className="paytable-item">
              <div className="combo">Any 2 Matching</div>
              <div className="payout">2x</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .slots-page {
          min-height: 100vh;
          padding: 100px 0 60px;
          position: relative;
          overflow: hidden;
        }

        /* Ambient Background */
        .ambient-bg {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 0;
        }

        .ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(150px);
          opacity: 0.15;
          animation: float-orb 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          top: -100px;
          right: -100px;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          bottom: -100px;
          left: -100px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation-delay: -10s;
        }

        @keyframes float-orb {
          0%, 100% { transform: scale(1) translate(0, 0); }
          33% { transform: scale(1.1) translate(20px, -20px); }
          66% { transform: scale(0.9) translate(-20px, 20px); }
        }

        /* Header */
        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 40px;
          position: relative;
          z-index: 1;
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: var(--bg-card);
          color: var(--text-primary);
        }

        .header-info {
          text-align: center;
        }

        .game-title {
          font-family: 'Cinzel', serif;
          font-size: 42px;
          font-weight: 900;
          margin-bottom: 8px;
          text-shadow: 0 0 30px currentColor;
          letter-spacing: 4px;
        }

        .game-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
          letter-spacing: 2px;
        }

        .balance-card {
          padding: 16px 24px;
          background: var(--bg-glass);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-lg);
          text-align: center;
        }

        .balance-label {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 2px;
          margin-bottom: 4px;
        }

        .balance-value {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 800;
        }

        .balance-icon {
          font-size: 20px;
        }

        /* Slot Machine */
        .slot-machine {
          max-width: 700px;
          margin: 0 auto 40px;
          position: relative;
          z-index: 1;
        }

        .machine-top, .machine-bottom {
          padding: 12px;
        }

        .marquee-lights {
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
        }

        .light {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: blink 2s ease-in-out infinite;
        }

        .light.spinning {
          animation: blink-fast 0.3s ease-in-out infinite;
        }

        @keyframes blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }

        @keyframes blink-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .machine-body {
          background: linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.6));
          border-radius: var(--radius-xl);
          padding: 40px;
          position: relative;
          border: 2px solid var(--border-light);
          box-shadow: inset 0 0 80px rgba(0,0,0,0.8);
        }

        .win-line {
          position: absolute;
          left: 40px;
          right: 40px;
          top: 50%;
          height: 3px;
          transform: translateY(-50%);
          z-index: 10;
          border-radius: 2px;
          animation: line-glow 2s ease-in-out infinite;
        }

        @keyframes line-glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }

        .reels-container {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .reel-wrapper {
          position: relative;
        }

        .reel-frame {
          width: 160px;
          height: 360px;
          overflow: hidden;
          background: linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.9) 100%);
          border-radius: var(--radius-lg);
          border: 3px solid;
          position: relative;
        }

        .reel {
          position: absolute;
          width: 100%;
          transition: filter 0.1s linear;
        }

        .symbol {
          height: ${SYMBOL_HEIGHT}px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 70px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
        }

        .reel-gradient-top,
        .reel-gradient-bottom {
          position: absolute;
          left: 0;
          right: 0;
          height: 80px;
          pointer-events: none;
          z-index: 5;
        }

        .reel-gradient-top {
          top: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
        }

        .reel-gradient-bottom {
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
        }

        .reel-glow-effect {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: var(--radius-lg);
          animation: reel-flash 0.6s ease-out;
          pointer-events: none;
        }

        @keyframes reel-flash {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }

        .result-display {
          display: none;
        }

        /* Win Overlay */
        .win-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          z-index: 20;
          animation: win-popup 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes win-popup {
          0% { transform: translate(-50%, -50%) scale(0) rotate(-10deg); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.1) rotate(5deg); }
          100% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
        }

        .win-content {
          padding: 32px 64px;
          background: var(--bg-glass-dark);
          backdrop-filter: blur(20px);
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-xl);
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), var(--shadow-gold);
        }

        .win-icon {
          font-size: 48px;
          margin-bottom: 8px;
          animation: bounce 0.5s ease-in-out infinite;
        }

        .win-label {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .jackpot-text {
          font-size: 36px;
          background: linear-gradient(90deg, #FFD700, #FF6347, #FFD700);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow-text 1s linear infinite;
        }

        .mega-text {
          color: #FF6347;
          text-shadow: 0 0 20px rgba(255, 99, 71, 0.5);
        }

        .big-text {
          color: #9370DB;
          text-shadow: 0 0 20px rgba(147, 112, 219, 0.5);
        }

        @keyframes rainbow-text {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .win-amount {
          font-family: 'Cinzel', serif;
          font-size: 48px;
          font-weight: 900;
          text-shadow: 0 0 30px currentColor;
        }

        .win-tokens {
          font-size: 14px;
          color: var(--text-muted);
          letter-spacing: 2px;
        }

        /* Jackpot specific animations */
        .win-overlay.jackpot .win-content {
          animation: jackpot-glow 0.5s ease-in-out infinite alternate;
        }

        @keyframes jackpot-glow {
          0% { box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(255,215,0,0.3); }
          100% { box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(255,215,0,0.6); }
        }

        /* Particles */
        .particles-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          animation: particle-rise 3s ease-out forwards;
        }

        @keyframes particle-rise {
          0% {
            transform: translateY(0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(0) rotate(720deg);
            opacity: 0;
          }
        }

        /* Controls */
        .controls-section {
          max-width: 700px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .bet-panel {
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 24px;
          margin-bottom: 24px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .panel-icon {
          font-size: 16px;
        }

        .bet-controls {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .bet-btn {
          width: 60px;
          height: 50px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .bet-btn:hover:not(:disabled) {
          background: var(--bg-card-hover);
          border-color: var(--gold);
        }

        .bet-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bet-display {
          flex: 1;
        }

        .bet-input {
          width: 100%;
          height: 50px;
          background: var(--bg-dark);
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-md);
          color: var(--gold);
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 800;
          text-align: center;
          outline: none;
        }

        .bet-input:focus {
          box-shadow: 0 0 20px var(--gold-glow);
        }

        .quick-bets {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .quick-bet {
          flex: 1;
          min-width: 60px;
          padding: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .quick-bet:hover:not(:disabled) {
          background: var(--bg-card-hover);
          color: var(--text-primary);
        }

        .quick-bet.active {
          background: rgba(255,215,0,0.15);
        }

        .quick-bet:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .max-btn {
          background: var(--gradient-gold);
          color: var(--bg-deepest);
          border-color: transparent;
        }

        /* Spin Button */
        .spin-btn {
          width: 100%;
          padding: 24px;
          border: none;
          border-radius: var(--radius-xl);
          font-size: 24px;
          font-weight: 900;
          font-family: 'Cinzel', serif;
          color: var(--bg-deepest);
          cursor: pointer;
          transition: all 0.3s ease;
          letter-spacing: 3px;
          margin-bottom: 16px;
        }

        .spin-btn:hover:not(:disabled) {
          transform: translateY(-4px);
          box-shadow: 0 12px 50px var(--gold-glow);
        }

        .spin-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .spin-btn-content {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .spin-icon {
          font-size: 28px;
        }

        .spin-btn .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(0,0,0,0.2);
          border-top-color: var(--bg-deepest);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .spin-btn.spinning {
          animation: btn-pulse 1s ease-in-out infinite;
        }

        @keyframes btn-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .insufficient-alert {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          background: rgba(255, 71, 87, 0.1);
          border: 1px solid var(--red);
          border-radius: var(--radius-md);
          color: var(--red);
          font-size: 14px;
        }

        .claim-link {
          color: var(--gold);
          font-weight: 600;
          text-decoration: underline;
        }

        /* Paytable */
        .paytable {
          max-width: 700px;
          margin: 40px auto 0;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 24px;
          position: relative;
          z-index: 1;
        }

        .paytable-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .paytable-icon {
          font-size: 24px;
        }

        .paytable-header h3 {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--gold);
          letter-spacing: 2px;
        }

        .paytable-grid {
          display: grid;
          gap: 12px;
        }

        .paytable-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: var(--bg-dark);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
        }

        .paytable-item:hover {
          border-color: var(--border-gold);
          transform: translateX(8px);
        }

        .jackpot-item {
          border-color: var(--border-gold);
          background: rgba(255,215,0,0.05);
        }

        .combo {
          font-size: 24px;
        }

        .payout {
          font-family: 'Cinzel', serif;
          font-size: 20px;
          font-weight: 800;
        }

        .jackpot-badge {
          padding: 4px 12px;
          background: var(--gradient-gold);
          color: var(--bg-deepest);
          font-size: 10px;
          font-weight: 800;
          border-radius: var(--radius-full);
          letter-spacing: 1px;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .slots-page {
            padding: 80px 0 40px;
          }

          .game-header {
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }

          .back-btn {
            align-self: flex-start;
          }

          .game-title {
            font-size: 28px;
          }

          .machine-body {
            padding: 24px 16px;
          }

          .reels-container {
            gap: 12px;
          }

          .reel-frame {
            width: 100px;
            height: 240px;
          }

          .symbol {
            height: 80px;
            font-size: 45px;
          }

          .win-content {
            padding: 24px 32px;
          }

          .win-amount {
            font-size: 36px;
          }

          .bet-controls {
            flex-wrap: wrap;
          }

          .spin-btn {
            font-size: 18px;
            padding: 20px;
          }

          .combo {
            font-size: 18px;
          }
        }
      `}</style>
    </div>
  )
}
