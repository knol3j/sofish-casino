DELETE FROM users WHERE email='admin@sofish.io';
INSERT INTO users (id, email, username, password_hash, token_balance, created_at)
  VALUES ('00000000-0000-0000-0000-000000000001', 'admin@sofish.io', 'admin', 'a6098b26f60b1eb074a2b9648aee14e0:1038bc3b3dec3eb75747bffa0279acd9125045a88bf85e6466ea8826c72e8637', 100000, 1772476836101);