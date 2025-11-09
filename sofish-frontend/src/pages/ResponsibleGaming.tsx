export function ResponsibleGaming() {
  return (
    <div className="responsible-gaming-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">🛡️</span>
          Responsible Gaming
        </h1>

        <div className="info-card card">
          <h2>Our Commitment</h2>
          <p>
            At Sofish Casino, we are committed to promoting responsible gaming and ensuring that our platform remains a safe and enjoyable environment for all players.
          </p>
        </div>

        <div className="tools-grid">
          <div className="tool-card card">
            <div className="tool-icon">⏰</div>
            <h3>Time Limits</h3>
            <p>Set limits on how long you can play in a single session</p>
          </div>

          <div className="tool-card card">
            <div className="tool-icon">💰</div>
            <h3>Deposit Limits</h3>
            <p>Control how much you can deposit daily, weekly, or monthly</p>
          </div>

          <div className="tool-card card">
            <div className="tool-icon">🚫</div>
            <h3>Self-Exclusion</h3>
            <p>Temporarily or permanently suspend your account</p>
          </div>

          <div className="tool-card card">
            <div className="tool-icon">📊</div>
            <h3>Reality Checks</h3>
            <p>Get periodic reminders about your playing time and spending</p>
          </div>
        </div>

        <div className="resources-card card">
          <h2>Need Help?</h2>
          <p className="mb-3">If you or someone you know has a gambling problem, help is available:</p>

          <div className="resource-links">
            <a href="#" className="resource-link">National Gambling Helpline: 1-800-522-4700</a>
            <a href="#" className="resource-link">GamblersAnonymous.org</a>
            <a href="#" className="resource-link">NCPG.org</a>
          </div>
        </div>
      </div>

      <style>{`
        .responsible-gaming-page {
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

        .info-card {
          margin-bottom: 40px;
        }

        .info-card h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .info-card p {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.8;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .tool-card {
          text-align: center;
          padding: 32px 24px;
        }

        .tool-icon {
          font-size: 56px;
          margin-bottom: 16px;
        }

        .tool-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .tool-card p {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .resources-card h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 16px;
          color: var(--text-primary);
        }

        .resource-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .resource-link {
          padding: 16px;
          background: rgba(0, 214, 107, 0.1);
          border: 1px solid var(--primary);
          border-radius: 8px;
          color: var(--primary);
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .resource-link:hover {
          background: rgba(0, 214, 107, 0.2);
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .tools-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
