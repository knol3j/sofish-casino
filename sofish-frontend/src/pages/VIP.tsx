export function VIP() {
  const vipLevels = [
    { level: 'Bronze', icon: '🥉', minWager: 0, cashback: 1, bonusMultiplier: 1, benefits: ['Daily Bonus', 'Email Support', 'Standard Games'] },
    { level: 'Silver', icon: '🥈', minWager: 10000, cashback: 2, bonusMultiplier: 1.2, benefits: ['1.2x Bonus', '2% Cashback', 'Priority Support'] },
    { level: 'Gold', icon: '🥇', minWager: 50000, cashback: 3, bonusMultiplier: 1.5, benefits: ['1.5x Bonus', '3% Cashback', 'VIP Support', 'Exclusive Games'], current: true },
    { level: 'Platinum', icon: '💎', minWager: 100000, cashback: 5, bonusMultiplier: 2, benefits: ['2x Bonus', '5% Cashback', '24/7 Support', 'Exclusive Tournaments'] },
    { level: 'Diamond', icon: '💠', minWager: 500000, cashback: 8, bonusMultiplier: 3, benefits: ['3x Bonus', '8% Cashback', 'Personal Manager', 'Premium Tournaments', 'VIP Events'] },
  ]

  const currentLevel = vipLevels[2]
  const nextLevel = vipLevels[3]
  const progress = (128500 / nextLevel.minWager) * 100

  return (
    <div className="vip-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">💎</span>
          VIP Club
        </h1>

        {/* Current Status */}
        <div className="vip-status card">
          <div className="status-header">
            <div className="current-level">
              <div className="level-icon">{currentLevel.icon}</div>
              <div className="level-info">
                <div className="level-name">{currentLevel.level} Member</div>
                <div className="level-desc">Enjoy {currentLevel.cashback}% cashback and {currentLevel.bonusMultiplier}x bonus multiplier</div>
              </div>
            </div>
            <div className="level-badge">
              <div className="badge-icon">{currentLevel.icon}</div>
              <div className="badge-text">{currentLevel.level}</div>
            </div>
          </div>

          <div className="progress-section">
            <div className="progress-header">
              <div className="progress-label">Progress to {nextLevel.level}</div>
              <div className="progress-stats">
                $128,500 / ${nextLevel.minWager.toLocaleString()}
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-info">
              ${(nextLevel.minWager - 128500).toLocaleString()} more to reach {nextLevel.level}
            </div>
          </div>

          <div className="benefits-grid">
            {currentLevel.benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                <span className="benefit-icon">✓</span>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VIP Levels */}
        <div className="vip-levels card">
          <h2 className="card-title">💫 VIP Levels & Benefits</h2>

          <div className="levels-grid">
            {vipLevels.map((level, index) => (
              <div key={index} className={`level-card ${level.current ? 'current' : ''}`}>
                <div className="level-header">
                  <div className="level-icon-large">{level.icon}</div>
                  <div className="level-name-large">{level.level}</div>
                </div>

                <div className="level-requirements">
                  <div className="requirement">
                    <span className="req-label">Min Wager</span>
                    <span className="req-value">${level.minWager.toLocaleString()}</span>
                  </div>
                  <div className="requirement">
                    <span className="req-label">Cashback</span>
                    <span className="req-value highlight">{level.cashback}%</span>
                  </div>
                  <div className="requirement">
                    <span className="req-label">Bonus</span>
                    <span className="req-value highlight">{level.bonusMultiplier}x</span>
                  </div>
                </div>

                <div className="level-benefits">
                  {level.benefits.map((benefit, i) => (
                    <div key={i} className="level-benefit">
                      <span className="benefit-check">✓</span>
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                {level.current && <div className="current-badge">YOUR LEVEL</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Perks Section */}
        <div className="perks-section card">
          <h2 className="card-title">🎁 VIP Perks</h2>

          <div className="perks-grid">
            <div className="perk-card">
              <div className="perk-icon">🎰</div>
              <div className="perk-title">Exclusive Games</div>
              <div className="perk-desc">Access high-stakes tables and premium slot machines</div>
            </div>

            <div className="perk-card">
              <div className="perk-icon">💰</div>
              <div className="perk-title">Higher Cashback</div>
              <div className="perk-desc">Earn more on every game you play</div>
            </div>

            <div className="perk-card">
              <div className="perk-icon">🎁</div>
              <div className="perk-title">Bonus Multipliers</div>
              <div className="perk-desc">Get bigger bonuses and rewards</div>
            </div>

            <div className="perk-card">
              <div className="perk-icon">⚡</div>
              <div className="perk-title">Priority Withdrawals</div>
              <div className="perk-desc">Faster processing for your winnings</div>
            </div>

            <div className="perk-card">
              <div className="perk-icon">👑</div>
              <div className="perk-title">Personal Manager</div>
              <div className="perk-desc">Dedicated support for Diamond members</div>
            </div>

            <div className="perk-card">
              <div className="perk-icon">🏆</div>
              <div className="perk-title">Exclusive Tournaments</div>
              <div className="perk-desc">Compete for massive prize pools</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .vip-page {
          min-height: 100vh;
          padding: 40px 0 80px;
          background: linear-gradient(180deg, #0a0e27 0%, #1a1429 50%, #0a0e27 100%);
        }

        .page-title {
          font-size: 48px;
          font-weight: 900;
          margin-bottom: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--text-primary);
          background: linear-gradient(90deg, #FFD700, #FFA500, #FFD700);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 3s linear infinite;
        }

        @keyframes shine {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .title-icon {
          font-size: 56px;
        }

        .vip-status {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.3);
          margin-bottom: 40px;
        }

        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .current-level {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .level-icon {
          font-size: 72px;
        }

        .level-name {
          font-size: 32px;
          font-weight: 900;
          color: #FFD700;
          margin-bottom: 8px;
        }

        .level-desc {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .level-badge {
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          border-radius: 16px;
          min-width: 120px;
        }

        .badge-icon {
          font-size: 48px;
          margin-bottom: 8px;
        }

        .badge-text {
          font-size: 16px;
          font-weight: 900;
          color: #000;
        }

        .progress-section {
          margin-bottom: 32px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .progress-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .progress-stats {
          font-size: 14px;
          font-weight: 700;
          color: #FFD700;
        }

        .progress-bar {
          height: 12px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 8px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          border-radius: 6px;
          transition: width 0.3s ease;
        }

        .progress-info {
          font-size: 12px;
          color: var(--text-muted);
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .benefit-icon {
          color: #FFD700;
          font-size: 18px;
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 32px;
          color: var(--text-primary);
        }

        .levels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .level-card {
          padding: 24px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
          border: 2px solid var(--border-subtle);
          position: relative;
          transition: all 0.3s ease;
        }

        .level-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .level-card.current {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.1);
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.2);
        }

        .level-header {
          text-align: center;
          margin-bottom: 20px;
        }

        .level-icon-large {
          font-size: 64px;
          margin-bottom: 12px;
        }

        .level-name-large {
          font-size: 24px;
          font-weight: 900;
          color: var(--text-primary);
        }

        .level-requirements {
          display: flex;
          justify-content: space-around;
          margin-bottom: 20px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .requirement {
          text-align: center;
        }

        .req-label {
          display: block;
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 4px;
          text-transform: uppercase;
        }

        .req-value {
          display: block;
          font-size: 18px;
          font-weight: 900;
          color: var(--text-primary);
          font-family: 'Cinzel', serif;
        }

        .req-value.highlight {
          color: #FFD700;
        }

        .level-benefits {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .level-benefit {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
        }

        .benefit-check {
          color: #FFD700;
          font-weight: 900;
        }

        .current-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 14px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.5px;
        }

        .perks-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .perk-card {
          padding: 24px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          text-align: center;
          transition: all 0.2s ease;
        }

        .perk-card:hover {
          border-color: #FFD700;
          transform: translateY(-4px);
        }

        .perk-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .perk-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .perk-desc {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .status-header {
            flex-direction: column;
            gap: 24px;
          }

          .levels-grid, .perks-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
