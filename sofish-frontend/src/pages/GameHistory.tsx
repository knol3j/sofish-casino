export function GameHistory() {
  const gameHistory = [
    { id: 1, game: 'Dragon\'s Fortune', mode: 'Slots', bet: 100, result: '+15,420', multiplier: '154.2x', time: '14:32', date: '2025-01-07', outcome: 'win' },
    { id: 2, game: 'Deep Sea Adventure', mode: 'Fishing', bet: 500, result: '-500', multiplier: '0x', time: '14:15', date: '2025-01-07', outcome: 'loss' },
    { id: 3, game: 'Diamond Deluxe', mode: 'Slots', bet: 50, result: '+3,250', multiplier: '65x', time: '13:45', date: '2025-01-07', outcome: 'win' },
    { id: 4, game: 'Blackjack', mode: 'Table', bet: 1000, result: '+2,000', multiplier: '2x', time: '11:30', date: '2025-01-07', outcome: 'win' },
    { id: 5, game: 'Tropical Reef Paradise', mode: 'Fishing', bet: 50, result: '+840', multiplier: '16.8x', time: '10:22', date: '2025-01-07', outcome: 'win' },
    { id: 6, game: 'Roulette', mode: 'Table', bet: 250, result: '-250', multiplier: '0x', time: '18:45', date: '2025-01-06', outcome: 'loss' },
    { id: 7, game: 'Vegas Nights', mode: 'Slots', bet: 25, result: '+2,100', multiplier: '84x', time: '17:30', date: '2025-01-06', outcome: 'win' },
    { id: 8, game: 'Classic Fish Hunter', mode: 'Fishing', bet: 100, result: '+320', multiplier: '3.2x', time: '16:15', date: '2025-01-06', outcome: 'win' },
  ]

  return (
    <div className="history-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">📊</span>
          Game History
        </h1>

        {/* Stats Overview */}
        <div className="stats-overview">
          <div className="stat-card card win">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <div className="stat-label">Win Rate</div>
              <div className="stat-value">62.5%</div>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">🎮</div>
            <div className="stat-info">
              <div className="stat-label">Games Played</div>
              <div className="stat-value">210</div>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <div className="stat-label">Total Profit</div>
              <div className="stat-value">+23,180</div>
            </div>
          </div>

          <div className="stat-card card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <div className="stat-label">Win Streak</div>
              <div className="stat-value">12</div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="history-card card">
          <div className="card-header">
            <h2>Recent Games</h2>
            <div className="filters">
              <select className="filter-select">
                <option>All Games</option>
                <option>Slots</option>
                <option>Fishing</option>
                <option>Table Games</option>
              </select>
              <select className="filter-select">
                <option>All Results</option>
                <option>Wins Only</option>
                <option>Losses Only</option>
              </select>
            </div>
          </div>

          <div className="history-table">
            <div className="table-header">
              <div>Game</div>
              <div>Mode</div>
              <div>Bet</div>
              <div>Result</div>
              <div>Multiplier</div>
              <div>Time</div>
              <div>Outcome</div>
            </div>

            {gameHistory.map((game) => (
              <div key={game.id} className={`table-row ${game.outcome}`}>
                <div className="game-name">{game.game}</div>
                <div className="game-mode">
                  <span className="mode-badge">{game.mode}</span>
                </div>
                <div className="game-bet">{game.bet}</div>
                <div className={`game-result ${game.outcome}`}>{game.result}</div>
                <div className="game-multiplier">{game.multiplier}</div>
                <div className="game-time">{game.time}<br/><span className="time-date">{game.date}</span></div>
                <div className="game-outcome">
                  <span className={`outcome-badge ${game.outcome}`}>
                    {game.outcome === 'win' ? '✓ Win' : '✗ Loss'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .history-page {
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

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 24px;
        }

        .stat-card.win {
          border: 2px solid var(--primary);
          box-shadow: 0 0 20px rgba(0, 214, 107, 0.2);
        }

        .stat-icon {
          font-size: 48px;
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Cinzel', serif;
        }

        .history-card {
          overflow-x: auto;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .card-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .filters {
          display: flex;
          gap: 12px;
        }

        .filter-select {
          padding: 8px 16px;
          background: var(--dark-bg);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          cursor: pointer;
        }

        .filter-select:hover {
          border-color: var(--primary);
        }

        .history-table {
          min-width: 800px;
        }

        .table-header {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
          gap: 16px;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .table-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1.5fr 1fr;
          gap: 16px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          margin-bottom: 8px;
          border-left: 3px solid transparent;
          transition: all 0.2s ease;
          align-items: center;
        }

        .table-row.win {
          border-left-color: var(--primary);
        }

        .table-row.loss {
          border-left-color: var(--red);
        }

        .table-row:hover {
          background: rgba(0, 0, 0, 0.4);
          transform: translateX(4px);
        }

        .game-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .mode-badge {
          padding: 4px 12px;
          background: rgba(0, 214, 107, 0.2);
          color: var(--primary);
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .game-bet {
          color: var(--text-primary);
          font-weight: 600;
        }

        .game-result.win {
          color: var(--primary);
          font-weight: 900;
        }

        .game-result.loss {
          color: var(--red);
          font-weight: 600;
        }

        .game-multiplier {
          color: var(--gold);
          font-weight: 700;
        }

        .game-time {
          color: var(--text-secondary);
          font-size: 14px;
        }

        .time-date {
          font-size: 12px;
          color: var(--text-muted);
        }

        .outcome-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }

        .outcome-badge.win {
          background: rgba(0, 214, 107, 0.2);
          color: var(--primary);
        }

        .outcome-badge.loss {
          background: rgba(239, 68, 68, 0.2);
          color: var(--red);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .filters {
            width: 100%;
            flex-direction: column;
          }

          .filter-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
