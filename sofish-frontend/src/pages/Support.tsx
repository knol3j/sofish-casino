export function Support() {
  return (
    <div className="support-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">❓</span>
          Help & Support
        </h1>

        <div className="support-grid">
          <div className="support-card card">
            <div className="support-icon">💬</div>
            <h3>Live Chat</h3>
            <p>Chat with our support team in real-time</p>
            <button className="btn btn-primary">Start Chat</button>
          </div>

          <div className="support-card card">
            <div className="support-icon">📧</div>
            <h3>Email Support</h3>
            <p>Send us an email at support@sofish.io</p>
            <button className="btn btn-secondary">Send Email</button>
          </div>

          <div className="support-card card">
            <div className="support-icon">📚</div>
            <h3>FAQ</h3>
            <p>Find answers to common questions</p>
            <button className="btn btn-secondary">View FAQ</button>
          </div>
        </div>

        <div className="faq-section card">
          <h2>Frequently Asked Questions</h2>

          <div className="faq-item">
            <div className="faq-question">How do I deposit tokens?</div>
            <div className="faq-answer">You can purchase tokens through your account page using various payment methods.</div>
          </div>

          <div className="faq-item">
            <div className="faq-question">What games are available?</div>
            <div className="faq-answer">We offer Fish Hunter games, Slots, Roulette, and Blackjack with more coming soon!</div>
          </div>

          <div className="faq-item">
            <div className="faq-question">How do I claim my daily bonus?</div>
            <div className="faq-answer">Visit the Daily Bonus page every day to claim your free tokens.</div>
          </div>
        </div>
      </div>

      <style>{`
        .support-page {
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

        .support-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }

        .support-card {
          text-align: center;
          padding: 40px 24px;
        }

        .support-icon {
          font-size: 64px;
          margin-bottom: 16px;
        }

        .support-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 12px;
        }

        .support-card p {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .faq-section h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .faq-item {
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .faq-question {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .faq-answer {
          font-size: 14px;
          color: var(--text-secondary);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .support-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
