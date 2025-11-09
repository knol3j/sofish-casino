import { useState, useRef } from 'react'
import { useUserBalance } from '../hooks/useGames'

const ROULETTE_NUMBERS = [
  { number: 0, color: 'green' },
  ...Array.from({ length: 36 }, (_, i) => ({
    number: i + 1,
    color: [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].includes(i + 1) ? 'red' : 'black'
  }))
]

type BetType = 'number' | 'red' | 'black' | 'even' | 'odd' | '1-18' | '19-36'

interface Bet {
  type: BetType
  value: number | string
  amount: number
}

export function RouletteGame() {
  const [bets, setBets] = useState<Bet[]>([])
  const [betAmount, setBetAmount] = useState(10)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<number | null>(null)
  const [winAmount, setWinAmount] = useState(0)
  const [rotation, setRotation] = useState(0)
  const animationFrameRef = useRef<number>()
  const { data: balanceData, refetch: refetchBalance } = useUserBalance()

  const addBet = (type: BetType, value: number | string) => {
    if (!balanceData || balanceData.balance < getTotalBetAmount() + betAmount) return

    setBets(prev => {
      const existing = prev.find(b => b.type === type && b.value === value)
      if (existing) {
        return prev.map(b =>
          b.type === type && b.value === value
            ? { ...b, amount: b.amount + betAmount }
            : b
        )
      }
      return [...prev, { type, value, amount: betAmount }]
    })
  }

  const getTotalBetAmount = () => {
    return bets.reduce((sum, bet) => sum + bet.amount, 0)
  }

  const clearBets = () => {
    setBets([])
  }

  const spinWheel = () => {
    if (bets.length === 0 || spinning) return

    setSpinning(true)
    setWinAmount(0)
    setResult(null)

    // Generate result
    const resultNumber = Math.floor(Math.random() * 37)
    const spins = 6 + Math.random() * 2  // 6-8 full rotations
    const targetRotation = rotation + (spins * 360) + (resultNumber * (360 / 37))
    const duration = 5000  // 5 seconds for professional feel

    const startTime = Date.now()
    const startRotation = rotation

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      let eased: number

      if (progress < 0.15) {
        // Phase 1: Quick acceleration (0-15%)
        const accelProgress = progress / 0.15
        eased = 0.5 * Math.pow(accelProgress, 2)
      } else if (progress < 0.7) {
        // Phase 2: Constant high speed (15-70%)
        const constProgress = (progress - 0.15) / 0.55
        eased = 0.15 * 0.5 + (constProgress * 0.65)
      } else {
        // Phase 3: Smooth deceleration (70-100%)
        const decelProgress = (progress - 0.7) / 0.3
        // Quartic ease-out for smooth, realistic deceleration
        eased = 0.8 + (0.2 * (1 - Math.pow(1 - decelProgress, 4)))
      }

      const currentRotation = startRotation + ((targetRotation - startRotation) * eased)
      setRotation(currentRotation)

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Animation complete - calculate winnings
        setRotation(targetRotation)
        setResult(resultNumber)

        const resultData = ROULETTE_NUMBERS[resultNumber]
        let totalWin = 0

        bets.forEach(bet => {
          if (bet.type === 'number' && bet.value === resultNumber) {
            totalWin += bet.amount * 35 // 35:1 payout
          } else if (bet.type === 'red' && resultData.color === 'red') {
            totalWin += bet.amount * 2 // 1:1 payout
          } else if (bet.type === 'black' && resultData.color === 'black') {
            totalWin += bet.amount * 2
          } else if (bet.type === 'even' && resultNumber % 2 === 0 && resultNumber !== 0) {
            totalWin += bet.amount * 2
          } else if (bet.type === 'odd' && resultNumber % 2 === 1) {
            totalWin += bet.amount * 2
          } else if (bet.type === '1-18' && resultNumber >= 1 && resultNumber <= 18) {
            totalWin += bet.amount * 2
          } else if (bet.type === '19-36' && resultNumber >= 19 && resultNumber <= 36) {
            totalWin += bet.amount * 2
          }
        })

        setWinAmount(totalWin)
        setSpinning(false)
        refetchBalance()
      }
    }

    animate()
  }

  const getNumberColor = (num: number) => {
    return ROULETTE_NUMBERS[num].color
  }

  return (
    <div className="roulette-game-page">
      <div className="container">
        <div className="game-header text-center">
          <h1 className="game-title gold-text neon">🎰 ROULETTE 🎰</h1>
          <div className="balance-display">
            <div className="balance-label">YOUR BALANCE</div>
            <div className="balance-amount gold-text">
              {balanceData?.balance?.toLocaleString() || 0} 💰
            </div>
          </div>
        </div>

        <div className="roulette-container">
          {/* Wheel */}
          <div className="wheel-container">
            <div
              className="roulette-wheel"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {ROULETTE_NUMBERS.map((item, index) => (
                <div
                  key={index}
                  className={`wheel-number ${item.color}`}
                  style={{
                    transform: `rotate(${index * (360 / 37)}deg) translateY(-140px)`
                  }}
                >
                  {item.number}
                </div>
              ))}
            </div>
            <div className="wheel-pointer">▼</div>
            {result !== null && (
              <div className="result-display">
                <div className={`result-number ${getNumberColor(result)}`}>
                  {result}
                </div>
                <div className="result-color">
                  {getNumberColor(result).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Betting Board */}
          <div className="betting-board card">
            <div className="board-section">
              <h3 className="gold-text">NUMBERS</h3>
              <div className="numbers-grid">
                {ROULETTE_NUMBERS.map(item => (
                  <button
                    key={item.number}
                    className={`number-btn ${item.color}`}
                    onClick={() => addBet('number', item.number)}
                    disabled={spinning}
                  >
                    {item.number}
                  </button>
                ))}
              </div>
            </div>

            <div className="board-section">
              <h3 className="gold-text">OUTSIDE BETS</h3>
              <div className="outside-bets">
                <button
                  className="bet-btn red"
                  onClick={() => addBet('red', 'red')}
                  disabled={spinning}
                >
                  🔴 RED (2x)
                </button>
                <button
                  className="bet-btn black"
                  onClick={() => addBet('black', 'black')}
                  disabled={spinning}
                >
                  ⚫ BLACK (2x)
                </button>
                <button
                  className="bet-btn"
                  onClick={() => addBet('even', 'even')}
                  disabled={spinning}
                >
                  EVEN (2x)
                </button>
                <button
                  className="bet-btn"
                  onClick={() => addBet('odd', 'odd')}
                  disabled={spinning}
                >
                  ODD (2x)
                </button>
                <button
                  className="bet-btn"
                  onClick={() => addBet('1-18', '1-18')}
                  disabled={spinning}
                >
                  1-18 (2x)
                </button>
                <button
                  className="bet-btn"
                  onClick={() => addBet('19-36', '19-36')}
                  disabled={spinning}
                >
                  19-36 (2x)
                </button>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="game-controls card">
            <div className="control-row">
              <div className="bet-amount-control">
                <label className="control-label">CHIP VALUE</label>
                <div className="chip-selector">
                  {[10, 50, 100, 500].map(amount => (
                    <button
                      key={amount}
                      className={`chip ${betAmount === amount ? 'active' : ''}`}
                      onClick={() => setBetAmount(amount)}
                      disabled={spinning}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bet-summary">
                <div className="summary-item">
                  <span>Total Bet:</span>
                  <span className="gold-text">{getTotalBetAmount()}</span>
                </div>
                {winAmount > 0 && (
                  <div className="summary-item win">
                    <span>Win Amount:</span>
                    <span className="green-text">{winAmount}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="current-bets">
              {bets.length > 0 && (
                <>
                  <h4>Your Bets:</h4>
                  <div className="bets-list">
                    {bets.map((bet, index) => (
                      <div key={index} className="bet-item">
                        <span>{typeof bet.value === 'number' ? `#${bet.value}` : bet.value.toUpperCase()}</span>
                        <span className="gold-text">{bet.amount}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="action-buttons">
              <button
                className="btn btn-secondary"
                onClick={clearBets}
                disabled={spinning || bets.length === 0}
              >
                🗑️ CLEAR BETS
              </button>
              <button
                className="btn btn-primary btn-large"
                onClick={spinWheel}
                disabled={spinning || bets.length === 0 || !balanceData || balanceData.balance < getTotalBetAmount()}
              >
                {spinning ? '🎰 SPINNING... 🎰' : '🎰 SPIN WHEEL 🎰'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .roulette-game-page {
          min-height: 100vh;
          padding: 40px 0 60px;
        }

        .game-header {
          margin-bottom: 40px;
        }

        .game-title {
          font-size: 56px;
          font-weight: 900;
          margin-bottom: 30px;
          font-family: 'Cinzel', serif;
        }

        .balance-display {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(10px);
          padding: 20px 40px;
          border-radius: 15px;
          display: inline-block;
          border: 2px solid rgba(255, 215, 0, 0.3);
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
        }

        .roulette-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .wheel-container {
          position: relative;
          width: 400px;
          height: 400px;
          margin: 0 auto 40px;
        }

        .roulette-wheel {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(135deg, #1E293B 0%, #312E81 100%);
          border: 10px solid var(--gold);
          position: relative;
          will-change: transform;
          box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
        }

        .wheel-number {
          position: absolute;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
          left: 50%;
          top: 50%;
          margin-left: -15px;
          margin-top: -15px;
          border-radius: 50%;
          border: 2px solid white;
        }

        .wheel-number.red {
          background: #ef4444;
        }

        .wheel-number.black {
          background: #1f2937;
        }

        .wheel-number.green {
          background: #10b981;
        }

        .wheel-pointer {
          position: absolute;
          top: -30px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 40px;
          color: var(--gold);
          z-index: 10;
        }

        .result-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          background: rgba(0, 0, 0, 0.8);
          padding: 20px;
          border-radius: 15px;
          border: 2px solid var(--gold);
        }

        .result-number {
          font-size: 48px;
          font-weight: 900;
          font-family: 'Cinzel', serif;
          padding: 10px 20px;
          border-radius: 50%;
          margin-bottom: 10px;
        }

        .result-number.red {
          background: #ef4444;
        }

        .result-number.black {
          background: #1f2937;
        }

        .result-number.green {
          background: #10b981;
        }

        .result-color {
          font-size: 18px;
          font-weight: 700;
          color: var(--gold);
        }

        .betting-board {
          margin-bottom: 30px;
        }

        .board-section {
          margin-bottom: 30px;
        }

        .board-section h3 {
          font-size: 24px;
          margin-bottom: 15px;
          font-family: 'Cinzel', serif;
        }

        .numbers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
          gap: 10px;
        }

        .number-btn {
          padding: 15px;
          font-size: 18px;
          font-weight: 900;
          border: 2px solid white;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .number-btn.red {
          background: #ef4444;
        }

        .number-btn.black {
          background: #1f2937;
          color: white;
        }

        .number-btn.green {
          background: #10b981;
        }

        .number-btn:hover:not(:disabled) {
          transform: scale(1.1);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }

        .number-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .outside-bets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .bet-btn {
          padding: 20px;
          font-size: 16px;
          font-weight: 700;
          border: 2px solid var(--gold);
          border-radius: 10px;
          background: rgba(30, 41, 59, 0.8);
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .bet-btn.red {
          background: rgba(239, 68, 68, 0.3);
        }

        .bet-btn.black {
          background: rgba(31, 41, 55, 0.8);
        }

        .bet-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 5px 20px rgba(255, 215, 0, 0.3);
        }

        .bet-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .game-controls {
          margin-top: 30px;
        }

        .control-row {
          display: flex;
          gap: 30px;
          margin-bottom: 20px;
        }

        .bet-amount-control {
          flex: 1;
        }

        .control-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 15px;
          color: var(--gold);
        }

        .chip-selector {
          display: flex;
          gap: 10px;
        }

        .chip {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 3px solid var(--gold);
          background: rgba(30, 41, 59, 0.8);
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .chip.active {
          background: var(--gold);
          color: black;
          transform: scale(1.1);
        }

        .bet-summary {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
          font-size: 18px;
          font-weight: 700;
        }

        .summary-item.win {
          border: 2px solid var(--green);
        }

        .current-bets {
          margin-bottom: 20px;
        }

        .current-bets h4 {
          color: var(--gold);
          margin-bottom: 10px;
        }

        .bets-list {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .bet-item {
          display: flex;
          gap: 10px;
          padding: 10px 15px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .action-buttons {
          display: flex;
          gap: 20px;
        }

        .action-buttons .btn {
          flex: 1;
          padding: 20px;
          font-size: 20px;
          font-weight: 900;
        }

        .green-text {
          color: var(--green);
        }

        @media (max-width: 768px) {
          .wheel-container {
            width: 300px;
            height: 300px;
          }

          .control-row {
            flex-direction: column;
          }

          .numbers-grid {
            grid-template-columns: repeat(auto-fill, minmax(50px, 1fr));
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
