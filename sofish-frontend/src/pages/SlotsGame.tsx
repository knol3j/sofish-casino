import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSpinSlots, useUserBalance } from '../hooks/useGames'
import { AdSenseUnit } from '../components/AdSenseUnit'

interface SlotTheme {
  name: string
  symbols: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  minBet: number
  multipliers: { [key: string]: number }
}

const THEMES: { [key: string]: SlotTheme } = {
  classic: {
    name: '777 Classic Slots',
    symbols: ['🍒', '🔔', '💎', '⭐', 'BAR', '7️⃣', '💰'],
    colors: { primary: '#FFD700', secondary: '#FF6347', accent: '#9370DB' },
    minBet: 10,
    multipliers: { '7️⃣7️⃣7️⃣': 777, '💎💎💎': 100, '⭐⭐⭐': 50 }
  },
  fruit: {
    name: 'Fruit Mania',
    symbols: ['🍒', '🍋', '🍊', '🍇', '🍉', '🍓', '🍌'],
    colors: { primary: '#FF1493', secondary: '#32CD32', accent: '#FF8C00' },
    minBet: 5,
    multipliers: { '🍒🍒🍒': 50, '🍋🍋🍋': 40, '🍊🍊🍊': 30 }
  },
  diamond: {
    name: 'Diamond Deluxe',
    symbols: ['💎', '💍', '👑', '⭐', '🔷', '✨', '🌟'],
    colors: { primary: '#00D9FF', secondary: '#9D00FF', accent: '#FFD700' },
    minBet: 50,
    multipliers: { '💎💎💎': 500, '💍💍💍': 250, '👑👑👑': 200 }
  },
  dragon: {
    name: "Dragon's Fortune",
    symbols: ['🐉', '🔥', '🏮', '🎋', '⚡', '🌙', '🔮'],
    colors: { primary: '#FF0000', secondary: '#FFD700', accent: '#8B0000' },
    minBet: 100,
    multipliers: { '🐉🐉🐉': 888, '🔥🔥🔥': 188, '🏮🏮🏮': 88 }
  },
  vegas: {
    name: 'Vegas Nights',
    symbols: ['🎰', '🎲', '🃏', '💵', '🎩', '🍾', '🌃'],
    colors: { primary: '#FFD700', secondary: '#000000', accent: '#FF0000' },
    minBet: 25,
    multipliers: { '🎰🎰🎰': 300, '🎲🎲🎲': 150, '🃏🃏🃏': 100 }
  },
  ocean: {
    name: 'Ocean Treasures',
    symbols: ['🐚', '🦀', '🐙', '🐠', '⚓', '🏴‍☠️', '💰'],
    colors: { primary: '#00CED1', secondary: '#4169E1', accent: '#FFD700' },
    minBet: 20,
    multipliers: { '🏴‍☠️🏴‍☠️🏴‍☠️': 400, '💰💰💰': 200, '⚓⚓⚓': 100 }
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
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([])
  const animationFrameRef = useRef<number>()

  const spinMutation = useSpinSlots()
  const { data: balanceData, refetch: refetchBalance } = useUserBalance()

  const SYMBOL_HEIGHT = 140

  // Professional reel animation with acceleration, deceleration, and bounce
  const animateReel = (reelIndex: number, targetSymbol: number, duration: number) => {
    const startTime = Date.now()
    const startPosition = reelPositions[reelIndex]
    const targetPosition = targetSymbol * SYMBOL_HEIGHT
    const distance = targetPosition - (startPosition * SYMBOL_HEIGHT) + (currentTheme.symbols.length * SYMBOL_HEIGHT * 3)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      let eased: number
      let blurAmount: number

      if (progress < 0.1) {
        // Phase 1: Ease in (accelerate)
        const accelProgress = progress / 0.1
        eased = 0.5 * Math.pow(accelProgress, 2)
        blurAmount = accelProgress * 12
      } else if (progress < 0.9) {
        // Phase 2: Constant speed
        const constProgress = (progress - 0.1) / 0.8
        eased = 0.05 + (constProgress * 0.85)
        blurAmount = 12
      } else {
        // Phase 3: Ease out with bounce (decelerate)
        const decelProgress = (progress - 0.9) / 0.1
        const c4 = (2 * Math.PI) / 3
        eased = decelProgress === 1
          ? 1
          : 0.9 + (0.1 * (Math.pow(2, -10 * decelProgress) * Math.sin((decelProgress * 10 - 0.75) * c4) + 1))
        blurAmount = (1 - decelProgress) * 12
      }

      const currentPositionPx = (startPosition * SYMBOL_HEIGHT) + (distance * eased)
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
        // Final settle
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
    setParticles([])

    try {
      const data = await spinMutation.mutateAsync(betAmount)

      // Professional staggered reel stops
      const spinDurations = [1800, 2200, 2600]

      // Start all reels spinning
      spinDurations.forEach((duration, reelIndex) => {
        animateReel(reelIndex, data.result[reelIndex] - 1, duration)
      })

      // Wait for all reels to stop
      setTimeout(() => {
        setResult(data.result)
        setWinAmount(data.winAmount)
        setIsSpinning(false)
        refetchBalance()

        if (data.isWin) {
          setShowWin(true)
          triggerWinEffects(data.winAmount, betAmount)
        }
      }, Math.max(...spinDurations) + 200)

    } catch (error) {
      console.error('Spin failed:', error)
      setIsSpinning(false)
    }
  }

  const triggerWinEffects = (win: number, bet: number) => {
    const multiplier = win / bet

    // Confetti for big wins
    if (multiplier >= 10) {
      for (let i = 0; i < 100; i++) {
        setTimeout(() => createParticle(), i * 20)
      }
    } else if (multiplier >= 5) {
      for (let i = 0; i < 50; i++) {
        setTimeout(() => createParticle(), i * 30)
      }
    } else {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => createParticle(), i * 50)
      }
    }

    // Screen shake for jackpot
    if (multiplier >= 50) {
      document.body.classList.add('screen-shake')
      setTimeout(() => document.body.classList.remove('screen-shake'), 1000)
    }
  }

  const createParticle = () => {
    const id = Date.now() + Math.random()
    const particle = {
      id,
      x: Math.random() * 100,
      y: Math.random() * 100
    }
    setParticles(prev => [...prev, particle])
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== id))
    }, 3000)
  }

  const getSymbol = (value: number) => {
    return currentTheme.symbols[value] || '❓'
  }

  const quickBet = (amount: number) => {
    setBetAmount(amount)
  }

  return (
    <div className="slots-game-page">
      {/* Top Ad */}
      <div style={{ marginBottom: '20px' }}>
        <AdSenseUnit adSlot="1234567890" />
      </div>

      <div className="container">
        {/* Header */}
        <div className="game-header text-center">
          <h1 className="game-title gold-text animated-title" style={{ color: currentTheme.colors.primary }}>
            🎰 {currentTheme.name.toUpperCase()} 🎰
          </h1>
          <div className="balance-display">
            <div className="balance-label">YOUR BALANCE</div>
            <div className={`balance-amount gold-text ${showWin ? 'balance-pulse' : ''}`}>
              {balanceData?.balance?.toLocaleString() || 0} 💰
            </div>
          </div>
        </div>

        {/* Slot Machine */}
        <div className={`slot-machine ${isSpinning ? 'machine-active' : ''}`}>
          {/* Marquee Lights */}
          <div className="marquee-lights">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="marquee-light" style={{ animationDelay: `${i * 0.1}s` }}></div>
            ))}
          </div>

          <div className="slot-body">
            {/* Payout Line */}
            <div className="payout-line"></div>

            {/* Reels */}
            <div className="reels-container">
              {[0, 1, 2].map((index) => (
                <div key={index} className="reel-window">
                  <div className={`reel ${isSpinning ? 'reel-spinning' : 'reel-stopped'}`}
                    style={{
                      filter: `blur(${reelBlurs[index]}px)`,
                      transition: 'filter 0.1s linear'
                    }}
                  >
                    {/* Show 3 symbols per reel for scrolling effect */}
                    {[-1, 0, 1].map((offset) => {
                      const symbolIndex = Math.floor(reelPositions[index] + offset + currentTheme.symbols.length) % currentTheme.symbols.length
                      return (
                        <div
                          key={offset}
                          className={`symbol ${offset === 0 && !isSpinning ? 'symbol-active' : ''}`}
                          style={{
                            transform: `translateY(${offset * 140}px)`,
                            opacity: offset === 0 ? 1 : 0.5
                          }}
                        >
                          {getSymbol(symbolIndex)}
                        </div>
                      )
                    })}
                  </div>

                  {/* Reel glow when stopped */}
                  {!isSpinning && result && (
                    <div className="reel-glow" style={{
                      animationDelay: `${index * 0.2}s`,
                      boxShadow: `0 0 30px ${currentTheme.colors.primary}, inset 0 0 20px ${currentTheme.colors.primary}`
                    }}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Win Display */}
            {showWin && winAmount > 0 && (
              <div className={`win-display ${
                winAmount >= betAmount * 100 ? 'jackpot-display' :
                winAmount >= betAmount * 50 ? 'mega-win-display' :
                winAmount >= betAmount * 10 ? 'big-win-display' : 'normal-win-display'
              }`}>
                {winAmount >= betAmount * 100 ? (
                  <>
                    <div className="win-title jackpot-title">💥 JACKPOT! 💥</div>
                    <div className="win-amount jackpot-amount">{winAmount.toLocaleString()}</div>
                    <div className="win-subtitle">TOKENS!</div>
                  </>
                ) : winAmount >= betAmount * 50 ? (
                  <>
                    <div className="win-title mega-win-title">🔥 MEGA WIN! 🔥</div>
                    <div className="win-amount mega-win-amount">{winAmount.toLocaleString()}</div>
                    <div className="win-subtitle">TOKENS!</div>
                  </>
                ) : winAmount >= betAmount * 10 ? (
                  <>
                    <div className="win-title big-win-title">🌟 BIG WIN! 🌟</div>
                    <div className="win-amount big-win-amount">{winAmount.toLocaleString()}</div>
                    <div className="win-subtitle">TOKENS!</div>
                  </>
                ) : (
                  <>
                    <div className="win-title">✨ YOU WIN! ✨</div>
                    <div className="win-amount">{winAmount.toLocaleString()}</div>
                    <div className="win-subtitle">TOKENS!</div>
                  </>
                )}
              </div>
            )}

            {/* Error Display */}
            {spinMutation.error && (
              <div className="error-display">
                ⚠️ {spinMutation.error.message}
              </div>
            )}
          </div>

          {/* Particle Effects */}
          {particles.map(particle => (
            <div
              key={particle.id}
              className="particle"
              style={{
                left: `${particle.x}%`,
                '--particle-color': [currentTheme.colors.primary, currentTheme.colors.secondary, currentTheme.colors.accent][Math.floor(Math.random() * 3)]
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="game-controls">
          <div className="bet-controls card">
            <div className="control-section">
              <label className="control-label">BET AMOUNT</label>
              <div className="bet-input-group">
                <button
                  className="btn btn-secondary"
                  onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
                  disabled={isSpinning}
                >
                  -10
                </button>
                <input
                  type="number"
                  className="input bet-input"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min="1"
                  max="1000"
                  disabled={isSpinning}
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => setBetAmount(Math.min(1000, betAmount + 10))}
                  disabled={isSpinning}
                >
                  +10
                </button>
              </div>
            </div>

            <div className="quick-bets">
              <label className="control-label">QUICK BETS</label>
              <div className="quick-bet-buttons">
                {[10, 50, 100, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    className={`btn ${betAmount === amount ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => quickBet(amount)}
                    disabled={isSpinning}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            className={`btn btn-primary spin-button ${isSpinning ? 'spinning-button' : ''}`}
            onClick={handleSpin}
            disabled={isSpinning || !balanceData || balanceData.balance < betAmount}
          >
            {isSpinning ? '🎰 SPINNING... 🎰' : '🎰 SPIN NOW 🎰'}
          </button>

          {balanceData && balanceData.balance < betAmount && (
            <p className="insufficient-funds">
              ⚠️ Insufficient balance! Lower your bet or claim daily bonus.
            </p>
          )}
        </div>

        {/* Paytable */}
        <div className="paytable card">
          <h3 className="paytable-title gold-text">💰 PAYTABLE 💰</h3>
          <div className="paytable-grid">
            {Object.entries(currentTheme.multipliers).slice(0, 5).map(([combo, mult]) => (
              <div key={combo} className="paytable-row">
                <div className="paytable-combination">{combo.split('').join(' ')}</div>
                <div className="paytable-payout gold-text">{mult}x BET{mult >= 500 ? ' - JACKPOT!' : ''}</div>
              </div>
            ))}
            <div className="paytable-row">
              <div className="paytable-combination">Any Three of a Kind</div>
              <div className="paytable-payout">10x BET</div>
            </div>
            <div className="paytable-row">
              <div className="paytable-combination">Any Two of a Kind</div>
              <div className="paytable-payout">2x BET</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ad */}
      <div style={{ marginTop: '40px' }}>
        <AdSenseUnit adSlot="9876543210" />
      </div>

      <style>{`
        .slots-game-page {
          min-height: 100vh;
          padding: 40px 0 60px;
        }

        .game-header {
          margin-bottom: 40px;
        }

        .animated-title {
          font-size: 56px;
          font-weight: 900;
          margin-bottom: 30px;
          font-family: 'Cinzel', serif;
          animation: title-glow 2s ease-in-out infinite;
          text-shadow: 0 0 20px ${currentTheme.colors.primary}, 0 0 40px ${currentTheme.colors.accent};
        }

        @keyframes title-glow {
          0%, 100% {
            text-shadow: 0 0 20px ${currentTheme.colors.primary}, 0 0 40px ${currentTheme.colors.accent};
            transform: scale(1);
          }
          50% {
            text-shadow: 0 0 30px ${currentTheme.colors.primary}, 0 0 60px ${currentTheme.colors.accent};
            transform: scale(1.05);
          }
        }

        .balance-display {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(10px);
          padding: 20px 40px;
          border-radius: 15px;
          display: inline-block;
          border: 2px solid ${currentTheme.colors.primary}80;
          box-shadow: 0 0 20px ${currentTheme.colors.primary}40;
          transition: all 0.3s ease;
        }

        .balance-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 36px;
          font-weight: 900;
          font-family: 'Cinzel', serif;
          transition: all 0.3s ease;
        }

        .balance-pulse {
          animation: balance-pulse 0.5s ease-in-out 3;
        }

        @keyframes balance-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); color: #10b981; }
        }

        .slot-machine {
          max-width: 900px;
          margin: 0 auto 40px;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border-radius: 30px;
          padding: 40px;
          position: relative;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 0 5px ${currentTheme.colors.primary}20,
            inset 0 0 100px rgba(0, 0, 0, 0.5);
          transition: all 0.3s ease;
        }

        .machine-active {
          animation: machine-vibrate 0.1s linear infinite;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 0 0 5px ${currentTheme.colors.primary}60,
            0 0 100px ${currentTheme.colors.primary}40,
            inset 0 0 100px rgba(0, 0, 0, 0.5);
        }

        @keyframes machine-vibrate {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-2px, 2px) rotate(-0.5deg); }
          50% { transform: translate(2px, -2px) rotate(0.5deg); }
          75% { transform: translate(-2px, -2px) rotate(-0.5deg); }
        }

        .marquee-lights {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          height: 20px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .marquee-light {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${currentTheme.colors.primary};
          box-shadow: 0 0 15px ${currentTheme.colors.primary}, 0 0 30px ${currentTheme.colors.accent};
          animation: marquee-blink 1s ease-in-out infinite;
        }

        @keyframes marquee-blink {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.8); }
        }

        .slot-body {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4));
          border-radius: 20px;
          padding: 40px 30px;
          position: relative;
          box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.8);
        }

        .payout-line {
          position: absolute;
          top: 50%;
          left: 30px;
          right: 30px;
          height: 4px;
          background: linear-gradient(90deg,
            transparent,
            ${currentTheme.colors.primary} 20%,
            ${currentTheme.colors.primary} 80%,
            transparent
          );
          transform: translateY(-50%);
          z-index: 10;
          box-shadow: 0 0 20px ${currentTheme.colors.primary};
          animation: line-pulse 2s ease-in-out infinite;
        }

        @keyframes line-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; box-shadow: 0 0 30px ${currentTheme.colors.primary}; }
        }

        .reels-container {
          display: flex;
          justify-content: center;
          gap: 30px;
          position: relative;
        }

        .reel-window {
          width: 180px;
          height: 140px;
          background: linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.6), rgba(0,0,0,0.9));
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          border: 4px solid ${currentTheme.colors.primary}40;
          box-shadow:
            inset 0 0 30px rgba(0, 0, 0, 0.8),
            0 0 20px ${currentTheme.colors.primary}20;
        }

        .reel {
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .reel-spinning {
          animation: reel-blur 0.1s linear infinite;
        }

        @keyframes reel-blur {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }

        .symbol {
          font-size: 90px;
          text-align: center;
          width: 100%;
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          filter: drop-shadow(0 0 10px ${currentTheme.colors.primary}80);
        }

        .symbol-active {
          animation: symbol-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          filter: drop-shadow(0 0 20px ${currentTheme.colors.primary}) drop-shadow(0 0 40px ${currentTheme.colors.accent});
        }

        @keyframes symbol-bounce {
          0% { transform: scale(0.5) rotateY(90deg); opacity: 0; }
          50% { transform: scale(1.2) rotateY(0deg); }
          100% { transform: scale(1) rotateY(0deg); opacity: 1; }
        }

        .reel-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 16px;
          pointer-events: none;
          animation: reel-glow-pulse 1s ease-in-out;
        }

        @keyframes reel-glow-pulse {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        .particle {
          position: absolute;
          width: 10px;
          height: 10px;
          background: var(--particle-color, #FFD700);
          border-radius: 50%;
          pointer-events: none;
          animation: particle-float 3s ease-out forwards;
          box-shadow: 0 0 10px var(--particle-color, #FFD700);
        }

        @keyframes particle-float {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(
              calc(var(--x, 0) * 200px),
              calc(-200px - var(--y, 0) * 100px)
            ) rotate(720deg) scale(0);
            opacity: 0;
          }
        }

        .win-display {
          margin-top: 30px;
          text-align: center;
          padding: 30px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.3));
          border: 3px solid var(--green);
          animation: win-appear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .jackpot-display {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.3), rgba(255, 140, 0, 0.3));
          border-color: ${currentTheme.colors.primary};
          animation: jackpot-pulse 0.5s ease-in-out infinite, win-appear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .mega-win-display {
          background: linear-gradient(135deg, rgba(255, 69, 0, 0.3), rgba(255, 215, 0, 0.3));
          border-color: #FF4500;
          animation: mega-pulse 0.8s ease-in-out infinite, win-appear 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .big-win-display {
          background: linear-gradient(135deg, rgba(147, 112, 219, 0.3), rgba(255, 215, 0, 0.3));
          border-color: #9370DB;
        }

        @keyframes win-appear {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.1) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes jackpot-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 30px ${currentTheme.colors.primary};
          }
          50% {
            transform: scale(1.05);
            box-shadow: 0 0 60px ${currentTheme.colors.primary}, 0 0 90px ${currentTheme.colors.accent};
          }
        }

        @keyframes mega-pulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.03) rotate(-1deg); }
          75% { transform: scale(1.03) rotate(1deg); }
        }

        .win-title {
          font-size: 36px;
          font-weight: 900;
          margin-bottom: 15px;
          font-family: 'Cinzel', serif;
        }

        .jackpot-title, .mega-win-title, .big-win-title {
          animation: title-rainbow 1s linear infinite;
          background: linear-gradient(90deg,
            ${currentTheme.colors.primary},
            ${currentTheme.colors.accent},
            ${currentTheme.colors.secondary},
            ${currentTheme.colors.primary}
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-size: 48px;
        }

        @keyframes title-rainbow {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .win-amount {
          font-size: 56px;
          font-weight: 900;
          font-family: 'Cinzel', serif;
          color: ${currentTheme.colors.primary};
          text-shadow: 0 0 20px ${currentTheme.colors.primary}, 0 0 40px ${currentTheme.colors.accent};
          animation: amount-count 0.5s ease-out;
        }

        .jackpot-amount, .mega-win-amount, .big-win-amount {
          font-size: 72px;
          animation: amount-explode 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes amount-count {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes amount-explode {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          50% { transform: scale(1.3) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .win-subtitle {
          font-size: 24px;
          font-weight: 700;
          margin-top: 10px;
          color: var(--text-secondary);
        }

        .error-display {
          text-align: center;
          padding: 20px;
          border-radius: 15px;
          margin-top: 20px;
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
          border: 2px solid var(--red);
          font-weight: 700;
        }

        .game-controls {
          max-width: 900px;
          margin: 0 auto;
        }

        .bet-controls {
          margin-bottom: 30px;
        }

        .control-section {
          margin-bottom: 30px;
        }

        .control-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 15px;
          color: ${currentTheme.colors.primary};
          text-shadow: 0 0 10px ${currentTheme.colors.primary}40;
        }

        .bet-input-group {
          display: flex;
          gap: 15px;
          align-items: center;
        }

        .bet-input {
          flex: 1;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
        }

        .quick-bets {
          margin-top: 20px;
        }

        .quick-bet-buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .quick-bet-buttons .btn {
          flex: 1;
          min-width: 80px;
        }

        .spin-button {
          width: 100%;
          padding: 25px;
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .spin-button:not(:disabled):hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px ${currentTheme.colors.primary};
        }

        .spinning-button {
          animation: button-glow 1s ease-in-out infinite;
        }

        @keyframes button-glow {
          0%, 100% { box-shadow: 0 0 20px ${currentTheme.colors.primary}; }
          50% { box-shadow: 0 0 40px ${currentTheme.colors.primary}, 0 0 60px ${currentTheme.colors.accent}; }
        }

        .spin-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .insufficient-funds {
          text-align: center;
          color: var(--red);
          font-weight: 600;
          margin-top: 10px;
          animation: warning-pulse 1s ease-in-out infinite;
        }

        @keyframes warning-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        .paytable {
          max-width: 700px;
          margin: 40px auto 0;
        }

        .paytable-title {
          text-align: center;
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 30px;
          font-family: 'Cinzel', serif;
          text-shadow: 0 0 20px ${currentTheme.colors.primary}80;
        }

        .paytable-grid {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .paytable-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 24px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          border: 2px solid ${currentTheme.colors.primary}30;
          transition: all 0.3s ease;
        }

        .paytable-row:hover {
          background: rgba(0, 0, 0, 0.6);
          border-color: ${currentTheme.colors.primary}80;
          transform: translateX(10px);
          box-shadow: 0 0 20px ${currentTheme.colors.primary}40;
        }

        .paytable-combination {
          font-size: 28px;
        }

        .paytable-payout {
          font-size: 20px;
          font-weight: 700;
          color: ${currentTheme.colors.primary};
          text-shadow: 0 0 10px ${currentTheme.colors.primary}80;
        }

        @keyframes screen-shake {
          0%, 100% { transform: translate(0, 0); }
          10%, 30%, 50%, 70%, 90% { transform: translate(-10px, -10px); }
          20%, 40%, 60%, 80% { transform: translate(10px, 10px); }
        }

        body.screen-shake {
          animation: screen-shake 0.5s;
        }

        @media (max-width: 768px) {
          .animated-title {
            font-size: 32px;
          }

          .slot-machine {
            padding: 20px;
          }

          .reels-container {
            gap: 15px;
          }

          .reel-window {
            width: 100px;
            height: 90px;
          }

          .symbol {
            font-size: 50px;
            height: 90px;
          }

          .marquee-lights {
            gap: 5px;
          }

          .marquee-light {
            width: 8px;
            height: 8px;
          }

          .bet-input-group {
            flex-direction: column;
          }

          .spin-button {
            font-size: 24px;
          }

          .win-title {
            font-size: 24px;
          }

          .win-amount {
            font-size: 36px;
          }

          .jackpot-title, .mega-win-title, .big-win-title {
            font-size: 32px;
          }

          .jackpot-amount, .mega-win-amount, .big-win-amount {
            font-size: 48px;
          }
        }
      `}</style>
    </div>
  )
}
