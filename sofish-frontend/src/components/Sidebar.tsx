import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../hooks/useAuth'
import { useUserBalance } from '../hooks/useGames'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { data: balanceData } = useUserBalance()
  const isAuthenticated = !!localStorage.getItem('auth_token')

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/login')
  }

  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/', auth: false },
    { icon: '🎮', label: 'Games', path: '/games', auth: true },
    { icon: '🎣', label: 'Fish Hunter', path: '/fishing-hub', auth: true },
    { icon: '🎰', label: 'Slots', path: '/slots-hub', auth: true },
    { icon: '🎲', label: 'Roulette', path: '/roulette', auth: true },
    { icon: '🃏', label: 'Blackjack', path: '/blackjack', auth: true },
    { separator: true },
    { icon: '👤', label: 'My Account', path: '/account', auth: true },
    { icon: '💰', label: 'Transactions', path: '/transactions', auth: true },
    { icon: '📊', label: 'Game History', path: '/history', auth: true },
    { icon: '🏆', label: 'Leaderboard', path: '/leaderboard', auth: true },
    { separator: true },
    { icon: '💎', label: 'VIP Club', path: '/vip', auth: true },
    { icon: '🎁', label: 'Promotions', path: '/promotions', auth: true },
    { icon: '🎉', label: 'Daily Bonus', path: '/daily-bonus', auth: true },
    { separator: true },
    { icon: '⚙️', label: 'Settings', path: '/settings', auth: true },
    { icon: '❓', label: 'Help & Support', path: '/support', auth: false },
    { icon: '📜', label: 'Responsible Gaming', path: '/responsible-gaming', auth: false },
  ]

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* User Profile Section */}
        {isAuthenticated && (
          <div className="sidebar-profile">
            <div className="profile-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="profile-info">
              <div className="profile-name">Admin</div>
              <div className="profile-email">admin@sofish.io</div>
            </div>
            <div className="profile-balance">
              <div className="balance-label">Balance</div>
              <div className="balance-amount">
                💰 {balanceData?.balance?.toLocaleString() || 0}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => {
            if (item.separator) {
              return <div key={`sep-${index}`} className="sidebar-separator" />
            }

            if (item.auth && !isAuthenticated) {
              return null
            }

            return (
              <Link
                key={item.path}
                to={item.path || '/'}
                className="sidebar-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="item-icon">{item.icon}</span>
                <span className="item-label">{item.label}</span>
              </Link>
            )
          })}

          {/* Logout Button */}
          {isAuthenticated && (
            <>
              <div className="sidebar-separator" />
              <button className="sidebar-item logout-btn" onClick={handleLogout}>
                <span className="item-icon">🚪</span>
                <span className="item-label">Logout</span>
              </button>
            </>
          )}

          {/* Login Button */}
          {!isAuthenticated && (
            <>
              <div className="sidebar-separator" />
              <Link
                to="/login"
                className="sidebar-item login-btn"
                onClick={() => setIsOpen(false)}
              >
                <span className="item-icon">🔐</span>
                <span className="item-label">Login / Register</span>
              </Link>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="footer-text">© 2025 Sofish Casino</div>
          <div className="footer-disclaimer">Play Responsibly • 18+</div>
        </div>
      </aside>

      <style>{`
        .hamburger-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1001;
          width: 50px;
          height: 50px;
          background: var(--dark-card);
          border: 2px solid var(--primary);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .hamburger-btn:hover {
          background: var(--dark-hover);
          box-shadow: 0 0 20px var(--primary);
        }

        .hamburger-btn span {
          width: 24px;
          height: 3px;
          background: var(--primary);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger-btn.active span:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }

        .hamburger-btn.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger-btn.active span:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }

        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          z-index: 999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 320px;
          background: linear-gradient(180deg, var(--dark-card) 0%, var(--dark-bg) 100%);
          border-right: 2px solid var(--border-subtle);
          z-index: 1000;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        .sidebar-profile {
          padding: 80px 24px 24px;
          border-bottom: 2px solid var(--border-subtle);
          background: linear-gradient(135deg, rgba(0, 214, 107, 0.1), rgba(0, 157, 204, 0.1));
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          margin: 0 auto 16px;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid var(--dark-card);
          box-shadow: 0 8px 24px rgba(0, 214, 107, 0.3);
        }

        .avatar-icon {
          font-size: 40px;
        }

        .profile-info {
          text-align: center;
          margin-bottom: 16px;
        }

        .profile-name {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .profile-email {
          font-size: 13px;
          color: var(--text-muted);
        }

        .profile-balance {
          background: rgba(0, 0, 0, 0.3);
          padding: 12px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid var(--border-subtle);
        }

        .balance-label {
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .balance-amount {
          font-size: 24px;
          font-weight: 900;
          color: var(--primary);
          font-family: 'Cinzel', serif;
        }

        .sidebar-nav {
          flex: 1;
          padding: 16px 0;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 24px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
          border-left: 3px solid transparent;
          cursor: pointer;
          background: none;
          border-right: none;
          border-top: none;
          border-bottom: none;
          width: 100%;
          font-size: 15px;
        }

        .sidebar-item:hover {
          background: rgba(0, 214, 107, 0.1);
          color: var(--text-primary);
          border-left-color: var(--primary);
        }

        .item-icon {
          font-size: 24px;
          width: 32px;
          text-align: center;
        }

        .item-label {
          font-weight: 500;
        }

        .sidebar-separator {
          height: 1px;
          background: var(--border-subtle);
          margin: 12px 24px;
        }

        .logout-btn, .login-btn {
          color: var(--red);
        }

        .logout-btn:hover, .login-btn:hover {
          background: rgba(239, 68, 68, 0.1);
          border-left-color: var(--red);
        }

        .login-btn {
          color: var(--primary);
        }

        .login-btn:hover {
          background: rgba(0, 214, 107, 0.1);
          border-left-color: var(--primary);
        }

        .sidebar-footer {
          padding: 20px 24px;
          border-top: 2px solid var(--border-subtle);
          text-align: center;
          background: var(--dark-bg);
        }

        .footer-text {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .footer-disclaimer {
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Scrollbar for sidebar */
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: var(--dark-bg);
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: var(--dark-hover);
          border-radius: 3px;
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 280px;
          }

          .hamburger-btn {
            top: 12px;
            left: 12px;
            width: 45px;
            height: 45px;
          }
        }
      `}</style>
    </>
  )
}
