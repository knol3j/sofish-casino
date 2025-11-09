export function Transactions() {
  const transactions = [
    { id: 1, type: 'win', game: 'Dragon\'s Fortune', amount: 15420, date: '2025-01-07 14:32', status: 'completed' },
    { id: 2, type: 'bet', game: 'Deep Sea Adventure', amount: -500, date: '2025-01-07 14:15', status: 'completed' },
    { id: 3, type: 'win', game: 'Diamond Deluxe', amount: 3250, date: '2025-01-07 13:45', status: 'completed' },
    { id: 4, type: 'deposit', game: 'Token Purchase', amount: 10000, date: '2025-01-07 12:00', status: 'completed' },
    { id: 5, type: 'bet', game: 'Blackjack', amount: -1000, date: '2025-01-07 11:30', status: 'completed' },
    { id: 6, type: 'win', game: 'Tropical Reef Paradise', amount: 840, date: '2025-01-07 10:22', status: 'completed' },
    { id: 7, type: 'bonus', game: 'Daily Login Bonus', amount: 500, date: '2025-01-07 09:00', status: 'completed' },
    { id: 8, type: 'bet', game: 'Roulette', amount: -250, date: '2025-01-06 18:45', status: 'completed' },
    { id: 9, type: 'win', game: 'Vegas Nights', amount: 2100, date: '2025-01-06 17:30', status: 'completed' },
    { id: 10, type: 'bet', game: 'Classic Fish Hunter', amount: -100, date: '2025-01-06 16:15', status: 'completed' },
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'win': return '🎉'
      case 'bet': return '🎰'
      case 'deposit': return '💰'
      case 'bonus': return '🎁'
      default: return '💸'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'win': return 'Win'
      case 'bet': return 'Bet'
      case 'deposit': return 'Deposit'
      case 'bonus': return 'Bonus'
      default: return 'Transaction'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'win': return 'var(--primary)'
      case 'bonus': return 'var(--gold)'
      case 'deposit': return 'var(--accent)'
      default: return 'var(--red)'
    }
  }

  return (
    <div className="transactions-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">💰</span>
          Transaction History
        </h1>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card card">
            <div className="summary-icon deposit">💵</div>
            <div className="summary-info">
              <div className="summary-label">Total Deposits</div>
              <div className="summary-value">10,000</div>
            </div>
          </div>

          <div className="summary-card card">
            <div className="summary-icon win">🎉</div>
            <div className="summary-info">
              <div className="summary-label">Total Winnings</div>
              <div className="summary-value">21,610</div>
            </div>
          </div>

          <div className="summary-card card">
            <div className="summary-icon bet">🎰</div>
            <div className="summary-info">
              <div className="summary-label">Total Wagered</div>
              <div className="summary-value">128,500</div>
            </div>
          </div>

          <div className="summary-card card">
            <div className="summary-icon bonus">🎁</div>
            <div className="summary-info">
              <div className="summary-label">Total Bonuses</div>
              <div className="summary-value">5,500</div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="transactions-card card">
          <div className="card-header">
            <h2>Recent Transactions</h2>
            <div className="filters">
              <select className="filter-select">
                <option>All Types</option>
                <option>Wins</option>
                <option>Bets</option>
                <option>Deposits</option>
                <option>Bonuses</option>
              </select>
              <select className="filter-select">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 90 Days</option>
                <option>All Time</option>
              </select>
            </div>
          </div>

          <div className="transactions-list">
            {transactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-icon" style={{ background: getTypeColor(tx.type) + '20', color: getTypeColor(tx.type) }}>
                  {getTypeIcon(tx.type)}
                </div>

                <div className="tx-details">
                  <div className="tx-game">{tx.game}</div>
                  <div className="tx-date">{tx.date}</div>
                </div>

                <div className="tx-type">
                  <span className="type-badge" style={{ background: getTypeColor(tx.type) + '20', color: getTypeColor(tx.type) }}>
                    {getTypeLabel(tx.type)}
                  </span>
                </div>

                <div className="tx-amount" style={{ color: tx.amount > 0 ? 'var(--primary)' : 'var(--text-primary)' }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                </div>

                <div className="tx-status">
                  <span className="status-badge success">✓ {tx.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button className="btn btn-secondary btn-sm">← Previous</button>
            <span className="page-info">Page 1 of 10</span>
            <button className="btn btn-secondary btn-sm">Next →</button>
          </div>
        </div>
      </div>

      <style>{`
        .transactions-page {
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

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .summary-card {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
        }

        .summary-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .summary-icon.deposit {
          background: rgba(59, 130, 246, 0.2);
        }

        .summary-icon.win {
          background: rgba(0, 214, 107, 0.2);
        }

        .summary-icon.bet {
          background: rgba(239, 68, 68, 0.2);
        }

        .summary-icon.bonus {
          background: rgba(255, 193, 7, 0.2);
        }

        .summary-label {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .summary-value {
          font-size: 28px;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Cinzel', serif;
        }

        .transactions-card {
          margin-bottom: 40px;
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

        .transactions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .transaction-item {
          display: grid;
          grid-template-columns: 60px 1fr auto auto auto;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          transition: all 0.2s ease;
        }

        .transaction-item:hover {
          border-color: var(--primary);
          transform: translateX(4px);
        }

        .tx-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }

        .tx-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .tx-game {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .tx-date {
          font-size: 13px;
          color: var(--text-muted);
        }

        .type-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tx-amount {
          font-size: 20px;
          font-weight: 900;
          font-family: 'Cinzel', serif;
          min-width: 120px;
          text-align: right;
        }

        .status-badge {
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: capitalize;
        }

        .status-badge.success {
          background: rgba(0, 214, 107, 0.2);
          color: var(--primary);
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid var(--border-subtle);
        }

        .page-info {
          color: var(--text-secondary);
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .transaction-item {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .tx-details {
            align-items: center;
          }

          .tx-amount {
            text-align: center;
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
