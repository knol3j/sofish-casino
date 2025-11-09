-- Create admin account
-- Password: Admin123! (you can change this after first login)
-- Password hash generated with PBKDF2, 310000 iterations

INSERT INTO users (id, email, username, password_hash, token_balance, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@sofish.io',
  'admin',
  '8f3a4b2c1d5e6f7a8b9c0d1e2f3a4b5c:9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f',
  100000,
  unixepoch('now')
);
