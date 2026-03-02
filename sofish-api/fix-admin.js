const crypto = require('crypto');
const { execSync } = require('child_process');

async function hashPassword(password) {
    const salt = crypto.randomBytes(16);
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, salt, 310000, 32, 'sha256', (err, derivedKey) => {
            if (err) reject(err);
            resolve(`${salt.toString('hex')}:${derivedKey.toString('hex')}`);
        });
    });
}

async function main() {
    const hash = await hashPassword('Admin123!');
    console.log("Generated hash. Executing commands...");

    try {
        console.log("Deleting old admin...");
        execSync(`npx wrangler d1 execute sofish-db --local --command="DELETE FROM users WHERE email='admin@sofish.io';"`, { encoding: 'utf8', stdio: 'inherit' });

        console.log("Inserting new admin...");
        const insertCmd = `npx wrangler d1 execute sofish-db --local --command="INSERT INTO users (id, email, username, password_hash, token_balance, created_at) VALUES ('00000000-0000-0000-0000-000000000001', 'admin@sofish.io', 'admin', '${hash}', 100000, ${Date.now()});"`;
        execSync(insertCmd, { encoding: 'utf8', stdio: 'inherit' });

        console.log("Successfully created admin account!");
    } catch (e) {
        console.error("Failed executing command");
    }
}

main();
