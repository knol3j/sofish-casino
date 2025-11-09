export function Leaderboard() {
  const leaders = [
    { rank: 1, username: 'DragonSlayer88', avatar: '🐉', winnings: 428500, games: 1240, winRate: 68 },
    { rank: 2, username: 'LuckyAce', avatar: '🃏', winnings: 387200, games: 980, winRate: 65 },
    { rank: 3, username: 'GoldRush777', avatar: '💰', winnings: 352100, games: 1105, winRate: 62 },
    { rank: 4, username: 'admin', avatar: '👤', winnings: 243180, games: 210, winRate: 63, isYou: true },
    { rank: 5, username: 'CasinoKing', avatar: '👑', winnings: 215900, games: 892, winRate: 59 },
    { rank: 6, username: 'SlotMaster', avatar: '🎰', winnings: 198500, games: 750, winRate: 61 },
    { rank: 7, username: 'FishHunter', avatar: '🎣', winnings: 185300, games: 645, winRate: 58 },
    { rank: 8, username: 'RouletteQueen', avatar: '🎲', winnings: 172400, games: 580, winRate: 60 },
    { rank: 9, username: 'BlackjackPro', avatar: '🃏', winnings: 158200, games: 520, winRate: 64 },
    { rank: 10, username: 'DiamondHands', avatar: '💎', winnings: 145800, games: 490, winRate: 57 },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `#${rank}`
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'linear-gradient(135deg, #FFD700, #FFA500)'
      case 2: return 'linear-gradient(135deg, #C0C0C0, #A8A8A8)'
      case 3: return 'linear-gradient(135deg, #CD7F32, #B87333)'
      default: return 'var(--dark-bg)'
    }
  }

  return (
    <div className="leaderboard-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">🏆</span>
          Leaderboard
        </h1>

        {/* Period Tabs */}
        <div className="period-tabs">
          <button className="period-tab active">🔥 Today</button>
          <button className="period-tab">📅 This Week</button>
          <button className="period-tab">📆 This Month</button>
          <button className="period-tab">⏳ All Time</button>
        </div>

        {/* Top 3 Podium */}
        <div className="podium">
          {/* Second Place */}
          <div className="podium-place second">
            <div className="podium-avatar" style={{ background: getRankColor(2) }}>
              <span>{leaders[1].avatar}</span>
            </div>
            <div className="podium-rank">{getRankIcon(2)}</div>
            <div className="podium-username">{leaders[1].username}</div>
            <div className="podium-winnings">{leaders[1].winnings.toLocaleString()}</div>
          </div>

          {/* First Place */}
          <div className="podium-place first">
            <div className="podium-crown">👑</div>
            <div className="podium-avatar" style={{ background: getRankColor(1) }}>
              <span>{leaders[0].avatar}</span>
            </div>
            <div className="podium-rank">{getRankIcon(1)}</div>
            <div className="podium-username">{leaders[0].username}</div>
            <div className="podium-winnings">{leaders[0].winnings.toLocaleString()}</div>
          </div>

          {/* Third Place */}
          <div className="podium-place third">
            <div className="podium-avatar" style={{ background: getRankColor(3) }}>
              <span>{leaders[2].avatar}</span>
            </div>
            <div className="podium-rank">{getRankIcon(3)}</div>
            <div className="podium-username">{leaders[2].username}</div>
            <div className="podium-winnings">{leaders[2].winnings.toLocaleString()}</div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="leaderboard-card card">
          <h2 className="card-title">Top Players</h2>

          <div className="leaderboard-list">
            {leaders.map((leader) => (
              <div key={leader.rank} className={`leader-item ${leader.isYou ? 'is-you' : ''}`}>
                <div className="leader-rank" style={{ background: getRankColor(leader.rank) }}>
                  {getRankIcon(leader.rank)}
                </div>

                <div className="leader-avatar">
                  {leader.avatar}
                </div>

                <div className="leader-info">
                  <div className="leader-username">
                    {leader.username}
                    {leader.isYou && <span className="you-badge">YOU</span>}
                  </div>
                  <div className="leader-stats">
                    {leader.games} games • {leader.winRate}% win rate
                  </div>
                </div>

                <div className="leader-winnings">
                  <div className="winnings-label">Total Winnings</div>
                  <div className="winnings-amount">{leader.winnings.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .leaderboard-page {
          min-height: 100vh;
          padding: 40px 0 80px;
        }

        .page-title {
          font-size: 48px;
          font-weight: 900;
          margin-bottom: 30px;
          display: flex;
          align-items: center;
          gap: 16px;
          color: var(--text-primary);
        }

        .title-icon {
          font-size: 56px;
        }

        .period-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 40px;
          flex-wrap: wrap;
        }

        .period-tab {
          padding: 12px 24px;
          background: var(--dark-card);
          border: 2px solid var(--border-subtle);
          border-radius: 12px;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .period-tab:hover {
          border-color: var(--primary);
          color: var(--text-primary);
        }

        .period-tab.active {
          background: var(--primary);
          border-color: var(--primary);
          color: #000;
        }

        .podium {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: 20px;
          margin-bottom: 60px;
          padding: 40px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.1));
          border-radius: 20px;
          border: 2px solid rgba(255, 215, 0, 0.3);
        }

        .podium-place {
          flex: 1;
          max-width: 250px;
          text-align: center;
          padding: 32px 24px;
          background: var(--dark-card);
          border-radius: 16px;
          border: 2px solid var(--border-subtle);
          position: relative;
          transition: all 0.3s ease;
        }

        .podium-place:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }

        .podium-place.first {
          order: 2;
          transform: scale(1.1);
          border-color: #FFD700;
          box-shadow: 0 0 40px rgba(255, 215, 0, 0.3);
        }

        .podium-place.second {
          order: 1;
          border-color: #C0C0C0;
        }

        .podium-place.third {
          order: 3;
          border-color: #CD7F32;
        }

        .podium-crown {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 40px;
          animation: float 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(-10px); }
        }

        .podium-avatar {
          width: 100px;
          height: 100px;
          margin: 0 auto 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 50px;
          border: 4px solid var(--dark-bg);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        }

        .podium-rank {
          font-size: 32px;
          font-weight: 900;
          margin-bottom: 8px;
        }

        .podium-username {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .podium-winnings {
          font-size: 24px;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Cinzel', serif;
        }

        .leaderboard-card {
          margin-bottom: 40px;
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .leader-item {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          border: 2px solid var(--border-subtle);
          transition: all 0.2s ease;
        }

        .leader-item:hover {
          border-color: var(--primary);
          transform: translateX(8px);
        }

        .leader-item.is-you {
          border-color: var(--primary);
          background: rgba(0, 214, 107, 0.1);
          box-shadow: 0 0 30px rgba(0, 214, 107, 0.2);
        }

        .leader-rank {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: 900;
          color: #000;
        }

        .leader-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .leader-info {
          flex: 1;
        }

        .leader-username {
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .you-badge {
          padding: 4px 10px;
          background: var(--primary);
          color: #000;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 700;
        }

        .leader-stats {
          font-size: 13px;
          color: var(--text-muted);
        }

        .leader-winnings {
          text-align: right;
        }

        .winnings-label {
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .winnings-amount {
          font-size: 24px;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Cinzel', serif;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .podium {
            flex-direction: column;
            align-items: center;
          }

          .podium-place.first {
            order: 1;
          }

          .podium-place.second {
            order: 2;
          }

          .podium-place.third {
            order: 3;
          }

          .leader-item {
            flex-wrap: wrap;
          }

          .leader-winnings {
            width: 100%;
            text-align: center;
            margin-top: 12px;
          }
        }
      `}</style>
    </div>
  )
}
