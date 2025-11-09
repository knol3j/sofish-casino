export function Promotions() {
  const promotions = [
    {
      id: 1,
      title: 'Welcome Bonus',
      icon: '🎁',
      bonus: '100%',
      description: 'Match bonus up to 10,000 tokens on your first deposit',
      code: 'WELCOME100',
      expires: '2025-12-31',
      active: true,
      color: '#00D66B'
    },
    {
      id: 2,
      title: 'Weekend Warrior',
      icon: '🔥',
      bonus: '50%',
      description: 'Get 50% extra tokens on all deposits made during weekends',
      code: 'WEEKEND50',
      expires: '2025-03-31',
      active: true,
      color: '#FF6B6B'
    },
    {
      id: 3,
      title: 'High Roller Cashback',
      icon: '💎',
      bonus: '25%',
      description: 'Wager $5,000+ in a week and get 25% cashback on losses',
      code: 'HIGHROLLER',
      expires: '2025-06-30',
      active: true,
      color: '#00D4FF'
    },
    {
      id: 4,
      title: 'Refer a Friend',
      icon: '👥',
      bonus: '5,000',
      description: 'Get 5,000 tokens for every friend who joins and makes a deposit',
      code: 'REFER5K',
      expires: 'Ongoing',
      active: true,
      color: '#FFD700'
    },
    {
      id: 5,
      title: 'Slot Tournament',
      icon: '🎰',
      bonus: '50,000',
      description: 'Win a share of 50,000 tokens prize pool in weekly slot tournaments',
      code: 'SLOTTOURNEY',
      expires: '2025-02-28',
      active: true,
      color: '#9D00FF'
    },
  ]

  return (
    <div className="promotions-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">🎁</span>
          Promotions & Bonuses
        </h1>

        {/* Featured Promotion */}
        <div className="featured-promo card">
          <div className="featured-badge">🔥 FEATURED</div>
          <div className="featured-content">
            <div className="featured-icon">🎉</div>
            <div className="featured-info">
              <div className="featured-title">Grand Opening Mega Bonus</div>
              <div className="featured-desc">
                Get up to 20,000 tokens with our biggest welcome package ever!
              </div>
              <div className="featured-details">
                <div className="detail">✓ 100% First Deposit Match</div>
                <div className="detail">✓ 50 Free Spins</div>
                <div className="detail">✓ VIP Fast Track</div>
              </div>
              <button className="btn btn-primary btn-lg">
                Claim Bonus
              </button>
            </div>
          </div>
        </div>

        {/* Active Promotions */}
        <div className="promos-grid">
          {promotions.map((promo) => (
            <div key={promo.id} className="promo-card card" style={{ '--promo-color': promo.color } as any}>
              <div className="promo-header">
                <div className="promo-icon" style={{ background: promo.color + '20', color: promo.color }}>
                  {promo.icon}
                </div>
                <div className="promo-bonus" style={{ color: promo.color }}>
                  {promo.bonus}
                  {promo.bonus.includes('%') || promo.id === 4 ? '' : 'x'}
                </div>
              </div>

              <h3 className="promo-title">{promo.title}</h3>
              <p className="promo-desc">{promo.description}</p>

              <div className="promo-code">
                <div className="code-label">Promo Code</div>
                <div className="code-value">
                  {promo.code}
                  <button className="copy-btn" title="Copy code">📋</button>
                </div>
              </div>

              <div className="promo-footer">
                <div className="expires">
                  ⏰ Expires: {promo.expires}
                </div>
                <button className="btn btn-primary btn-sm">
                  Claim Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Terms & Conditions */}
        <div className="terms-section card">
          <h2 className="card-title">📜 Terms & Conditions</h2>

          <div className="terms-content">
            <div className="term-item">
              <span className="term-icon">1️⃣</span>
              <div className="term-text">
                <strong>Wagering Requirements:</strong> All bonuses must be wagered 30x before withdrawal.
              </div>
            </div>

            <div className="term-item">
              <span className="term-icon">2️⃣</span>
              <div className="term-text">
                <strong>Bonus Validity:</strong> Bonuses expire 30 days after being credited to your account.
              </div>
            </div>

            <div className="term-item">
              <span className="term-icon">3️⃣</span>
              <div className="term-text">
                <strong>Game Contribution:</strong> Different games contribute differently to wagering requirements.
              </div>
            </div>

            <div className="term-item">
              <span className="term-icon">4️⃣</span>
              <div className="term-text">
                <strong>Maximum Bet:</strong> Maximum bet with bonus funds is limited to 100 tokens per round.
              </div>
            </div>

            <div className="term-item">
              <span className="term-icon">5️⃣</span>
              <div className="term-text">
                <strong>One Bonus per Person:</strong> Only one bonus can be active at a time per account.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .promotions-page {
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

        .featured-promo {
          margin-bottom: 40px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 107, 107, 0.1));
          border: 2px solid rgba(255, 215, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .featured-badge {
          position: absolute;
          top: 20px;
          right: 20px;
          padding: 8px 20px;
          background: linear-gradient(135deg, #FF6B6B, #FF4444);
          color: white;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 1px;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .featured-content {
          display: flex;
          gap: 32px;
          align-items: center;
        }

        .featured-icon {
          font-size: 120px;
        }

        .featured-info {
          flex: 1;
        }

        .featured-title {
          font-size: 36px;
          font-weight: 900;
          color: #FFD700;
          margin-bottom: 12px;
        }

        .featured-desc {
          font-size: 18px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .featured-details {
          display: flex;
          gap: 24px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .detail {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 600;
        }

        .promos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .promo-card {
          position: relative;
          transition: all 0.3s ease;
        }

        .promo-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: var(--promo-color);
        }

        .promo-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .promo-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .promo-bonus {
          font-size: 32px;
          font-weight: 900;
          font-family: 'Cinzel', serif;
        }

        .promo-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .promo-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .promo-code {
          background: rgba(0, 0, 0, 0.3);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 20px;
        }

        .code-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .code-value {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 18px;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Courier New', monospace;
        }

        .copy-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.2s ease;
        }

        .copy-btn:hover {
          opacity: 1;
        }

        .promo-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .expires {
          font-size: 12px;
          color: var(--text-muted);
        }

        .terms-section {
          margin-bottom: 40px;
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .terms-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .term-item {
          display: flex;
          gap: 16px;
          padding: 16px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
        }

        .term-icon {
          font-size: 24px;
        }

        .term-text {
          flex: 1;
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .term-text strong {
          color: var(--text-primary);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .featured-content {
            flex-direction: column;
            text-align: center;
          }

          .featured-title {
            font-size: 28px;
          }

          .featured-details {
            justify-content: center;
          }

          .promos-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
