import { useState } from 'react'

export function DailyBonus() {
  const [claimed, setClaimed] = useState(false)

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
    setClaimed(true)
  }

  return (
    <div className="daily-bonus-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">🎉</span>
          Daily Bonus
        </h1>

        {/* Claim Section */}
        <div className="claim-section card">
          <div className="claim-content">
            <div className="claim-icon">🎁</div>
            <div className="claim-info">
              <div className="claim-title">Daily Reward Ready!</div>
              <div className="claim-desc">Come back every day to claim your bonus</div>
              <div className="claim-amount">+250 Tokens</div>
            </div>
          </div>

          {!claimed ? (
            <button className="btn btn-primary btn-lg claim-btn" onClick={handleClaim}>
              🎁 Claim Today's Bonus
            </button>
          ) : (
            <div className="claimed-status">
              <span className="check-icon">✓</span>
              Claimed! Come back tomorrow for more
            </div>
          )}
        </div>

        {/* Weekly Calendar */}
        <div className="calendar-section card">
          <h2 className="card-title">📅 Weekly Bonus Calendar</h2>

          <div className="calendar-grid">
            {dailyRewards.map((day) => (
              <div
                key={day.day}
                className={`day-card ${day.claimed ? 'claimed' : ''} ${day.today ? 'today' : ''} ${day.special ? 'special' : ''}`}
              >
                {day.claimed && <div className="check-mark">✓</div>}
                {day.today && !claimed && <div className="today-badge">TODAY</div>}
                {day.special && <div className="special-badge">MEGA</div>}

                <div className="day-number">Day {day.day}</div>
                <div className="day-icon">
                  {day.special ? '💎' : '🎁'}
                </div>
                <div className="day-reward">{day.reward.toLocaleString()}</div>
                <div className="day-label">Tokens</div>
              </div>
            ))}
          </div>

          <div className="streak-info">
            <div className="streak-icon">🔥</div>
            <div className="streak-text">
              <strong>3 Day Streak!</strong> Keep claiming to build your streak bonus
            </div>
          </div>
        </div>

        {/* Bonus Info */}
        <div className="info-grid">
          <div className="info-card card">
            <div className="info-icon">⏰</div>
            <div className="info-title">Daily Reset</div>
            <div className="info-desc">Bonus resets at midnight UTC every day</div>
          </div>

          <div className="info-card card">
            <div className="info-icon">🔥</div>
            <div className="info-title">Streak Rewards</div>
            <div className="info-desc">Claim 7 days in a row for a mega bonus</div>
          </div>

          <div className="info-card card">
            <div className="info-icon">💰</div>
            <div className="info-title">Instant Credit</div>
            <div className="info-desc">Tokens credited immediately to your balance</div>
          </div>
        </div>
      </div>

      <style>{`
        .daily-bonus-page {
          min-height: 100vh;
          padding: 40px 0 80px;
        }

        .page-title {
          font-size: 48px;
          font-weight: 900;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--text-primary);
        }

        .title-icon {
          font-size: 56px;
        }

        .claim-section {
          background: linear-gradient(135deg, rgba(0, 214, 107, 0.1), rgba(0, 157, 204, 0.1));
          border: 2px solid var(--primary);
          margin-bottom: 40px;
          text-align: center;
        }

        .claim-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
        }

        .claim-icon {
          font-size: 100px;
          margin-bottom: 20px;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .claim-title {
          font-size: 32px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .claim-desc {
          font-size: 16px;
          color: var(--text-secondary);
          margin-bottom: 16px;
        }

        .claim-amount {
          font-size: 48px;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Cinzel', serif;
        }

        .claim-btn {
          font-size: 20px;
          padding: 20px 48px;
          box-shadow: 0 8px 24px rgba(0, 214, 107, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }

        .claimed-status {
          padding: 24px;
          background: rgba(0, 214, 107, 0.2);
          border: 2px solid var(--primary);
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        .check-icon {
          font-size: 32px;
        }

        .calendar-section {
          margin-bottom: 40px;
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 32px;
          color: var(--text-primary);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 20px;
          margin-bottom: 32px;
        }

        .day-card {
          padding: 24px;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid var(--border-subtle);
          border-radius: 12px;
          text-align: center;
          position: relative;
          transition: all 0.3s ease;
        }

        .day-card:hover {
          transform: translateY(-4px);
        }

        .day-card.claimed {
          opacity: 0.6;
        }

        .day-card.today {
          border-color: var(--primary);
          background: rgba(0, 214, 107, 0.1);
          box-shadow: 0 0 30px rgba(0, 214, 107, 0.3);
        }

        .day-card.special {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.1);
        }

        .check-mark {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 32px;
          height: 32px;
          background: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: #000;
          font-weight: 900;
        }

        .today-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 12px;
          background: var(--primary);
          color: #000;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .special-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 12px;
          background: #FFD700;
          color: #000;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .day-number {
          font-size: 14px;
          color: var(--text-muted);
          margin-bottom: 12px;
        }

        .day-icon {
          font-size: 48px;
          margin-bottom: 12px;
        }

        .day-reward {
          font-size: 28px;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Cinzel', serif;
          margin-bottom: 4px;
        }

        .day-card.special .day-reward {
          color: #FFD700;
        }

        .day-label {
          font-size: 12px;
          color: var(--text-muted);
        }

        .streak-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 107, 107, 0.1);
          border: 2px solid rgba(255, 107, 107, 0.3);
          border-radius: 12px;
        }

        .streak-icon {
          font-size: 40px;
        }

        .streak-text {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .streak-text strong {
          color: #FF6B6B;
          font-weight: 700;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .info-card {
          text-align: center;
          padding: 32px;
        }

        .info-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }

        .info-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .info-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .calendar-grid {
            grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          }

          .claim-title {
            font-size: 24px;
          }

          .claim-amount {
            font-size: 36px;
          }
        }
      `}</style>
    </div>
  )
}
