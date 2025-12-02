import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../hooks/useAuth'
import { useUserBalance } from '../hooks/useGames'

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { data: balanceData } = useUserBalance()
  const isAuthenticated = !!localStorage.getItem('auth_token')

  const handleLogout = () => {
    logout()
    setIsOpen(false)
    navigate('/login')
  }

  const menuSections = [
    {
      title: 'Games',
      items: [
        { icon: '🎮', label: 'All Games', path: '/games' },
        { icon: '🎣', label: 'Fish Hunter', path: '/fishing-hub', badge: 'HOT' },
        { icon: '🎰', label: 'Slots', path: '/slots-hub' },
        { icon: '🎲', label: 'Roulette', path: '/roulette' },
        { icon: '🃏', label: 'Blackjack', path: '/blackjack' },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'My Profile', path: '/account' },
        { icon: '📊', label: 'Game History', path: '/history' },
        { icon: '💳', label: 'Transactions', path: '/transactions' },
        { icon: '🏆', label: 'Leaderboard', path: '/leaderboard' },
      ]
    },
    {
      title: 'Rewards',
      items: [
        { icon: '🎁', label: 'Daily Bonus', path: '/daily-bonus', badge: 'FREE' },
        { icon: '👑', label: 'VIP Club', path: '/vip', badge: 'VIP' },
        { icon: '🎉', label: 'Promotions', path: '/promotions' },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: '⚙️', label: 'Settings', path: '/settings' },
        { icon: '❓', label: 'Help Center', path: '/support' },
        { icon: '🛡️', label: 'Responsible Gaming', path: '/responsible-gaming' },
      ]
    }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={`hamburger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <div className="hamburger-icon">
          <span />
          <span />
          <span />
        </div>
      </button>

      {/* Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-logo" onClick={() => setIsOpen(false)}>
            <span className="logo-icon">🐟</span>
            <span className="logo-text">SOFISH</span>
          </Link>
        </div>

        {/* User Profile Section */}
        {isAuthenticated && (
          <div className="sidebar-profile">
            <div className="profile-avatar">
              <span className="avatar-emoji">👤</span>
              <div className="avatar-status" />
            </div>
            <div className="profile-info">
              <div className="profile-name">Player</div>
              <div className="profile-level">
                <span className="level-badge">🥉 Bronze</span>
              </div>
            </div>
            <div className="profile-balance">
              <div className="balance-label">Balance</div>
              <div className="balance-value">
                <span className="balance-icon">💰</span>
                <span className="balance-amount">
                  {balanceData?.balance?.toLocaleString() || '0'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {/* Home Link */}
          <Link
            to="/"
            className={`nav-item ${isActive('/') ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </Link>

          {isAuthenticated ? (
            <>
              {menuSections.map((section, sectionIndex) => (
                <div key={section.title} className="nav-section">
                  <div className="section-title">{section.title}</div>
                  {section.items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                      onClick={() => setIsOpen(false)}
                      style={{ animationDelay: `${sectionIndex * 0.05}s` }}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && (
                        <span className={`nav-badge ${item.badge.toLowerCase()}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              ))}

              {/* Logout */}
              <div className="nav-section">
                <button className="nav-item logout-btn" onClick={handleLogout}>
                  <span className="nav-icon">🚪</span>
                  <span className="nav-label">Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="nav-section">
              <Link
                to="/login"
                className="nav-item login-item"
                onClick={() => setIsOpen(false)}
              >
                <span className="nav-icon">🔐</span>
                <span className="nav-label">Login / Register</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Quick Actions */}
        {isAuthenticated && (
          <div className="sidebar-actions">
            <Link
              to="/daily-bonus"
              className="action-btn claim-btn"
              onClick={() => setIsOpen(false)}
            >
              <span className="action-icon">🎁</span>
              <span>Claim Bonus</span>
            </Link>
          </div>
        )}

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="footer-links">
            <a href="#terms">Terms</a>
            <span className="divider">•</span>
            <a href="#privacy">Privacy</a>
          </div>
          <div className="footer-text">
            © 2025 Sofish Casino
          </div>
          <div className="footer-disclaimer">
            Play Responsibly • 18+
          </div>
        </div>
      </aside>

      <style>{`
        /* Hamburger Button */
        .hamburger-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1002;
          width: 54px;
          height: 54px;
          background: var(--bg-glass-dark);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: var(--shadow-gold);
        }

        .hamburger-btn:hover {
          transform: scale(1.05);
          box-shadow: 0 0 30px var(--gold-glow);
        }

        .hamburger-icon {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 24px;
        }

        .hamburger-icon span {
          display: block;
          width: 100%;
          height: 2px;
          background: var(--gold);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger-btn.active .hamburger-icon span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .hamburger-btn.active .hamburger-icon span:nth-child(2) {
          opacity: 0;
          transform: translateX(-10px);
        }

        .hamburger-btn.active .hamburger-icon span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        /* Overlay */
        .sidebar-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.4s ease;
        }

        .sidebar-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        /* Sidebar */
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          width: 300px;
          background: var(--bg-glass-dark);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-right: 1px solid var(--border-gold);
          z-index: 1001;
          transform: translateX(-100%);
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 10px 0 50px rgba(0, 0, 0, 0.5);
        }

        .sidebar.open {
          transform: translateX(0);
        }

        /* Header */
        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid var(--border-subtle);
        }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .sidebar-logo:hover {
          transform: scale(1.02);
        }

        .logo-icon {
          font-size: 32px;
          filter: drop-shadow(0 0 10px var(--gold-glow));
        }

        .logo-text {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 800;
          background: var(--gradient-gold-shine);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 3px;
        }

        /* Profile */
        .sidebar-profile {
          padding: 20px;
          margin: 16px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.08), rgba(255, 165, 0, 0.04));
          border: 1px solid var(--border-gold);
          border-radius: var(--radius-lg);
        }

        .profile-avatar {
          position: relative;
          width: 60px;
          height: 60px;
          margin: 0 auto 12px;
          background: linear-gradient(135deg, var(--bg-card), var(--bg-dark));
          border: 2px solid var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px var(--gold-glow);
        }

        .avatar-emoji {
          font-size: 28px;
        }

        .avatar-status {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 14px;
          height: 14px;
          background: var(--green);
          border: 2px solid var(--bg-dark);
          border-radius: 50%;
        }

        .profile-info {
          text-align: center;
          margin-bottom: 16px;
        }

        .profile-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .level-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: var(--bg-glass);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 11px;
          color: var(--text-secondary);
        }

        .profile-balance {
          background: var(--bg-glass);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          padding: 12px;
          text-align: center;
        }

        .balance-label {
          font-size: 10px;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 4px;
        }

        .balance-value {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .balance-icon {
          font-size: 18px;
        }

        .balance-amount {
          font-family: 'Cinzel', serif;
          font-size: 22px;
          font-weight: 800;
          color: var(--gold);
          text-shadow: 0 0 10px var(--gold-glow);
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          overflow-y: auto;
          padding: 8px 0;
        }

        .sidebar-nav::-webkit-scrollbar {
          width: 4px;
        }

        .sidebar-nav::-webkit-scrollbar-thumb {
          background: var(--border-light);
          border-radius: 2px;
        }

        .nav-section {
          padding: 8px 16px;
        }

        .section-title {
          font-size: 10px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 2px;
          padding: 12px 16px 8px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          position: relative;
          margin: 2px 0;
          background: none;
          border: none;
          width: 100%;
          cursor: pointer;
          font-size: 14px;
          font-family: inherit;
        }

        .nav-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: var(--gold);
          border-radius: 0 3px 3px 0;
          transition: height 0.2s ease;
        }

        .nav-item:hover {
          background: rgba(255, 215, 0, 0.08);
          color: var(--text-primary);
        }

        .nav-item:hover::before {
          height: 20px;
        }

        .nav-item.active {
          background: rgba(255, 215, 0, 0.12);
          color: var(--gold);
        }

        .nav-item.active::before {
          height: 24px;
        }

        .nav-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }

        .nav-label {
          flex: 1;
          font-weight: 500;
        }

        .nav-badge {
          padding: 3px 10px;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius: var(--radius-full);
        }

        .nav-badge.hot {
          background: linear-gradient(135deg, var(--red), var(--red-dark));
          color: white;
        }

        .nav-badge.free {
          background: linear-gradient(135deg, var(--green), var(--green-dark));
          color: var(--bg-deepest);
        }

        .nav-badge.vip {
          background: var(--gradient-gold);
          color: var(--bg-deepest);
        }

        .logout-btn {
          color: var(--red);
        }

        .logout-btn:hover {
          background: rgba(255, 71, 87, 0.1);
        }

        .login-item {
          color: var(--gold);
        }

        .login-item:hover {
          background: rgba(255, 215, 0, 0.1);
        }

        /* Actions */
        .sidebar-actions {
          padding: 16px;
          border-top: 1px solid var(--border-subtle);
        }

        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          padding: 14px;
          background: var(--gradient-gold);
          color: var(--bg-deepest);
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px var(--gold-glow);
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px var(--gold-glow);
        }

        .action-icon {
          font-size: 18px;
          animation: bounce 2s ease-in-out infinite;
        }

        /* Footer */
        .sidebar-footer {
          padding: 16px;
          border-top: 1px solid var(--border-subtle);
          text-align: center;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .footer-links a {
          color: var(--text-muted);
          font-size: 12px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--gold);
        }

        .footer-links .divider {
          color: var(--border-light);
        }

        .footer-text {
          font-size: 11px;
          color: var(--text-muted);
          margin-bottom: 4px;
        }

        .footer-disclaimer {
          font-size: 10px;
          color: var(--text-muted);
          opacity: 0.7;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .sidebar {
            width: 280px;
          }

          .hamburger-btn {
            top: 12px;
            left: 12px;
            width: 48px;
            height: 48px;
          }

          .hamburger-icon {
            width: 20px;
            gap: 4px;
          }
        }
      `}</style>
    </>
  )
}
