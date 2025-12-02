import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLogin, useRegister } from '../hooks/useAuth'

export function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()
  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isRegistering) {
        await registerMutation.mutateAsync({ email, username, password })
      } else {
        await loginMutation.mutateAsync({ email, password })
      }
      navigate('/games')
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  return (
    <div className="login-page">
      {/* Background Effects */}
      <div className="bg-effects">
        <div className="bg-gradient" />
        <div className="bg-pattern" />
        <div className="floating-cards">
          {['🎰', '🃏', '🎲', '💎', '🏆', '💰'].map((icon, i) => (
            <div
              key={i}
              className="floating-card"
              style={{
                left: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${15 + i * 2}s`
              }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="login-grid">
          {/* Left Side - Branding */}
          <div className="login-branding">
            <Link to="/" className="brand-logo">
              <span className="logo-icon">🐟</span>
              <span className="logo-text">SOFISH</span>
            </Link>

            <h1 className="brand-title">
              The Ultimate <br />
              <span className="text-gradient-gold">Casino Experience</span>
            </h1>

            <p className="brand-subtitle">
              Premium games, instant wins, and exclusive rewards await you.
              Join thousands of players winning big every day.
            </p>

            <div className="brand-features">
              <div className="feature">
                <span className="feature-icon">🎰</span>
                <div className="feature-text">
                  <strong>100+ Games</strong>
                  <span>Slots, Roulette, Blackjack & more</span>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">⚡</span>
                <div className="feature-text">
                  <strong>Instant Payouts</strong>
                  <span>Win and withdraw instantly</span>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🎁</span>
                <div className="feature-text">
                  <strong>Daily Bonuses</strong>
                  <span>Free tokens every day</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Form */}
          <div className="login-form-wrapper">
            <div className="login-card">
              {/* Header Tabs */}
              <div className="auth-tabs">
                <button
                  className={`auth-tab ${!isRegistering ? 'active' : ''}`}
                  onClick={() => setIsRegistering(false)}
                >
                  Sign In
                </button>
                <button
                  className={`auth-tab ${isRegistering ? 'active' : ''}`}
                  onClick={() => setIsRegistering(true)}
                >
                  Create Account
                </button>
              </div>

              {/* Welcome Message */}
              <div className="form-header">
                <h2 className="form-title">
                  {isRegistering ? 'Create Your Account' : 'Welcome Back'}
                </h2>
                <p className="form-subtitle">
                  {isRegistering
                    ? 'Join the action and start winning today'
                    : 'Sign in to continue your winning streak'}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">📧</span>
                    Email Address
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {isRegistering && (
                  <div className="form-group animate-fadeIn">
                    <label className="form-label">
                      <span className="label-icon">👤</span>
                      Username
                    </label>
                    <div className="input-wrapper">
                      <input
                        type="text"
                        className="input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Choose a username"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-icon">🔒</span>
                    Password
                  </label>
                  <div className="input-wrapper password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {(loginMutation.error || registerMutation.error) && (
                  <div className="error-message animate-fadeIn">
                    <span className="error-icon">⚠️</span>
                    <span>{loginMutation.error?.message || registerMutation.error?.message}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-full submit-btn"
                  disabled={loginMutation.isPending || registerMutation.isPending}
                >
                  {loginMutation.isPending || registerMutation.isPending ? (
                    <>
                      <div className="btn-spinner" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>{isRegistering ? '🚀' : '🎰'}</span>
                      <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="form-divider">
                <span>or</span>
              </div>

              {/* Social Login Placeholder */}
              <div className="social-login">
                <button className="social-btn google" type="button">
                  <span>G</span>
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Signup Bonus Banner */}
              {isRegistering && (
                <div className="bonus-banner animate-fadeInUp">
                  <div className="bonus-glow" />
                  <div className="bonus-content">
                    <div className="bonus-icon">🎁</div>
                    <div className="bonus-info">
                      <div className="bonus-title">Welcome Bonus</div>
                      <div className="bonus-value">
                        <span className="bonus-amount">1,000</span>
                        <span className="bonus-label">FREE TOKENS</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Links */}
            <div className="login-footer">
              <p className="footer-text">
                By continuing, you agree to our{' '}
                <a href="#terms">Terms of Service</a> and{' '}
                <a href="#privacy">Privacy Policy</a>
              </p>
              <div className="age-restriction">
                <span className="age-badge">18+</span>
                <span>Please gamble responsibly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 60px 0;
          position: relative;
          overflow: hidden;
        }

        /* Background Effects */
        .bg-effects {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
          pointer-events: none;
        }

        .bg-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background:
            radial-gradient(ellipse at 20% 20%, rgba(255, 215, 0, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(0, 212, 170, 0.05) 0%, transparent 70%);
        }

        .bg-pattern {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image:
            linear-gradient(rgba(255, 215, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .floating-cards {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        .floating-card {
          position: absolute;
          font-size: 48px;
          opacity: 0.1;
          animation: float-card linear infinite;
        }

        @keyframes float-card {
          0% {
            transform: translateY(100vh) rotate(0deg);
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
          }
        }

        /* Grid Layout */
        .login-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* Branding Side */
        .login-branding {
          padding-right: 40px;
        }

        .brand-logo {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          margin-bottom: 48px;
        }

        .logo-icon {
          font-size: 48px;
          filter: drop-shadow(0 0 20px var(--gold-glow));
        }

        .logo-text {
          font-family: 'Cinzel', serif;
          font-size: 36px;
          font-weight: 900;
          background: var(--gradient-gold-shine);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: 4px;
        }

        .brand-title {
          font-family: 'Cinzel', serif;
          font-size: 48px;
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: 24px;
        }

        .brand-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 48px;
          max-width: 450px;
        }

        .brand-features {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .feature {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: var(--bg-glass);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          transition: all 0.3s ease;
        }

        .feature:hover {
          border-color: var(--border-gold);
          transform: translateX(8px);
        }

        .feature-icon {
          font-size: 32px;
        }

        .feature-text {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .feature-text strong {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .feature-text span {
          font-size: 13px;
          color: var(--text-muted);
        }

        /* Form Side */
        .login-form-wrapper {
          max-width: 480px;
        }

        .login-card {
          background: var(--bg-glass);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-xl);
          padding: 40px;
          box-shadow: var(--shadow-xl);
        }

        /* Auth Tabs */
        .auth-tabs {
          display: flex;
          background: var(--bg-dark);
          border-radius: var(--radius-md);
          padding: 4px;
          margin-bottom: 32px;
        }

        .auth-tab {
          flex: 1;
          padding: 12px;
          background: transparent;
          border: none;
          border-radius: var(--radius-sm);
          color: var(--text-secondary);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .auth-tab.active {
          background: var(--gradient-gold);
          color: var(--bg-deepest);
        }

        .auth-tab:hover:not(.active) {
          color: var(--text-primary);
        }

        /* Form Header */
        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .form-title {
          font-family: 'Cinzel', serif;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .form-subtitle {
          font-size: 14px;
          color: var(--text-secondary);
        }

        /* Form */
        .auth-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .label-icon {
          font-size: 14px;
        }

        .input-wrapper {
          position: relative;
        }

        .password-wrapper .input {
          padding-right: 50px;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          opacity: 0.6;
          transition: opacity 0.2s ease;
        }

        .password-toggle:hover {
          opacity: 1;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(255, 71, 87, 0.1);
          border: 1px solid var(--red);
          border-radius: var(--radius-md);
          color: var(--red);
          font-size: 13px;
          margin-bottom: 20px;
        }

        .error-icon {
          font-size: 16px;
        }

        .submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .btn-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          border-top-color: var(--bg-deepest);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        /* Divider */
        .form-divider {
          position: relative;
          text-align: center;
          margin: 24px 0;
        }

        .form-divider::before,
        .form-divider::after {
          content: '';
          position: absolute;
          top: 50%;
          width: calc(50% - 30px);
          height: 1px;
          background: var(--border-subtle);
        }

        .form-divider::before {
          left: 0;
        }

        .form-divider::after {
          right: 0;
        }

        .form-divider span {
          background: transparent;
          padding: 0 12px;
          color: var(--text-muted);
          font-size: 13px;
        }

        /* Social Login */
        .social-login {
          margin-bottom: 24px;
        }

        .social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 14px;
          background: var(--bg-card);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .social-btn:hover {
          background: var(--bg-card-hover);
          border-color: var(--border-medium);
        }

        .social-btn.google span:first-child {
          font-weight: 700;
          font-size: 18px;
        }

        /* Bonus Banner */
        .bonus-banner {
          position: relative;
          padding: 20px;
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(255, 165, 0, 0.05));
          border: 2px solid var(--border-gold);
          border-radius: var(--radius-lg);
          overflow: hidden;
        }

        .bonus-glow {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent, rgba(255, 215, 0, 0.1), transparent);
          animation: spin 10s linear infinite;
        }

        .bonus-content {
          position: relative;
          display: flex;
          align-items: center;
          gap: 16px;
          z-index: 1;
        }

        .bonus-icon {
          font-size: 40px;
          animation: bounce 2s ease-in-out infinite;
        }

        .bonus-info {
          flex: 1;
        }

        .bonus-title {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }

        .bonus-value {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .bonus-amount {
          font-family: 'Cinzel', serif;
          font-size: 28px;
          font-weight: 900;
          color: var(--gold);
          text-shadow: 0 0 20px var(--gold-glow);
        }

        .bonus-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 1px;
        }

        /* Footer */
        .login-footer {
          margin-top: 24px;
          text-align: center;
        }

        .footer-text {
          font-size: 12px;
          color: var(--text-muted);
          margin-bottom: 16px;
        }

        .footer-text a {
          color: var(--gold);
          text-decoration: none;
        }

        .footer-text a:hover {
          text-decoration: underline;
        }

        .age-restriction {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--bg-glass);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-full);
          font-size: 12px;
          color: var(--text-muted);
        }

        .age-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          background: var(--red);
          color: white;
          font-size: 10px;
          font-weight: 800;
          border-radius: 50%;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .login-grid {
            grid-template-columns: 1fr;
            gap: 60px;
            max-width: 500px;
          }

          .login-branding {
            padding-right: 0;
            text-align: center;
          }

          .brand-logo {
            justify-content: center;
          }

          .brand-title {
            font-size: 36px;
          }

          .brand-subtitle {
            margin: 0 auto 40px;
          }

          .brand-features {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .login-page {
            padding: 40px 0;
          }

          .brand-title {
            font-size: 28px;
          }

          .login-card {
            padding: 24px;
          }

          .form-title {
            font-size: 20px;
          }

          .bonus-amount {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}
