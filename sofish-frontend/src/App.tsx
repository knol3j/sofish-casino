import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Sidebar } from './components/Sidebar'
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

const queryClient = new QueryClient()

function App() {
  const isAuthenticated = !!localStorage.getItem('auth_token')

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="app">
          {/* Sidebar */}
          <Sidebar />

          {/* Navigation */}
          <nav className="navbar">
            <div className="container">
              <div className="navbar-content">
                <Link to="/" className="logo">
                  <span className="logo-icon">🐟</span>
                  <span className="logo-text gold-text">SOFISH</span>
                </Link>

                <div className="nav-links">
                  <Link to="/" className="nav-link">
                    🏠 Home
                  </Link>
                  {isAuthenticated && (
                    <>
                      <Link to="/fishing-hub" className="nav-link">
                        🎣 Fish Hunter
                      </Link>
                      <Link to="/slots-hub" className="nav-link">
                        🎰 Slots
                      </Link>
                      <Link to="/roulette" className="nav-link">
                        🎲 Roulette
                      </Link>
                      <Link to="/blackjack" className="nav-link">
                        🃏 Blackjack
                      </Link>
                    </>
                  )}
                </div>

                <div className="nav-actions">
                  {isAuthenticated ? (
                    <button onClick={logout} className="btn btn-danger btn-sm">
                      🚪 Logout
                    </button>
                  ) : (
                    <Link to="/login">
                      <button className="btn btn-primary btn-sm">
                        🎮 Login / Register
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </nav>

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
          <footer className="footer">
            <div className="container">
              <div className="footer-content">
                <div className="footer-section">
                  <h3 className="footer-title gold-text">🐟 SOFISH CASINO</h3>
                  <p className="footer-desc">
                    The ultimate social gambling experience. Play responsibly.
                  </p>
                </div>

                <div className="footer-section">
                  <h4 className="footer-heading">Quick Links</h4>
                  <ul className="footer-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/fishing">Fish Hunter</Link></li>
                    <li><Link to="/slots">Slots</Link></li>
                    <li><Link to="/roulette">Roulette</Link></li>
                    <li><Link to="/blackjack">Blackjack</Link></li>
                    <li><Link to="/login">Login</Link></li>
                  </ul>
                </div>

                <div className="footer-section">
                  <h4 className="footer-heading">Legal</h4>
                  <ul className="footer-links">
                    <li><a href="#terms">Terms of Service</a></li>
                    <li><a href="#privacy">Privacy Policy</a></li>
                    <li><a href="#responsible">Responsible Gaming</a></li>
                  </ul>
                </div>

                <div className="footer-section">
                  <h4 className="footer-heading">Support</h4>
                  <ul className="footer-links">
                    <li><a href="#help">Help Center</a></li>
                    <li><a href="#contact">Contact Us</a></li>
                    <li><a href="#faq">FAQ</a></li>
                  </ul>
                </div>
              </div>

              <div className="footer-bottom">
                <p>&copy; 2025 Sofish Casino. All rights reserved.</p>
                <p className="disclaimer">
                  This is a virtual casino for entertainment purposes only. No real money gambling.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
