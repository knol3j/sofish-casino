import { useState, useEffect, useRef } from 'react'
import { CanvasConfetti } from '../components/CanvasConfetti'

// Treasure Chest Canvas Component
function TreasureChest({ isOpen, onAnimationComplete }: { isOpen: boolean; onAnimationComplete?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [particles, setParticles] = useState<Array<{
    x: number; y: number; vx: number; vy: number;
    rotation: number; type: string; size: number; opacity: number
  }>>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 300
    canvas.height = 300

    let lidAngle = 0
    let targetLidAngle = isOpen ? -70 : 0
    let glowIntensity = 0
    let shakeAmount = 0
    let particlesList: typeof particles = []

    const drawChest = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const baseY = canvas.height * 0.65

      // Apply shake
      ctx.save()
      if (shakeAmount > 0) {
        ctx.translate(
          (Math.random() - 0.5) * shakeAmount,
          (Math.random() - 0.5) * shakeAmount
        )
        shakeAmount *= 0.95
      }

      // Glow effect when opening
      if (isOpen && glowIntensity > 0) {
        const gradient = ctx.createRadialGradient(centerX, baseY - 30, 0, centerX, baseY - 30, 150)
        gradient.addColorStop(0, `rgba(255, 215, 0, ${glowIntensity * 0.8})`)
        gradient.addColorStop(0.5, `rgba(255, 165, 0, ${glowIntensity * 0.4})`)
        gradient.addColorStop(1, 'transparent')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // Draw particles (coins flying out)
      particlesList.forEach((p, i) => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.globalAlpha = p.opacity
        ctx.font = `${p.size}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(p.type, 0, 0)
        ctx.restore()

        // Update particle
        p.y += p.vy
        p.x += p.vx
        p.vy += 0.3
        p.rotation += 0.1
        p.opacity -= 0.008

        if (p.opacity <= 0 || p.y > canvas.height + 50) {
          particlesList.splice(i, 1)
        }
      })

      // Chest body
      ctx.fillStyle = '#8B4513'
      ctx.strokeStyle = '#5D2E0C'
      ctx.lineWidth = 3

      // Main body
      const bodyWidth = 120
      const bodyHeight = 70
      ctx.beginPath()
      ctx.roundRect(centerX - bodyWidth / 2, baseY - bodyHeight, bodyWidth, bodyHeight, [0, 0, 10, 10])
      ctx.fill()
      ctx.stroke()

      // Metal bands
      ctx.fillStyle = '#DAA520'
      ctx.fillRect(centerX - bodyWidth / 2, baseY - bodyHeight, bodyWidth, 8)
      ctx.fillRect(centerX - bodyWidth / 2, baseY - 30, bodyWidth, 8)

      // Side rivets
      ctx.fillStyle = '#FFD700'
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(centerX - bodyWidth / 2 + 15 + i * 45, baseY - bodyHeight + 4, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(centerX - bodyWidth / 2 + 15 + i * 45, baseY - 26, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Lock
      ctx.fillStyle = '#FFD700'
      ctx.beginPath()
      ctx.roundRect(centerX - 15, baseY - 55, 30, 25, 5)
      ctx.fill()
      ctx.fillStyle = '#0A0F1C'
      ctx.beginPath()
      ctx.arc(centerX, baseY - 45, 5, 0, Math.PI * 2)
      ctx.fill()

      // Lid (animated)
      ctx.save()
      ctx.translate(centerX, baseY - bodyHeight)
      ctx.rotate((lidAngle * Math.PI) / 180)

      // Lid body
      ctx.fillStyle = '#8B4513'
      ctx.strokeStyle = '#5D2E0C'
      ctx.beginPath()
      ctx.moveTo(-bodyWidth / 2, 0)
      ctx.lineTo(-bodyWidth / 2, -25)
      ctx.quadraticCurveTo(-bodyWidth / 2, -45, centerX - bodyWidth / 2 + bodyWidth / 2, -50)
      ctx.quadraticCurveTo(bodyWidth / 2, -45, bodyWidth / 2, -25)
      ctx.lineTo(bodyWidth / 2, 0)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Lid metal band
      ctx.fillStyle = '#DAA520'
      ctx.beginPath()
      ctx.moveTo(-bodyWidth / 2 + 5, -5)
      ctx.lineTo(-bodyWidth / 2 + 5, -22)
      ctx.quadraticCurveTo(-bodyWidth / 2 + 5, -38, 0, -42)
      ctx.quadraticCurveTo(bodyWidth / 2 - 5, -38, bodyWidth / 2 - 5, -22)
      ctx.lineTo(bodyWidth / 2 - 5, -5)
      ctx.closePath()
      ctx.fill()

      ctx.restore()

      // Inside glow and coins visible when open
      if (lidAngle < -20) {
        ctx.save()
        ctx.globalAlpha = Math.min(1, Math.abs(lidAngle) / 70)

        // Golden glow inside
        const insideGradient = ctx.createRadialGradient(centerX, baseY - bodyHeight, 0, centerX, baseY - bodyHeight, 50)
        insideGradient.addColorStop(0, '#FFD700')
        insideGradient.addColorStop(0.5, '#FFA500')
        insideGradient.addColorStop(1, '#8B4513')
        ctx.fillStyle = insideGradient
        ctx.beginPath()
        ctx.ellipse(centerX, baseY - bodyHeight + 10, 45, 20, 0, Math.PI, 0)
        ctx.fill()

        // Coins peeking out
        const coinEmojis = ['🪙', '💰', '💎', '⭐']
        coinEmojis.forEach((emoji, i) => {
          ctx.font = '20px Arial'
          ctx.fillText(emoji, centerX - 30 + i * 20, baseY - bodyHeight)
        })

        ctx.restore()
      }

      ctx.restore()

      // Animate lid
      const lidSpeed = 2
      if (Math.abs(lidAngle - targetLidAngle) > 0.5) {
        lidAngle += (targetLidAngle - lidAngle) * 0.08
      }

      // Trigger particles when opening
      if (isOpen && lidAngle < -30 && particlesList.length < 50) {
        const coinTypes = ['🪙', '💰', '💎', '⭐', '✨', '💵']
        for (let i = 0; i < 3; i++) {
          particlesList.push({
            x: centerX + (Math.random() - 0.5) * 60,
            y: baseY - 80,
            vx: (Math.random() - 0.5) * 8,
            vy: -Math.random() * 12 - 5,
            rotation: Math.random() * Math.PI * 2,
            type: coinTypes[Math.floor(Math.random() * coinTypes.length)],
            size: Math.random() * 20 + 20,
            opacity: 1
          })
        }
      }

      // Increase glow when opening
      if (isOpen) {
        glowIntensity = Math.min(1, glowIntensity + 0.02)
        if (lidAngle < -60 && shakeAmount === 0) {
          shakeAmount = 10
          onAnimationComplete?.()
        }
      } else {
        glowIntensity = Math.max(0, glowIntensity - 0.05)
      }

      animationRef.current = requestAnimationFrame(drawChest)
    }

    drawChest()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isOpen, onAnimationComplete])

  return <canvas ref={canvasRef} className="treasure-chest-canvas" />
}

export function DailyBonus() {
  const [claimed, setClaimed] = useState(false)
  const [isOpening, setIsOpening] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [claimAmount, setClaimAmount] = useState(250)
  const [countingAmount, setCountingAmount] = useState(0)

  const dailyRewards = [
    { day: 1, reward: 100, claimed: true },
    { day: 2, reward: 150, claimed: true },
    { day: 3, reward: 200, claimed: true },
    { day: 4, reward: 250, claimed: false, today: true },
    { day: 5, reward: 300, claimed: false },
    { day: 6, reward: 400, claimed: false },
    { day: 7, reward: 1000, claimed: false, special: true },
  ]

  const handleClaim = () => {
    setIsOpening(true)
  }

  const handleChestOpened = () => {
    setShowConfetti(true)
    setClaimed(true)

    // Animate counting
    let current = 0
    const increment = claimAmount / 30
    const countInterval = setInterval(() => {
      current += increment
      if (current >= claimAmount) {
        setCountingAmount(claimAmount)
        clearInterval(countInterval)
      } else {
        setCountingAmount(Math.floor(current))
      }
    }, 30)

    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 5000)
  }

  return (
    <div className="daily-bonus-page">
      <CanvasConfetti active={showConfetti} intensity="high" duration={5000} />

      <div className="container">
        {/* Animated Header */}
        <div className="page-header">
          <div className="header-sparkles">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="sparkle" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}>✨</div>
            ))}
          </div>
          <h1 className="page-title">
            <span className="title-icon">🎁</span>
            <span className="title-text">Daily Bonus</span>
          </h1>
          <p className="page-subtitle">Open your treasure chest for amazing rewards!</p>
        </div>

        {/* Treasure Chest Claim Section */}
        <div className="claim-section">
          <div className="chest-container">
            <div className="chest-glow" />
            <div className="chest-rays">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="ray" style={{ transform: `rotate(${i * 30}deg)` }} />
              ))}
            </div>
            <TreasureChest isOpen={isOpening} onAnimationComplete={handleChestOpened} />
          </div>

          <div className="claim-info">
            {!claimed ? (
              <>
                <div className="claim-badge">DAY 4 REWARD</div>
                <div className="claim-amount">
                  <span className="amount-value">+{claimAmount}</span>
                  <span className="amount-label">TOKENS</span>
                </div>
                <button
                  className="claim-btn"
                  onClick={handleClaim}
                  disabled={isOpening}
                >
                  {isOpening ? (
                    <span className="btn-opening">Opening...</span>
                  ) : (
                    <>
                      <span className="btn-icon">🔓</span>
                      <span>OPEN CHEST</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <div className="claimed-display">
                <div className="claimed-icon">🎉</div>
                <div className="claimed-text">CLAIMED!</div>
                <div className="claimed-amount">+{countingAmount.toLocaleString()}</div>
                <div className="next-bonus">Next bonus in 23:45:12</div>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="calendar-section">
          <h2 className="section-title">
            <span className="section-icon">📅</span>
            Weekly Rewards
          </h2>

          <div className="calendar-grid">
            {dailyRewards.map((day) => (
              <div
                key={day.day}
                className={`day-card ${day.claimed ? 'claimed' : ''} ${day.today ? 'today' : ''} ${day.special ? 'special' : ''}`}
              >
                <div className="day-bg" />
                {day.claimed && <div className="check-mark">✓</div>}
                {day.today && !claimed && <div className="today-badge pulse-ring">TODAY</div>}
                {day.special && <div className="special-badge">MEGA BONUS</div>}

                <div className="day-number">Day {day.day}</div>
                <div className="day-icon-wrapper">
                  <div className="day-icon">
                    {day.special ? '💎' : day.today ? '🎁' : '🪙'}
                  </div>
                </div>
                <div className="day-reward">{day.reward.toLocaleString()}</div>
                <div className="day-label">Tokens</div>

                {day.today && !claimed && <div className="today-glow" />}
              </div>
            ))}
          </div>

          {/* Streak Progress */}
          <div className="streak-section">
            <div className="streak-header">
              <span className="streak-icon">🔥</span>
              <span className="streak-title">3 Day Streak!</span>
            </div>
            <div className="streak-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '43%' }} />
                <div className="progress-glow" />
              </div>
              <div className="progress-labels">
                <span>Day 3</span>
                <span className="goal">Day 7 Mega Bonus</span>
              </div>
            </div>
            <div className="streak-bonus">
              Keep your streak to unlock <span className="bonus-highlight">+1,000 TOKENS</span>
            </div>
          </div>
        </div>

        {/* Bonus Features */}
        <div className="features-section">
          <div className="feature-card">
            <div className="feature-icon">⏰</div>
            <div className="feature-content">
              <h3>Daily Reset</h3>
              <p>Resets at midnight UTC</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <div className="feature-content">
              <h3>Streak Multiplier</h3>
              <p>Rewards increase daily</p>
            </div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-content">
              <h3>Instant Credit</h3>
              <p>Tokens added immediately</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .daily-bonus-page {
          min-height: 100vh;
          padding: 40px 0 80px;
          position: relative;
          overflow: hidden;
        }

        /* Page Header */
        .page-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
        }

        .header-sparkles {
          position: absolute;
          top: -20px;
          left: 0;
          right: 0;
          height: 150px;
          pointer-events: none;
        }

        .sparkle {
          position: absolute;
          font-size: 20px;
          animation: sparkle-float 3s ease-in-out infinite;
          opacity: 0.6;
        }

        @keyframes sparkle-float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
        }

        .page-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          font-family: 'Cinzel', serif;
          font-size: 56px;
          font-weight: 900;
          margin-bottom: 16px;
        }

        .title-icon {
          font-size: 72px;
          animation: bounce 2s ease-in-out infinite;
        }

        .title-text {
          background: linear-gradient(135deg, #FFE55C 0%, #FFD700 50%, #FFA500 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.3));
        }

        .page-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
        }

        /* Claim Section */
        .claim-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 80px;
          margin-bottom: 80px;
          padding: 60px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(139, 92, 246, 0.05));
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-xl);
          position: relative;
          overflow: hidden;
        }

        .chest-container {
          position: relative;
          width: 300px;
          height: 300px;
        }

        .chest-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 400px;
          height: 400px;
          transform: translate(-50%, -50%);
          background: radial-gradient(ellipse, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
          animation: chest-glow-pulse 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes chest-glow-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
          50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.8; }
        }

        .chest-rays {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 300px;
          height: 300px;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150px;
          height: 2px;
          background: linear-gradient(90deg, var(--gold), transparent);
          transform-origin: left center;
          opacity: 0.3;
          animation: ray-pulse 2s ease-in-out infinite;
        }

        @keyframes ray-pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .treasure-chest-canvas {
          position: relative;
          z-index: 1;
        }

        .claim-info {
          text-align: center;
        }

        .claim-badge {
          display: inline-block;
          padding: 8px 24px;
          background: var(--gradient-gold);
          color: var(--bg-deepest);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          border-radius: var(--radius-full);
          margin-bottom: 24px;
        }

        .claim-amount {
          margin-bottom: 32px;
        }

        .amount-value {
          display: block;
          font-family: 'Cinzel', serif;
          font-size: 72px;
          font-weight: 900;
          background: var(--gradient-gold-shine);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
          animation: amount-pulse 2s ease-in-out infinite;
        }

        @keyframes amount-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .amount-label {
          font-size: 18px;
          color: var(--text-secondary);
          letter-spacing: 4px;
        }

        .claim-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 24px 64px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          border: none;
          border-radius: var(--radius-xl);
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 900;
          color: var(--bg-deepest);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(255, 215, 0, 0.4);
        }

        .claim-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
          transform: rotate(45deg);
          animation: btn-shine 3s ease-in-out infinite;
        }

        @keyframes btn-shine {
          0% { transform: translateX(-100%) rotate(45deg); }
          100% { transform: translateX(100%) rotate(45deg); }
        }

        .claim-btn:hover:not(:disabled) {
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 40px rgba(255, 215, 0, 0.6);
        }

        .claim-btn:disabled {
          opacity: 0.8;
          cursor: default;
        }

        .btn-icon {
          font-size: 28px;
        }

        .btn-opening {
          animation: opening-pulse 0.5s ease-in-out infinite;
        }

        @keyframes opening-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .claimed-display {
          animation: claimed-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        @keyframes claimed-pop {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        .claimed-icon {
          font-size: 64px;
          margin-bottom: 16px;
          animation: bounce 1s ease-in-out infinite;
        }

        .claimed-text {
          font-family: 'Cinzel', serif;
          font-size: 36px;
          font-weight: 900;
          color: var(--green);
          margin-bottom: 12px;
        }

        .claimed-amount {
          font-family: 'Cinzel', serif;
          font-size: 56px;
          font-weight: 900;
          background: var(--gradient-gold-shine);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 16px;
        }

        .next-bonus {
          font-size: 16px;
          color: var(--text-secondary);
        }

        /* Calendar Section */
        .calendar-section {
          margin-bottom: 60px;
        }

        .section-title {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-family: 'Cinzel', serif;
          font-size: 32px;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 40px;
        }

        .section-icon {
          font-size: 36px;
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 16px;
          margin-bottom: 40px;
        }

        .day-card {
          position: relative;
          padding: 24px 16px;
          background: var(--bg-glass);
          border: 2px solid var(--border-light);
          border-radius: var(--radius-xl);
          text-align: center;
          transition: all 0.3s ease;
          overflow: hidden;
        }

        .day-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .day-card:hover {
          transform: translateY(-8px);
          border-color: var(--border-gold);
        }

        .day-card:hover .day-bg {
          opacity: 0.1;
          background: var(--gold);
        }

        .day-card.claimed {
          opacity: 0.5;
        }

        .day-card.today {
          border-color: var(--gold);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
        }

        .day-card.special {
          border-color: var(--accent);
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.05));
        }

        .check-mark {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 32px;
          height: 32px;
          background: var(--green);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 900;
          color: var(--bg-deepest);
          box-shadow: 0 4px 12px rgba(0, 214, 143, 0.4);
        }

        .today-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 16px;
          background: var(--gradient-gold);
          color: var(--bg-deepest);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }

        .special-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          padding: 6px 16px;
          background: linear-gradient(135deg, var(--accent), var(--accent-dark));
          color: white;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          border-radius: var(--radius-full);
          white-space: nowrap;
        }

        .day-number {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .day-icon-wrapper {
          position: relative;
          margin-bottom: 12px;
        }

        .day-icon {
          font-size: 40px;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }

        .day-card.today .day-icon {
          animation: icon-bounce 2s ease-in-out infinite;
        }

        @keyframes icon-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .day-reward {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 900;
          color: var(--gold);
          margin-bottom: 4px;
        }

        .day-card.special .day-reward {
          color: var(--accent-light);
        }

        .day-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .today-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150%;
          height: 150%;
          transform: translate(-50%, -50%);
          background: radial-gradient(ellipse, rgba(255, 215, 0, 0.2), transparent 70%);
          animation: today-glow 3s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes today-glow {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        /* Streak Section */
        .streak-section {
          padding: 32px;
          background: linear-gradient(135deg, rgba(255, 71, 87, 0.1), rgba(255, 99, 71, 0.05));
          border: 2px solid rgba(255, 71, 87, 0.3);
          border-radius: var(--radius-xl);
        }

        .streak-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .streak-icon {
          font-size: 40px;
          animation: fire-dance 0.5s ease-in-out infinite alternate;
        }

        @keyframes fire-dance {
          from { transform: scale(1) rotate(-5deg); }
          to { transform: scale(1.1) rotate(5deg); }
        }

        .streak-title {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 900;
          color: #FF6B6B;
        }

        .streak-progress {
          margin-bottom: 20px;
        }

        .progress-bar {
          position: relative;
          height: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--radius-full);
          overflow: hidden;
          margin-bottom: 12px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FF6B6B, #FF8E53);
          border-radius: var(--radius-full);
          transition: width 0.5s ease;
        }

        .progress-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 43%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: progress-shine 2s ease-in-out infinite;
        }

        @keyframes progress-shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-labels {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--text-muted);
        }

        .goal {
          color: var(--gold);
          font-weight: 600;
        }

        .streak-bonus {
          text-align: center;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .bonus-highlight {
          color: var(--gold);
          font-weight: 700;
        }

        /* Features Section */
        .features-section {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          border-color: var(--border-gold);
          transform: translateY(-4px);
        }

        .feature-icon {
          font-size: 40px;
        }

        .feature-content h3 {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .feature-content p {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .calendar-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .claim-section {
            flex-direction: column;
            gap: 40px;
          }
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 36px;
          }

          .calendar-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .features-section {
            grid-template-columns: 1fr;
          }

          .amount-value {
            font-size: 48px;
          }

          .claim-btn {
            padding: 20px 40px;
            font-size: 18px;
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .pulse-ring {
          position: relative;
        }

        .pulse-ring::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border: 2px solid var(--gold);
          border-radius: inherit;
          transform: translate(-50%, -50%);
          animation: pulse-ring-anim 2s ease-out infinite;
        }

        @keyframes pulse-ring-anim {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
