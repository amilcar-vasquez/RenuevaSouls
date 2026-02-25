import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import bcrypt from 'bcrypt';
import { db } from '../src/lib/server/db';

const rl = createInterface({ input, output });

try {
  const username = (await rl.question('Admin username: ')).trim();
  const password = await rl.question('Admin password (min 8 chars): ');

  if (!username || username.length < 3) {
    throw new Error('Username must be at least 3 characters.');
  }

  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }

  const existing = db
    .prepare('SELECT id FROM admins WHERE username = ? LIMIT 1')
    .get(username) as { id: number } | undefined;

  if (existing) {
    throw new Error('That username already exists.');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(username, passwordHash);

  console.log(`Admin user "${username}" created successfully.`);
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unexpected error';
  console.error(`Failed to create admin: ${message}`);
  process.exitCode = 1;
} finally {
  rl.close();
}
