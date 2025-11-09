import { useState } from 'react'
import { useUserBalance } from '../hooks/useGames'

export function Account() {
  const { data: balanceData, refetch } = useUserBalance()
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState('admin')
  const [email, setEmail] = useState('admin@sofish.io')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSaveProfile = async () => {
    // TODO: Implement API call to update profile
    setIsEditing(false)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    // TODO: Implement API call to change password
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const stats = {
    totalWins: 127,
    totalLosses: 83,
    biggestWin: 15420,
    totalWagered: 128500,
    favoriteGame: 'Dragon\'s Fortune',
    winRate: '60.5%',
    accountAge: '24 days',
    vipLevel: 'Gold'
  }

  return (
    <div className="account-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">👤</span>
          My Account
        </h1>

        {/* Profile Overview */}
        <div className="account-grid">
          {/* Profile Card */}
          <div className="profile-card card">
            <div className="card-header">
              <h2>Profile Information</h2>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? '✖ Cancel' : '✏️ Edit'}
              </button>
            </div>

            <div className="profile-avatar-large">
              <span className="avatar-icon">👤</span>
            </div>

            <div className="profile-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                {isEditing ? (
                  <input
                    type="text"
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                ) : (
                  <div className="form-value">{username}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                ) : (
                  <div className="form-value">{email}</div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Member Since</label>
                <div className="form-value">{stats.accountAge}</div>
              </div>

              <div className="form-group">
                <label className="form-label">VIP Level</label>
                <div className="vip-badge">{stats.vipLevel}</div>
              </div>

              {isEditing && (
                <button className="btn btn-primary btn-full" onClick={handleSaveProfile}>
                  💾 Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Balance Card */}
          <div className="balance-card card">
            <h2 className="card-title">Account Balance</h2>
            <div className="balance-display-large">
              <div className="balance-icon">💰</div>
              <div className="balance-info">
                <div className="balance-label">Available Balance</div>
                <div className="balance-amount-large">
                  {balanceData?.balance?.toLocaleString() || 0}
                </div>
                <div className="balance-currency">TOKENS</div>
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={() => refetch()}>
              🔄 Refresh Balance
            </button>

            <div className="balance-actions">
              <button className="action-btn deposit-btn">
                <span className="action-icon">➕</span>
                <span>Add Tokens</span>
              </button>
              <button className="action-btn withdraw-btn">
                <span className="action-icon">➖</span>
                <span>Withdraw</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-section card">
          <h2 className="card-title">📊 Account Statistics</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <div className="stat-icon">🎯</div>
              <div className="stat-value">{stats.totalWins}</div>
              <div className="stat-label">Total Wins</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">❌</div>
              <div className="stat-value">{stats.totalLosses}</div>
              <div className="stat-label">Total Losses</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">💎</div>
              <div className="stat-value">{stats.biggestWin.toLocaleString()}</div>
              <div className="stat-label">Biggest Win</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">💸</div>
              <div className="stat-value">{stats.totalWagered.toLocaleString()}</div>
              <div className="stat-label">Total Wagered</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">🎮</div>
              <div className="stat-value">{stats.favoriteGame}</div>
              <div className="stat-label">Favorite Game</div>
            </div>
            <div className="stat-box">
              <div className="stat-icon">📈</div>
              <div className="stat-value">{stats.winRate}</div>
              <div className="stat-label">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="security-section card">
          <h2 className="card-title">🔒 Security Settings</h2>

          <div className="security-form">
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <button className="btn btn-primary" onClick={handleChangePassword}>
              🔐 Change Password
            </button>
          </div>

          <div className="security-options">
            <div className="security-option">
              <div className="option-info">
                <div className="option-title">Two-Factor Authentication</div>
                <div className="option-desc">Add an extra layer of security</div>
              </div>
              <button className="btn btn-secondary btn-sm">Enable</button>
            </div>
            <div className="security-option">
              <div className="option-info">
                <div className="option-title">Session Management</div>
                <div className="option-desc">Manage active sessions</div>
              </div>
              <button className="btn btn-secondary btn-sm">Manage</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .account-page {
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

        .account-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin-bottom: 30px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .card-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .profile-avatar-large {
          width: 120px;
          height: 120px;
          margin: 0 auto 24px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid var(--dark-bg);
          box-shadow: 0 8px 32px rgba(0, 214, 107, 0.4);
        }

        .profile-avatar-large .avatar-icon {
          font-size: 60px;
        }

        .profile-form {
          max-width: 400px;
          margin: 0 auto;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-value {
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          color: var(--text-primary);
          font-weight: 500;
        }

        .vip-badge {
          display: inline-block;
          padding: 8px 20px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
          border-radius: 20px;
          font-weight: 700;
          font-size: 16px;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        .balance-card {
          text-align: center;
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .balance-display-large {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          padding: 32px;
          background: linear-gradient(135deg, rgba(0, 214, 107, 0.1), rgba(0, 157, 204, 0.1));
          border-radius: 16px;
          margin-bottom: 24px;
          border: 2px solid var(--primary);
        }

        .balance-icon {
          font-size: 72px;
        }

        .balance-info {
          text-align: left;
        }

        .balance-label {
          font-size: 12px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .balance-amount-large {
          font-size: 48px;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Cinzel', serif;
          line-height: 1;
          margin-bottom: 4px;
        }

        .balance-currency {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 600;
          letter-spacing: 2px;
        }

        .balance-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 16px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .action-icon {
          font-size: 20px;
        }

        .deposit-btn {
          background: var(--primary);
          color: #000;
        }

        .deposit-btn:hover {
          background: var(--primary-dark);
          transform: translateY(-2px);
        }

        .withdraw-btn {
          background: var(--dark-hover);
          color: var(--text-primary);
          border: 1px solid var(--border-subtle);
        }

        .withdraw-btn:hover {
          border-color: var(--primary);
        }

        .stats-section {
          margin-bottom: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .stat-box {
          padding: 24px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          text-align: center;
          border: 1px solid var(--border-subtle);
          transition: all 0.2s ease;
        }

        .stat-box:hover {
          border-color: var(--primary);
          transform: translateY(-4px);
        }

        .stat-icon {
          font-size: 40px;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 900;
          color: var(--primary);
          margin-bottom: 8px;
          font-family: 'Cinzel', serif;
        }

        .stat-label {
          font-size: 13px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .security-section {
          margin-bottom: 30px;
        }

        .security-form {
          max-width: 500px;
          margin-bottom: 32px;
        }

        .security-options {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .security-option {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
        }

        .option-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .option-desc {
          font-size: 13px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .account-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          }

          .balance-display-large {
            flex-direction: column;
            text-align: center;
          }

          .balance-info {
            text-align: center;
          }
        }
      `}</style>
    </div>
  )
}
