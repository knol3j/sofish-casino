// Create admin account with proper password hashing
const crypto = require('crypto');

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);

  return new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, derivedKey) => {
      if (err) reject(err);

      const hashHex = derivedKey.toString('hex');
      const saltHex = salt.toString('hex');

      resolve(`${saltHex}:${hashHex}`);
    });
  });
}

async function main() {
  const password = 'Admin123!';
  const hash = await hashPassword(password);

  console.log('\n=== Admin Account SQL ===\n');
  console.log(`INSERT INTO users (id, email, username, password_hash, token_balance, created_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@sofish.io',
  'admin',
  '${hash}',
  100000,
  ${Date.now()}
);`);

  console.log('\n=== Login Credentials ===');
  console.log('Email: admin@sofish.io');
  console.log('Password: Admin123!');
  console.log('Starting Balance: 100,000 tokens');
}

main().catch(console.error);
