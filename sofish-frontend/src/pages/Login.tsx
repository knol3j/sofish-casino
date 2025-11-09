import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin, useRegister } from '../hooks/useAuth'

export function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

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
      navigate('/fishing')
    } catch (error) {
      console.error('Auth error:', error)
    }
  }

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="login-card card">
            <h1 className="login-title">
              {isRegistering ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="login-subtitle">
              {isRegistering
                ? 'Sign up to start playing and winning'
                : 'Log in to continue your gaming session'}
            </p>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {isRegistering && (
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="input"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={loginMutation.isPending || registerMutation.isPending}
              >
                {loginMutation.isPending || registerMutation.isPending
                  ? 'Processing...'
                  : isRegistering
                  ? 'Create Account'
                  : 'Log In'}
              </button>

              {(loginMutation.error || registerMutation.error) && (
                <div className="error-message">
                  {loginMutation.error?.message || registerMutation.error?.message}
                </div>
              )}
            </form>

            <div className="login-footer">
              <button
                onClick={() => setIsRegistering(!isRegistering)}
                className="link-button"
              >
                {isRegistering
                  ? 'Already have an account? Log in'
                  : "Don't have an account? Sign up"}
              </button>
            </div>

            {isRegistering && (
              <div className="signup-bonus">
                <div className="bonus-icon">🎁</div>
                <div className="bonus-text">
                  <strong>New Player Bonus</strong>
                  <span>Get 1,000 free tokens to start playing</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 40px 0;
        }

        .login-container {
          max-width: 450px;
          margin: 0 auto;
        }

        .login-card {
          padding: 40px;
        }

        .login-title {
          font-size: 28px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .login-subtitle {
          text-align: center;
          color: var(--text-secondary);
          margin-bottom: 32px;
          font-size: 14px;
        }

        .login-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-primary);
        }

        .btn-full {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          margin-top: 8px;
        }

        .error-message {
          margin-top: 16px;
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid var(--red);
          border-radius: 8px;
          color: var(--red);
          text-align: center;
          font-size: 13px;
        }

        .login-footer {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid var(--border-subtle);
        }

        .link-button {
          background: none;
          border: none;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0;
        }

        .link-button:hover {
          color: var(--text-primary);
        }

        .signup-bonus {
          margin-top: 24px;
          padding: 16px;
          background: rgba(0, 214, 107, 0.05);
          border: 1px solid rgba(0, 214, 107, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .bonus-icon {
          font-size: 32px;
        }

        .bonus-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .bonus-text strong {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .bonus-text span {
          font-size: 12px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .login-card {
            padding: 24px;
          }

          .login-title {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  )
}
