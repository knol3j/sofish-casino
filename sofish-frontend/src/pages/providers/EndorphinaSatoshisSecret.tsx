import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSpinSlots, useUserBalance } from '../../hooks/useGames'

// Professional Endorphina Satoshi's Secret Slot
export function EndorphinaSatoshisSecret() {
  const navigate = useNavigate()
  const [betAmount, setBetAmount] = useState(10)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winAmount, setWinAmount] = useState(0)
  const [displayWin, setDisplayWin] = useState(0)
  const [showWin, setShowWin] = useState(false)
  const [reelPositions, setReelPositions] = useState([0, 0, 0, 0, 0])
  const [reelBlurs, setReelBlurs] = useState([0, 0, 0, 0, 0])
  const [winningLines, setWinningLines] = useState<number[]>([])
  const animationFrameRef = useRef<number>()

  const spinMutation = useSpinSlots()
  const { data: balanceData, refetch: refetchBalance } = useUserBalance()

  // Symbol set - professional casino symbols
  const symbols = ['₿', '💰', '💎', '🔐', '📧', '🧑‍💻', '⭐', '7️⃣', 'A']
  const SYMBOL_HEIGHT = 140
  const VISIBLE_SYMBOLS = 3
  const REEL_HEIGHT = SYMBOL_HEIGHT * VISIBLE_SYMBOLS


  // Animated win counter
  useEffect(() => {
    if (showWin && winAmount > 0) {
      const duration = 1500
      const steps = 60
      const increment = winAmount / steps
      let current = 0
      let step = 0

      const timer = setInterval(() => {
        step++
        current = Math.min(current + increment, winAmount)
        setDisplayWin(Math.floor(current))

        if (step >= steps) {
          clearInterval(timer)
          setDisplayWin(winAmount)
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [showWin, winAmount])

  const handleSpin = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setShowWin(false)
    setWinAmount(0)
    setDisplayWin(0)
    setWinningLines([])

    try {
      const data = await spinMutation.mutateAsync(betAmount)

      // Spin animation with realistic physics
      const spinDurations = [2000, 2300, 2600, 2900, 3200] // Staggered stops
      const targetPositions = data.result.map((symbolIndex: number) =>
        (symbolIndex - 1) * SYMBOL_HEIGHT + SYMBOL_HEIGHT * 10 // Offset for spin
      )

      // Start all reels spinning
      spinDurations.forEach((duration, reelIndex) => {
        animateReel(reelIndex, targetPositions[reelIndex], duration)
      })

      // Wait for all reels to stop
      setTimeout(() => {
        setWinAmount(data.winAmount)
        setIsSpinning(false)
        refetchBalance()

        if (data.isWin) {
          setShowWin(true)
          setWinningLines([1, 2, 3]) // Highlight winning lines

          // Flash winning symbols
          const flashInterval = setInterval(() => {
            setWinningLines(prev => prev.length > 0 ? [] : [1, 2, 3])
          }, 400)

          setTimeout(() => {
            clearInterval(flashInterval)
            setWinningLines([1, 2, 3])
          }, 3000)
        }
      }, Math.max(...spinDurations) + 500)

    } catch (error) {
      console.error('Spin failed:', error)
      setIsSpinning(false)
    }
  }

  // Professional reel animation with acceleration, deceleration, and bounce
  const animateReel = (reelIndex: number, targetPosition: number, duration: number) => {
    const startTime = Date.now()
    const startPosition = reelPositions[reelIndex]
    const distance = targetPosition - startPosition + (symbols.length * SYMBOL_HEIGHT * 3)

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      let eased: number
      let blurAmount: number

      if (progress < 0.1) {
        // Phase 1: Ease in (accelerate)
        const accelProgress = progress / 0.1
        eased = 0.5 * Math.pow(accelProgress, 2)
        blurAmount = accelProgress * 15 // Blur increases during acceleration
      } else if (progress < 0.9) {
        // Phase 2: Constant speed
        const constProgress = (progress - 0.1) / 0.8
        eased = 0.05 + (constProgress * 0.85)
        blurAmount = 15 // Maximum blur during constant speed
      } else {
        // Phase 3: Ease out with bounce (decelerate)
        const decelProgress = (progress - 0.9) / 0.1
        // Elastic easing for bounce effect
        const c4 = (2 * Math.PI) / 3
        eased = decelProgress === 1
          ? 1
          : 0.9 + (0.1 * (Math.pow(2, -10 * decelProgress) * Math.sin((decelProgress * 10 - 0.75) * c4) + 1))
        blurAmount = (1 - decelProgress) * 15 // Blur decreases during deceleration
      }

      const currentPosition = startPosition + (distance * eased)

      setReelPositions(prev => {
        const newPositions = [...prev]
        newPositions[reelIndex] = currentPosition % (symbols.length * SYMBOL_HEIGHT)
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
        // Final settle - ensure exact position and remove blur
        const finalPosition = targetPosition % (symbols.length * SYMBOL_HEIGHT)
        setReelPositions(prev => {
          const newPositions = [...prev]
          newPositions[reelIndex] = finalPosition
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

  return (
    <div className="satoshi-slot">
      <div className="container">
        {/* Header */}
        <div className="slot-header">
          <button className="back-button" onClick={() => navigate('/slots-hub')}>
            ← Back
          </button>

          <div className="game-info">
            <div className="provider-tag">ENDORPHINA</div>
            <h1 className="game-title">Satoshi's Secret</h1>
            <div className="game-stats">
              <span className="stat">RTP: 96%</span>
              <span className="stat">Max Win: 50,000x</span>
              <span className="stat">Volatility: High</span>
            </div>
          </div>

          <div className="balance-box">
            <div className="balance-label">Balance</div>
            <div className="balance-value">{balanceData?.balance?.toLocaleString() || 0}</div>
          </div>
        </div>

        {/* Slot Machine */}
        <div className="slot-machine-container">
          <div className={`slot-machine ${isSpinning ? 'spinning' : ''}`}>
            {/* Win display overlay */}
            {showWin && winAmount > 0 && (
              <div className="win-overlay">
                <div className="win-content">
                  <div className="win-label">
                    {winAmount >= betAmount * 100 ? 'MEGA WIN!' :
                     winAmount >= betAmount * 50 ? 'BIG WIN!' :
                     winAmount >= betAmount * 10 ? 'GREAT WIN!' : 'WIN!'}
                  </div>
                  <div className="win-counter">{displayWin.toLocaleString()}</div>
                  <div className="win-text">CREDITS</div>
                </div>
              </div>
            )}

            {/* Reels */}
            <div className="reels">
              {[0, 1, 2, 3, 4].map(reelIndex => (
                <div key={reelIndex} className="reel-container">
                  <div
                    className="reel"
                    style={{
                      transform: `translateY(-${reelPositions[reelIndex]}px)`,
                      filter: `blur(${reelBlurs[reelIndex]}px)`,
                      transition: isSpinning ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                    }}
                  >
                    {/* Render enough symbols for smooth scrolling */}
                    {Array.from({ length: symbols.length * 4 }).map((_, index) => (
                      <div
                        key={index}
                        className={`symbol ${
                          winningLines.length > 0 &&
                          Math.floor((reelPositions[reelIndex] + SYMBOL_HEIGHT) / SYMBOL_HEIGHT) % symbols.length === index % symbols.length
                            ? 'winning' : ''
                        }`}
                        style={{ height: `${SYMBOL_HEIGHT}px` }}
                      >
                        {symbols[index % symbols.length]}
                      </div>
                    ))}
                  </div>

                  {/* Reel borders */}
                  <div className="reel-frame"></div>
                </div>
              ))}
            </div>

            {/* Paylines */}
            <div className="paylines">
              <div className={`payline line-top ${winningLines.includes(1) ? 'active' : ''}`}></div>
              <div className={`payline line-middle ${winningLines.includes(2) ? 'active' : ''}`}></div>
              <div className={`payline line-bottom ${winningLines.includes(3) ? 'active' : ''}`}></div>
            </div>
          </div>

          {/* Controls */}
          <div className="controls">
            <div className="bet-controls">
              <div className="control-group">
                <label>Bet</label>
                <div className="bet-adjuster">
                  <button
                    className="btn-adjust"
                    onClick={() => setBetAmount(Math.max(1, betAmount - 10))}
                    disabled={isSpinning}
                  >
                    −
                  </button>
                  <div className="bet-display">{betAmount}</div>
                  <button
                    className="btn-adjust"
                    onClick={() => setBetAmount(Math.min(1000, betAmount + 10))}
                    disabled={isSpinning}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="quick-bets">
                {[10, 50, 100, 500].map(amount => (
                  <button
                    key={amount}
                    className={`quick-bet ${betAmount === amount ? 'active' : ''}`}
                    onClick={() => setBetAmount(amount)}
                    disabled={isSpinning}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>

            <button
              className={`spin-button ${isSpinning ? 'spinning' : ''}`}
              onClick={handleSpin}
              disabled={isSpinning || !balanceData || balanceData.balance < betAmount}
            >
              {isSpinning ? 'SPINNING...' : 'SPIN'}
            </button>

            <div className="total-bet">
              <span>Total Bet:</span>
              <span className="amount">{betAmount}</span>
            </div>
          </div>
        </div>

        {/* Paytable */}
        <div className="paytable">
          <h3>Paytable</h3>
          <div className="paytable-grid">
            <div className="payout-row">
              <span className="symbols">₿ ₿ ₿ ₿ ₿</span>
              <span className="multiplier">50,000x</span>
            </div>
            <div className="payout-row">
              <span className="symbols">💰 💰 💰 💰 💰</span>
              <span className="multiplier">1,000x</span>
            </div>
            <div className="payout-row">
              <span className="symbols">💎 💎 💎 💎 💎</span>
              <span className="multiplier">500x</span>
            </div>
            <div className="payout-row">
              <span className="symbols">7️⃣ 7️⃣ 7️⃣</span>
              <span className="multiplier">100x</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .satoshi-slot {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 100%);
          padding: 20px;
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .slot-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          gap: 20px;
        }

        .back-button {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .back-button:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .game-info {
          flex: 1;
          text-align: center;
        }

        .provider-tag {
          display: inline-block;
          background: linear-gradient(135deg, #FF6B00, #FF8C00);
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .game-title {
          font-size: 36px;
          font-weight: 900;
          color: #FFD700;
          margin: 8px 0;
          font-family: 'Cinzel', serif;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }

        .game-stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-top: 8px;
        }

        .stat {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .balance-box {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 215, 0, 0.3);
          border-radius: 8px;
          padding: 12px 24px;
          text-align: center;
          min-width: 160px;
        }

        .balance-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .balance-value {
          font-size: 24px;
          font-weight: 900;
          color: #FFD700;
          font-family: 'Cinzel', serif;
        }

        /* Slot Machine */
        .slot-machine-container {
          background: linear-gradient(135deg, #2a2a3e 0%, #1f1f2e 100%);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
          margin-bottom: 40px;
        }

        .slot-machine {
          background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%);
          border-radius: 12px;
          padding: 30px;
          position: relative;
          margin-bottom: 30px;
          box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.8);
        }

        .slot-machine.spinning {
          animation: subtle-shake 0.1s infinite;
        }

        @keyframes subtle-shake {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-1px, 1px); }
          75% { transform: translate(1px, -1px); }
        }

        /* Win Overlay */
        .win-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          border-radius: 12px;
          animation: fade-in 0.3s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .win-content {
          text-align: center;
        }

        .win-label {
          font-size: 48px;
          font-weight: 900;
          color: #FFD700;
          margin-bottom: 20px;
          font-family: 'Cinzel', serif;
          text-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
          animation: pulse-glow 1s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); text-shadow: 0 0 20px rgba(255, 215, 0, 0.8); }
          50% { transform: scale(1.05); text-shadow: 0 0 40px rgba(255, 215, 0, 1); }
        }

        .win-counter {
          font-size: 72px;
          font-weight: 900;
          color: white;
          font-family: 'Cinzel', serif;
          line-height: 1;
        }

        .win-text {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.8);
          margin-top: 12px;
          letter-spacing: 2px;
        }

        /* Reels */
        .reels {
          display: flex;
          gap: 8px;
          justify-content: center;
          height: ${REEL_HEIGHT}px;
          position: relative;
        }

        .reel-container {
          width: 160px;
          height: ${REEL_HEIGHT}px;
          background: linear-gradient(180deg, rgba(0,0,0,0.8), rgba(0,0,0,0.4), rgba(0,0,0,0.8));
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          border: 2px solid rgba(255, 215, 0, 0.2);
        }

        .reel {
          position: absolute;
          width: 100%;
          will-change: transform;
        }

        .symbol {
          width: 100%;
          height: ${SYMBOL_HEIGHT}px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 72px;
          background: rgba(20, 20, 30, 0.5);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          transition: all 0.2s;
        }

        .symbol.winning {
          animation: symbol-flash 0.4s ease-in-out infinite;
          background: rgba(255, 215, 0, 0.2);
        }

        @keyframes symbol-flash {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.1); filter: brightness(1.5); }
        }

        .reel-frame {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.6);
          border-radius: 8px;
        }

        /* Paylines */
        .paylines {
          position: absolute;
          top: 30px;
          left: 30px;
          right: 30px;
          bottom: 30px;
          pointer-events: none;
        }

        .payline {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: transparent;
          transition: all 0.3s;
        }

        .payline.active {
          background: linear-gradient(90deg, transparent, #FFD700, transparent);
          box-shadow: 0 0 10px #FFD700;
        }

        .line-top { top: ${SYMBOL_HEIGHT / 2}px; }
        .line-middle { top: ${SYMBOL_HEIGHT * 1.5}px; }
        .line-bottom { top: ${SYMBOL_HEIGHT * 2.5}px; }

        /* Controls */
        .controls {
          display: flex;
          gap: 30px;
          align-items: center;
        }

        .bet-controls {
          flex: 1;
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .control-group label {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .bet-adjuster {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 8px;
          padding: 8px;
        }

        .btn-adjust {
          width: 36px;
          height: 36px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 20px;
          font-weight: 700;
          transition: all 0.2s;
        }

        .btn-adjust:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .btn-adjust:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .bet-display {
          min-width: 80px;
          text-align: center;
          font-size: 20px;
          font-weight: 900;
          color: #FFD700;
          font-family: 'Cinzel', serif;
        }

        .quick-bets {
          display: flex;
          gap: 8px;
        }

        .quick-bet {
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s;
        }

        .quick-bet:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .quick-bet.active {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: black;
          border-color: #FFD700;
        }

        .quick-bet:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .spin-button {
          min-width: 180px;
          padding: 20px 40px;
          background: linear-gradient(135deg, #00D66B, #00A854);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: 2px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          box-shadow: 0 4px 20px rgba(0, 214, 107, 0.4);
        }

        .spin-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(0, 214, 107, 0.6);
        }

        .spin-button.spinning {
          background: linear-gradient(135deg, #666, #444);
          cursor: not-allowed;
        }

        .spin-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .total-bet {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: center;
          min-width: 120px;
        }

        .total-bet span:first-child {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .total-bet .amount {
          font-size: 24px;
          font-weight: 900;
          color: #FFD700;
          font-family: 'Cinzel', serif;
        }

        /* Paytable */
        .paytable {
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          padding: 30px;
          border: 1px solid rgba(255, 215, 0, 0.2);
        }

        .paytable h3 {
          font-size: 24px;
          font-weight: 900;
          color: #FFD700;
          margin-bottom: 20px;
          text-align: center;
          font-family: 'Cinzel', serif;
        }

        .paytable-grid {
          display: grid;
          gap: 12px;
          max-width: 600px;
          margin: 0 auto;
        }

        .payout-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.2s;
        }

        .payout-row:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 215, 0, 0.3);
        }

        .symbols {
          font-size: 28px;
        }

        .multiplier {
          font-size: 18px;
          font-weight: 700;
          color: #FFD700;
        }

        @media (max-width: 1200px) {
          .slot-header {
            flex-direction: column;
          }

          .controls {
            flex-direction: column;
            gap: 20px;
          }

          .bet-controls {
            flex-direction: column;
            width: 100%;
          }

          .spin-button {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .game-title {
            font-size: 24px;
          }

          .reel-container {
            width: 100px;
          }

          .symbol {
            font-size: 48px;
          }
        }
      `}</style>
    </div>
  )
}
