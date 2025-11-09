import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useUserBalance } from '../hooks/useGames'

interface Fish {
  id: number
  x: number
  y: number
  speed: number
  value: number
  type: 'common' | 'rare' | 'epic' | 'legendary'
  emoji: string
  size: number
  direction: number
  caught: boolean
}

interface FishType {
  type: 'common' | 'rare' | 'epic' | 'legendary'
  emoji: string
  value: number
  probability: number
  size: number
}

interface GameMode {
  name: string
  fishTypes: FishType[]
  timeLimit: number
  bullets: number
  minBet: number
  fishCount: number
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  background: string
}

const GAME_MODES: { [key: string]: GameMode } = {
  classic: {
    name: 'Classic Fish Hunter',
    fishTypes: [
      { type: 'common' as const, emoji: '🐟', value: 2, probability: 0.5, size: 40 },
      { type: 'common' as const, emoji: '🐠', value: 3, probability: 0.3, size: 45 },
      { type: 'rare' as const, emoji: '🐡', value: 5, probability: 0.12, size: 50 },
      { type: 'epic' as const, emoji: '🦈', value: 10, probability: 0.06, size: 70 },
      { type: 'legendary' as const, emoji: '🐋', value: 50, probability: 0.02, size: 100 }
    ],
    timeLimit: 30,
    bullets: 50,
    minBet: 10,
    fishCount: 8,
    colors: { primary: '#00D66B', secondary: '#00A854', accent: '#FFD700' },
    background: 'linear-gradient(180deg, #1e3a8a 0%, #0f172a 100%)'
  },
  'deep-sea': {
    name: 'Deep Sea Adventure',
    fishTypes: [
      { type: 'common' as const, emoji: '🐟', value: 3, probability: 0.35, size: 45 },
      { type: 'common' as const, emoji: '🐠', value: 4, probability: 0.25, size: 50 },
      { type: 'rare' as const, emoji: '🐙', value: 8, probability: 0.15, size: 60 },
      { type: 'rare' as const, emoji: '🦑', value: 12, probability: 0.12, size: 70 },
      { type: 'epic' as const, emoji: '🦈', value: 20, probability: 0.08, size: 90 },
      { type: 'epic' as const, emoji: '🐬', value: 25, probability: 0.03, size: 85 },
      { type: 'legendary' as const, emoji: '🐋', value: 100, probability: 0.015, size: 120 },
      { type: 'legendary' as const, emoji: '🦭', value: 150, probability: 0.005, size: 110 }
    ],
    timeLimit: 45,
    bullets: 75,
    minBet: 25,
    fishCount: 10,
    colors: { primary: '#0099CC', secondary: '#006699', accent: '#00CED1' },
    background: 'linear-gradient(180deg, #003366 0%, #001a33 100%)'
  },
  tropical: {
    name: 'Tropical Reef Paradise',
    fishTypes: [
      { type: 'common' as const, emoji: '🐠', value: 2, probability: 0.4, size: 40 },
      { type: 'common' as const, emoji: '🐡', value: 3, probability: 0.3, size: 45 },
      { type: 'rare' as const, emoji: '🦀', value: 6, probability: 0.15, size: 50 },
      { type: 'rare' as const, emoji: '🦞', value: 8, probability: 0.08, size: 55 },
      { type: 'epic' as const, emoji: '🦈', value: 15, probability: 0.05, size: 75 },
      { type: 'legendary' as const, emoji: '🐢', value: 80, probability: 0.02, size: 100 }
    ],
    timeLimit: 40,
    bullets: 60,
    minBet: 15,
    fishCount: 9,
    colors: { primary: '#FF6B6B', secondary: '#FF4444', accent: '#FFD700' },
    background: 'linear-gradient(180deg, #2563eb 0%, #1e3a8a 100%)'
  },
  arctic: {
    name: 'Arctic Ice Challenge',
    fishTypes: [
      { type: 'common' as const, emoji: '🐟', value: 4, probability: 0.4, size: 42 },
      { type: 'rare' as const, emoji: '🐡', value: 8, probability: 0.25, size: 50 },
      { type: 'rare' as const, emoji: '🦭', value: 12, probability: 0.15, size: 65 },
      { type: 'epic' as const, emoji: '🐧', value: 20, probability: 0.1, size: 60 },
      { type: 'epic' as const, emoji: '🦈', value: 30, probability: 0.06, size: 80 },
      { type: 'legendary' as const, emoji: '🐋', value: 120, probability: 0.03, size: 110 },
      { type: 'legendary' as const, emoji: '🦑', value: 180, probability: 0.01, size: 100 }
    ],
    timeLimit: 35,
    bullets: 40,
    minBet: 30,
    fishCount: 7,
    colors: { primary: '#00CED1', secondary: '#00A0B0', accent: '#87CEEB' },
    background: 'linear-gradient(180deg, #0ea5e9 0%, #155e75 100%)'
  },
  legendary: {
    name: 'Legendary Hunt',
    fishTypes: [
      { type: 'common' as const, emoji: '🐠', value: 5, probability: 0.3, size: 50 },
      { type: 'rare' as const, emoji: '🦑', value: 15, probability: 0.25, size: 65 },
      { type: 'rare' as const, emoji: '🐙', value: 20, probability: 0.2, size: 70 },
      { type: 'epic' as const, emoji: '🦈', value: 40, probability: 0.12, size: 90 },
      { type: 'epic' as const, emoji: '🐬', value: 50, probability: 0.08, size: 85 },
      { type: 'legendary' as const, emoji: '🐋', value: 200, probability: 0.03, size: 130 },
      { type: 'legendary' as const, emoji: '🦭', value: 300, probability: 0.015, size: 120 },
      { type: 'legendary' as const, emoji: '🐉', value: 500, probability: 0.005, size: 150 }
    ],
    timeLimit: 60,
    bullets: 100,
    minBet: 50,
    fishCount: 12,
    colors: { primary: '#9D00FF', secondary: '#7700CC', accent: '#FFD700' },
    background: 'linear-gradient(180deg, #581c87 0%, #3b0764 100%)'
  }
}

