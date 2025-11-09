import { useState } from 'react'

export function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)

  return (
    <div className="settings-page">
      <div className="container">
        <h1 className="page-title">
          <span className="title-icon">⚙️</span>
          Settings
        </h1>

        {/* Sound & Audio */}
        <div className="settings-card card">
          <h2 className="card-title">🔊 Sound & Audio</h2>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Sound Effects</div>
              <div className="setting-desc">Game sounds and UI feedback</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={soundEnabled} onChange={(e) => setSoundEnabled(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Background Music</div>
              <div className="setting-desc">Ambient music while playing</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={musicEnabled} onChange={(e) => setMusicEnabled(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Volume</div>
              <div className="setting-desc">Master volume control</div>
            </div>
            <input type="range" className="volume-slider" min="0" max="100" defaultValue="75" />
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-card card">
          <h2 className="card-title">🔔 Notifications</h2>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Push Notifications</div>
              <div className="setting-desc">Receive updates about promotions and wins</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Email Notifications</div>
              <div className="setting-desc">Get emails about bonuses and updates</div>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={emailNotifications} onChange={(e) => setEmailNotifications(e.target.checked)} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Display */}
        <div className="settings-card card">
          <h2 className="card-title">🎨 Display</h2>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Theme</div>
              <div className="setting-desc">Choose your preferred color theme</div>
            </div>
            <select className="setting-select">
              <option>Dark Theme</option>
              <option>Light Theme</option>
              <option>Auto</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Animation Quality</div>
              <div className="setting-desc">Adjust animation performance</div>
            </div>
            <select className="setting-select">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* Responsible Gaming */}
        <div className="settings-card card">
          <h2 className="card-title">🛡️ Responsible Gaming</h2>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Daily Deposit Limit</div>
              <div className="setting-desc">Set a maximum daily deposit amount</div>
            </div>
            <input type="number" className="setting-input" placeholder="No limit" />
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Loss Limit</div>
              <div className="setting-desc">Set a maximum daily loss limit</div>
            </div>
            <input type="number" className="setting-input" placeholder="No limit" />
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Session Time Limit</div>
              <div className="setting-desc">Get reminded after playing for a certain time</div>
            </div>
            <select className="setting-select">
              <option>No reminder</option>
              <option>1 hour</option>
              <option>2 hours</option>
              <option>4 hours</option>
            </select>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Self-Exclusion</div>
              <div className="setting-desc">Temporarily suspend your account</div>
            </div>
            <button className="btn btn-danger btn-sm">Manage</button>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="settings-card card">
          <h2 className="card-title">🔒 Privacy & Security</h2>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Two-Factor Authentication</div>
              <div className="setting-desc">Add extra security to your account</div>
            </div>
            <button className="btn btn-secondary btn-sm">Enable 2FA</button>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <div className="setting-name">Login History</div>
              <div className="setting-desc">View all account login activity</div>
            </div>
            <button className="btn btn-secondary btn-sm">View History</button>
          </div>
        </div>
      </div>

      <style>{`
        .settings-page {
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

        .settings-card {
          margin-bottom: 32px;
        }

        .card-title {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 24px;
          color: var(--text-primary);
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          margin-bottom: 12px;
          border: 1px solid var(--border-subtle);
        }

        .setting-item:hover {
          border-color: var(--primary);
        }

        .setting-info {
          flex: 1;
        }

        .setting-name {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .setting-desc {
          font-size: 13px;
          color: var(--text-muted);
        }

        .toggle {
          position: relative;
          width: 60px;
          height: 30px;
          cursor: pointer;
        }

        .toggle input {
          display: none;
        }

        .toggle-slider {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: var(--dark-bg);
          border: 2px solid var(--border-subtle);
          border-radius: 30px;
          transition: all 0.3s ease;
        }

        .toggle-slider:before {
          content: '';
          position: absolute;
          height: 22px;
          width: 22px;
          left: 2px;
          bottom: 2px;
          background: var(--text-muted);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .toggle input:checked + .toggle-slider {
          background: var(--primary);
          border-color: var(--primary);
        }

        .toggle input:checked + .toggle-slider:before {
          transform: translateX(30px);
          background: #000;
        }

        .volume-slider {
          width: 200px;
          height: 6px;
          background: var(--dark-bg);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: var(--primary);
          border-radius: 50%;
          cursor: pointer;
        }

        .setting-select {
          padding: 8px 16px;
          background: var(--dark-bg);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          min-width: 150px;
          cursor: pointer;
        }

        .setting-select:hover {
          border-color: var(--primary);
        }

        .setting-input {
          padding: 8px 16px;
          background: var(--dark-bg);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 14px;
          min-width: 150px;
        }

        .setting-input:focus {
          outline: none;
          border-color: var(--primary);
        }

        @media (max-width: 768px) {
          .page-title {
            font-size: 32px;
          }

          .setting-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .volume-slider, .setting-select, .setting-input {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}
