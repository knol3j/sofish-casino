-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  token_balance INTEGER DEFAULT 1000,
  created_at INTEGER NOT NULL,
  last_login INTEGER,
  daily_bonus_claimed INTEGER
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Game history
CREATE TABLE IF NOT EXISTS game_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  bet INTEGER NOT NULL,
  win INTEGER NOT NULL,
  result TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_game_history_user ON game_history(user_id, created_at DESC);
CREATE INDEX idx_game_history_created ON game_history(created_at DESC);

-- Daily bonuses tracking
CREATE TABLE IF NOT EXISTS daily_bonuses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  bonus_amount INTEGER NOT NULL,
  claimed_at INTEGER DEFAULT (unixepoch()),
  streak_days INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_daily_bonuses_user ON daily_bonuses(user_id, claimed_at DESC);

-- Ad rewards tracking
CREATE TABLE IF NOT EXISTS ad_rewards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  reward_amount INTEGER NOT NULL,
  ad_type TEXT NOT NULL,
  viewed_at INTEGER DEFAULT (unixepoch()),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_ad_rewards_user ON ad_rewards(user_id, viewed_at DESC);