export function FishingGame() {
  const { mode = 'classic' } = useParams<{ mode: string }>()
  const currentMode = GAME_MODES[mode] || GAME_MODES.classic
  const [isPlaying, setIsPlaying] = useState(false)
  const [betAmount, setBetAmount] = useState(currentMode.minBet)
  const [fish, setFish] = useState<Fish[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(currentMode.timeLimit)
  const [bullets, setBullets] = useState(currentMode.bullets)
  const [shootPower, setShootPower] = useState(1)
  const [showResult, setShowResult] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { data: balanceData, refetch: refetchBalance } = useUserBalance()

  const startGame = () => {
    if (!balanceData || balanceData.balance < betAmount) return

    setIsPlaying(true)
    setFish([])
    setScore(0)
    setTimeLeft(currentMode.timeLimit)
    setBullets(currentMode.bullets)
    setShowResult(false)
    spawnFish()
  }

  const spawnFish = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const newFish: Fish[] = []
    for (let i = 0; i < currentMode.fishCount; i++) {
      const random = Math.random()

      let selectedType = currentMode.fishTypes[0]
      let cumulativeProbability = 0

      for (const type of currentMode.fishTypes) {
        cumulativeProbability += type.probability
        if (random <= cumulativeProbability) {
          selectedType = type
          break
        }
      }

      newFish.push({
        id: Date.now() + i,
        x: Math.random() * (canvas.width - 100),
        y: Math.random() * (canvas.height - 100),
        speed: 1 + Math.random() * 2,
        value: selectedType.value * shootPower,
        type: selectedType.type,
        emoji: selectedType.emoji,
        size: selectedType.size,
        direction: Math.random() > 0.5 ? 1 : -1,
        caught: false
      })
    }
    setFish(newFish)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying || bullets <= 0) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Check if any fish was clicked
    const clickedFish = fish.find(f =>
      !f.caught &&
      clickX >= f.x && clickX <= f.x + f.size &&
      clickY >= f.y && clickY <= f.y + f.size
    )

    setBullets(prev => prev - 1)

    if (clickedFish) {
      setFish(prev => prev.map(f =>
        f.id === clickedFish.id ? { ...f, caught: true } : f
      ))
      setScore(prev => prev + clickedFish.value)

      // Spawn new fish to replace caught one
      setTimeout(() => {
        const random = Math.random()
        let selectedType = currentMode.fishTypes[0]
        let cumulativeProbability = 0

        for (const type of currentMode.fishTypes) {
          cumulativeProbability += type.probability
          if (random <= cumulativeProbability) {
            selectedType = type
            break
          }
        }

        const newFish: Fish = {
          id: Date.now(),
          x: Math.random() * (canvas.width - 100),
          y: Math.random() * (canvas.height - 100),
          speed: 1 + Math.random() * 2,
          value: selectedType.value * shootPower,
          type: selectedType.type,
          emoji: selectedType.emoji,
          size: selectedType.size,
          direction: Math.random() > 0.5 ? 1 : -1,
          caught: false
        }
        setFish(prev => prev.filter(f => f.id !== clickedFish.id).concat(newFish))
      }, 500)
    }
  }

  useEffect(() => {
    if (!isPlaying) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false)
          setShowResult(true)
          refetchBalance()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPlaying, refetchBalance])

  useEffect(() => {
    if (!isPlaying) return

    const animationFrame = requestAnimationFrame(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      setFish(prev => prev.map(f => {
        let newX = f.x + f.speed * f.direction
        let newDirection = f.direction

        if (newX < 0 || newX > canvas.width - f.size) {
          newDirection = -f.direction
          newX = f.x + f.speed * newDirection
        }

        return { ...f, x: newX, direction: newDirection }
      }))
    })

    return () => cancelAnimationFrame(animationFrame)
  }, [fish, isPlaying])

  const upgradeShootPower = () => {
    if (!balanceData || balanceData.balance < shootPower * 100) return
    setShootPower(prev => prev + 1)
  }

  const winAmount = Math.floor(score * betAmount / 10)

  return (
    <div className="fishing-game-page">
      <div className="container">
        <div className="game-header text-center">
          <h1 className="game-title neon mode-title" style={{ color: currentMode.colors.primary }}>
            {currentMode.name.toUpperCase()}
          </h1>
          <div className="balance-display">
            <div className="balance-label">YOUR BALANCE</div>
            <div className="balance-amount gold-text">
              {balanceData?.balance?.toLocaleString() || 0} 💰
            </div>
          </div>
        </div>

        {!isPlaying && !showResult && (
          <div className="game-setup card">
            <h2 className="gold-text">🎮 GAME SETUP</h2>

            <div className="setup-section">
              <label className="control-label">BET AMOUNT</label>
              <div className="bet-input-group">
                <button
                  className="btn btn-secondary"
                  onClick={() => setBetAmount(Math.max(10, betAmount - 10))}
                >
                  -10
                </button>
                <input
                  type="number"
                  className="input bet-input"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  min="10"
                  max="1000"
                />
                <button
                  className="btn btn-secondary"
                  onClick={() => setBetAmount(Math.min(1000, betAmount + 10))}
                >
                  +10
                </button>
              </div>
            </div>

            <div className="setup-section">
              <label className="control-label">SHOOT POWER: {shootPower}x</label>
              <button
                className="btn btn-secondary"
                onClick={upgradeShootPower}
                disabled={!balanceData || balanceData.balance < shootPower * 100}
              >
                Upgrade Power ({shootPower * 100} tokens)
              </button>
            </div>

            <button
              className="btn btn-primary btn-large"
              onClick={startGame}
              disabled={!balanceData || balanceData.balance < betAmount}
            >
              🎣 START FISHING 🎣
            </button>

            <div className="game-info">
              <h3>📜 HOW TO PLAY</h3>
              <ul>
                <li>Click on fish to catch them!</li>
                <li>Bigger fish = More points</li>
                <li>50 bullets, 30 seconds</li>
                <li>🐟 Common: 2 points | 🐠 Common: 3 points</li>
                <li>🐡 Rare: 5 points | 🦈 Epic: 10 points</li>
                <li>🐋 Legendary: 50 points!</li>
              </ul>
            </div>
          </div>
        )}

        {isPlaying && (
          <div className="game-active">
            <div className="game-stats">
              <div className="stat">
                <span className="stat-label">⏱️ TIME</span>
                <span className="stat-value">{timeLeft}s</span>
              </div>
              <div className="stat">
                <span className="stat-label">💰 SCORE</span>
                <span className="stat-value gold-text">{score}</span>
              </div>
              <div className="stat">
                <span className="stat-label">🎯 BULLETS</span>
                <span className="stat-value">{bullets}</span>
              </div>
            </div>

            <div className="game-canvas-container card" style={{ background: currentMode.background }}>
              <canvas
                ref={canvasRef}
                width={800}
                height={500}
                onClick={handleCanvasClick}
                className="game-canvas mode-canvas"
              />
              {fish.map(f => (
                <div
                  key={f.id}
                  className={`fish ${f.caught ? 'caught' : ''}`}
                  style={{
                    left: f.x,
                    top: f.y,
                    fontSize: f.size,
                    transform: f.direction > 0 ? 'scaleX(1)' : 'scaleX(-1)'
                  }}
                >
                  {f.emoji}
                </div>
              ))}
            </div>
          </div>
        )}

        {showResult && (
          <div className="game-result card">
            <h2 className="result-title gold-text">🎊 FISHING COMPLETE! 🎊</h2>
            <div className="result-stats">
              <div className="result-stat">
                <span>Score</span>
                <span className="gold-text">{score} points</span>
              </div>
              <div className="result-stat">
                <span>Bet Amount</span>
                <span>{betAmount} tokens</span>
              </div>
              <div className="result-stat">
                <span>Win Amount</span>
                <span className="gold-text">{winAmount} tokens</span>
              </div>
              <div className="result-stat large">
                <span>Net Result</span>
                <span className={winAmount > betAmount ? 'green-text' : 'red-text'}>
                  {winAmount > betAmount ? '+' : ''}{winAmount - betAmount} tokens
                </span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-large"
              onClick={() => setShowResult(false)}
            >
              🎣 FISH AGAIN 🎣
            </button>
          </div>
        )}
      </div>

      <style>{`
        .fishing-game-page {
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

        .game-setup {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .game-setup h2 {
          font-size: 32px;
          margin-bottom: 30px;
          font-family: 'Cinzel', serif;
        }

        .setup-section {
          margin-bottom: 30px;
        }

        .control-label {
          display: block;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 2px;
          margin-bottom: 15px;
          color: var(--gold);
        }

        .bet-input-group {
          display: flex;
          gap: 15px;
          align-items: center;
          justify-content: center;
        }

        .bet-input {
          width: 150px;
          text-align: center;
          font-size: 24px;
          font-weight: 700;
        }

        .btn-large {
          width: 100%;
          padding: 25px;
          font-size: 28px;
          font-weight: 900;
          margin-top: 20px;
        }

        .game-info {
          margin-top: 40px;
          text-align: left;
        }

        .game-info h3 {
          color: var(--gold);
          margin-bottom: 15px;
          font-size: 20px;
        }

        .game-info ul {
          list-style: none;
          padding: 0;
        }

        .game-info li {
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .game-active {
          max-width: 900px;
          margin: 0 auto;
        }

        .game-stats {
          display: flex;
          gap: 20px;
          justify-content: center;
          margin-bottom: 30px;
        }

        .stat {
          background: rgba(30, 41, 59, 0.8);
          backdrop-filter: blur(10px);
          padding: 20px 30px;
          border-radius: 15px;
          border: 2px solid rgba(255, 215, 0, 0.3);
          text-align: center;
          flex: 1;
        }

        .stat-label {
          display: block;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          letter-spacing: 2px;
          margin-bottom: 8px;
        }

        .stat-value {
          display: block;
          font-size: 32px;
          font-weight: 900;
          font-family: 'Cinzel', serif;
        }

        .mode-title {
          background: linear-gradient(90deg,
            ${currentMode.colors.primary},
            ${currentMode.colors.accent},
            ${currentMode.colors.primary});
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: mode-shimmer 3s linear infinite;
          filter: drop-shadow(0 0 20px ${currentMode.colors.primary});
        }

        @keyframes mode-shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .game-canvas-container {
          position: relative;
          width: 800px;
          height: 500px;
          margin: 0 auto;
          overflow: hidden;
          cursor: crosshair;
          box-shadow: 0 0 40px ${currentMode.colors.primary}40, inset 0 0 60px rgba(0, 0, 0, 0.3);
          border: 2px solid ${currentMode.colors.primary};
        }

        .mode-canvas {
          filter: brightness(1.1) contrast(1.1);
        }

        .game-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .fish {
          position: absolute;
          transition: opacity 0.3s ease;
          pointer-events: none;
          filter: drop-shadow(0 0 10px ${currentMode.colors.accent});
          animation: fish-glow 2s ease-in-out infinite;
        }

        @keyframes fish-glow {
          0%, 100% { filter: drop-shadow(0 0 10px ${currentMode.colors.accent}); }
          50% { filter: drop-shadow(0 0 20px ${currentMode.colors.primary}); }
        }

        .fish.caught {
          animation: caught 0.5s ease forwards;
        }

        @keyframes caught {
          0% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: scale(0) rotate(360deg);
            opacity: 0;
          }
        }

        .game-result {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }

        .result-title {
          font-size: 40px;
          font-weight: 900;
          margin-bottom: 30px;
          font-family: 'Cinzel', serif;
        }

        .result-stats {
          margin: 30px 0;
        }

        .result-stat {
          display: flex;
          justify-content: space-between;
          padding: 15px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 18px;
        }

        .result-stat.large {
          font-size: 24px;
          font-weight: 900;
          margin-top: 20px;
          border-top: 2px solid var(--gold);
          border-bottom: 2px solid var(--gold);
          padding: 20px 0;
        }

        .green-text {
          color: var(--green);
        }

        .red-text {
          color: var(--red);
        }

        @media (max-width: 900px) {
          .game-canvas-container {
            width: 100%;
            max-width: 800px;
          }

          .game-title {
            font-size: 36px;
          }

          .game-stats {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}
