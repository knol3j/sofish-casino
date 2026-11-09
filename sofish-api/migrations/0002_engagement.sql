-- 0002_engagement.sql — presence + spin idempotency + pending-win collect
-- Safe to run on the existing 0001 schema (all IF NOT EXISTS / additive).

-- Theme recorded per spin so presence can be computed per game
ALTER TABLE game_history ADD COLUMN theme TEXT;

-- Idempotent spin ledger: one row per (user, game_type, counter).
-- A duplicate counter replays the stored response instead of double-charging.
CREATE TABLE IF NOT EXISTS spin_idempotency (
  user_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  counter INTEGER NOT NULL,
  response_json TEXT NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  PRIMARY KEY (user_id, game_type, counter)
);

-- Two-phase collect: wins from protocol-mode spins sit here until collected
-- (auto-swept on the player's next spin so a win is never lost).
CREATE TABLE IF NOT EXISTS pending_wins (
  user_id TEXT NOT NULL,
  game_type TEXT NOT NULL,
  counter INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  collected INTEGER DEFAULT 0,
  created_at INTEGER DEFAULT (unixepoch()),
  PRIMARY KEY (user_id, game_type, counter)
);

CREATE INDEX IF NOT EXISTS idx_pending_wins_user ON pending_wins(user_id, collected);
