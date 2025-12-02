import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar'
import { WebGLBackground } from './components/WebGLBackground'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { SlotsGame } from './pages/SlotsGame'
import { SlotsHub } from './pages/SlotsHub'
import { FishingGame } from './pages/FishingGame'
import { FishingHub } from './pages/FishingHub'
import { RouletteGame } from './pages/RouletteGame'
import { BlackjackGame } from './pages/BlackjackGame'
import { Account } from './pages/Account'
import { Transactions } from './pages/Transactions'
import { GameHistory } from './pages/GameHistory'
import { Leaderboard } from './pages/Leaderboard'
import { VIP } from './pages/VIP'
import { Promotions } from './pages/Promotions'
import { DailyBonus } from './pages/DailyBonus'
import { Settings } from './pages/Settings'
import { GamesHub } from './pages/GamesHub'
import { Support } from './pages/Support'
import { ResponsibleGaming } from './pages/ResponsibleGaming'
import { EndorphinaSatoshisSecret } from './pages/providers/EndorphinaSatoshisSecret'
import { logout } from './hooks/useAuth'
import { useUserBalance } from './hooks/useGames'

const queryClient = new QueryClient()

function NavBar() {
  const location = useLocation()
  const isAuthenticated = !!localStorage.getItem('auth_token')
  const { data: balanceData } = useUserBalance()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  // Don't show navbar on login page
  if (location.pathname === '/login') return null

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          {/* Logo */}
          <Link to="/" className="logo">
            <span className="logo-icon">🐟</span>
            <span className="logo-text">SOFISH</span>
          </Link>

          {/* Navigation Links */}
          <div className="nav-links">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </Link>
            <Link to="/games" className={`nav-link ${isActive('/games') ? 'active' : ''}`}>
              <span className="nav-icon">🎮</span>
              <span>Games</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/daily-bonus" className={`nav-link ${isActive('/daily-bonus') ? 'active' : ''}`}>
                  <span className="nav-icon">🎁</span>
                  <span>Bonus</span>
                  <span className="nav-badge-dot" />
                </Link>
                <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}>
                  <span className="nav-icon">🏆</span>
                  <span>Ranks</span>
                </Link>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="nav-actions">
            {isAuthenticated ? (
              <>
                {/* Balance Display */}
                <div className="balance-pill">
                  <span className="balance-icon">💰</span>
                  <span className="balance-value">{balanceData?.balance?.toLocaleString() || '0'}</span>
                </div>

                {/* Profile Menu */}
                <div className="profile-menu">
                  <Link to="/account" className="profile-btn">
                    <span className="profile-avatar">👤</span>
                  </Link>
                </div>

                <button onClick={logout} className="btn btn-ghost btn-sm logout-btn">
                  <span>🚪</span>
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="btn btn-primary btn-sm">
                  <span>🎰</span>
                  <span>Play Now</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  const location = useLocation()

  // Don't show footer on login page
  if (location.pathname === '/login') return null

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="logo footer-logo">
              <span className="logo-icon">🐟</span>
              <span className="logo-text">SOFISH</span>
            </Link>
            <p className="footer-desc">
              Experience the thrill of Las Vegas from anywhere. Premium games,
              instant payouts, and exclusive rewards await you.
            </p>
            <div className="footer-social">
              <a href="#twitter" className="social-link">𝕏</a>
              <a href="#discord" className="social-link">🎮</a>
              <a href="#telegram" className="social-link">✈️</a>
            </div>
          </div>

          {/* Games Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Games</h4>
            <ul className="footer-links">
              <li><Link to="/fishing-hub">Fish Hunter</Link></li>
              <li><Link to="/slots-hub">Slot Machines</Link></li>
              <li><Link to="/roulette">Roulette</Link></li>
              <li><Link to="/blackjack">Blackjack</Link></li>
            </ul>
          </div>

          {/* Account Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Account</h4>
            <ul className="footer-links">
              <li><Link to="/account">My Profile</Link></li>
              <li><Link to="/daily-bonus">Daily Bonus</Link></li>
              <li><Link to="/vip">VIP Club</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <ul className="footer-links">
              <li><Link to="/support">Help Center</Link></li>
              <li><Link to="/responsible-gaming">Responsible Gaming</Link></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 Sofish Casino. All rights reserved.
          </p>

          <div className="footer-badges">
            <div className="footer-badge">
              <span>🔒</span>
              <span>Secure</span>
            </div>
            <div className="footer-badge">
              <span>⚡</span>
              <span>Instant Play</span>
            </div>
            <div className="footer-badge age-badge">
              <span>18+</span>
            </div>
          </div>

          <p className="footer-disclaimer">
            This is a virtual casino for entertainment purposes only. No real money gambling.
            Please play responsibly.
          </p>
        </div>
      </div>
    </footer>
  )
}

function AppContent() {
  return (
    <div className="app">
      {/* WebGL Particle Background */}
      <WebGLBackground
        particleCount={200}
        colors={[
          [1.0, 0.843, 0],     // Gold
          [1.0, 0.647, 0],     // Orange
          [0.545, 0.361, 0.96], // Purple
          [0, 0.831, 0.667],   // Cyan
          [1.0, 0.412, 0.706]  // Pink
        ]}
        speed={0.8}
        interactive={true}
      />

      {/* Sidebar */}
      <Sidebar />

      {/* Navigation */}
      <NavBar />

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Games */}
          <Route path="/games" element={<GamesHub />} />
          <Route path="/fishing-hub" element={<FishingHub />} />
          <Route path="/fishing/:mode?" element={<FishingGame />} />
          <Route path="/slots-hub" element={<SlotsHub />} />
          <Route path="/slots/:theme?" element={<SlotsGame />} />

          {/* Provider Games */}
          <Route path="/slots/endorphina/satoshis-secret" element={<EndorphinaSatoshisSecret />} />

          <Route path="/roulette" element={<RouletteGame />} />
          <Route path="/blackjack" element={<BlackjackGame />} />

          {/* Account */}
          <Route path="/account" element={<Account />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/history" element={<GameHistory />} />
          <Route path="/leaderboard" element={<Leaderboard />} />

          {/* Rewards */}
          <Route path="/vip" element={<VIP />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/daily-bonus" element={<DailyBonus />} />

          {/* Settings & Support */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/support" element={<Support />} />
          <Route path="/responsible-gaming" element={<ResponsibleGaming />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      <style>{`
        /* Professional Navbar */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(3, 7, 18, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 215, 0, 0.1);
          padding: 12px 0;
        }

        .navbar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 32px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }

        .logo:hover {
          transform: scale(1.02);
        }

        .logo-icon {
          font-size: 28px;
          filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4));
        }

        .logo-text {
          font-family: 'Cinzel', serif;
          font-size: 22px;
          font-weight: 800;
          background: linear-gradient(135deg, #FFE55C 0%, #FFD700 50%, #CC9900 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 3px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: var(--radius-md);
          transition: all 0.2s ease;
          position: relative;
        }

        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-link.active {
          color: var(--gold);
          background: rgba(255, 215, 0, 0.1);
        }

        .nav-link.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 16px;
          right: 16px;
          height: 2px;
          background: var(--gold);
          border-radius: 2px;
        }

        .nav-icon {
          font-size: 16px;
        }

        .nav-badge-dot {
          width: 6px;
          height: 6px;
          background: var(--red);
          border-radius: 50%;
          position: absolute;
          top: 8px;
          right: 8px;
          animation: pulse 2s ease-in-out infinite;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .balance-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 215, 0, 0.1);
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: var(--radius-full);
        }

        .balance-icon {
          font-size: 16px;
        }

        .balance-value {
          font-family: 'Cinzel', serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--gold);
        }

        .profile-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: 50%;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .profile-btn:hover {
          border-color: var(--gold);
          transform: scale(1.05);
        }

        .profile-avatar {
          font-size: 20px;
        }

        .logout-btn {
          padding: 8px 12px;
        }

        /* Professional Footer */
        .footer {
          background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg-deepest) 100%);
          border-top: 1px solid var(--border-subtle);
          padding: 80px 0 40px;
          margin-top: 80px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          margin-bottom: 48px;
        }

        .footer-brand {
          max-width: 320px;
        }

        .footer-logo {
          margin-bottom: 20px;
        }

        .footer-desc {
          font-size: 14px;
          color: var(--text-muted);
          line-height: 1.7;
          margin-bottom: 24px;
        }

        .footer-social {
          display: flex;
          gap: 12px;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background: var(--bg-card-hover);
          border-color: var(--gold);
          color: var(--gold);
        }

        .footer-column {

        }

        .footer-heading {
          font-family: 'Cinzel', serif;
          font-size: 13px;
          font-weight: 700;
          color: var(--gold);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 20px;
        }

        .footer-links {
          list-style: none;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: var(--text-secondary);
          text-decoration: none;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .footer-links a:hover {
          color: var(--gold);
          padding-left: 4px;
        }

        .footer-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border-subtle), transparent);
          margin-bottom: 32px;
        }

        .footer-bottom {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
        }

        .footer-copyright {
          font-size: 13px;
          color: var(--text-muted);
        }

        .footer-badges {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .footer-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: var(--bg-glass);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 12px;
          color: var(--text-secondary);
        }

        .footer-badge.age-badge {
          background: rgba(255, 71, 87, 0.1);
          border-color: rgba(255, 71, 87, 0.3);
          color: var(--red);
          font-weight: 700;
        }

        .footer-disclaimer {
          width: 100%;
          font-size: 12px;
          color: var(--text-muted);
          text-align: center;
          margin-top: 16px;
          opacity: 0.7;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 40px;
          }

          .footer-brand {
            grid-column: span 2;
            max-width: none;
            text-align: center;
          }

          .footer-social {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .navbar-content {
            gap: 16px;
          }

          .nav-links {
            display: none;
          }

          .logo-text {
            font-size: 18px;
          }

          .balance-pill {
            padding: 6px 12px;
          }

          .balance-value {
            font-size: 14px;
          }

          .footer {
            padding: 60px 0 32px;
            margin-top: 60px;
          }

          .footer-content {
            grid-template-columns: 1fr;
            gap: 32px;
            text-align: center;
          }

          .footer-brand {
            grid-column: span 1;
          }

          .footer-links {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 12px 24px;
          }

          .footer-links li {
            margin-bottom: 0;
          }

          .footer-bottom {
            flex-direction: column;
            text-align: center;
          }

          .footer-badges {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
