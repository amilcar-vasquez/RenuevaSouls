import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export type SubmissionRow = {
  id: number;
  full_name: string;
  address: string;
  phone: string | null;
  comments: string | null;
  wants_contact: number;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type AdminRow = {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
};

const databasePath = resolve(process.cwd(), process.env.DB_PATH ?? './data/renueva.db');
mkdirSync(dirname(databasePath), { recursive: true });

const db = new Database(databasePath);
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT,
      comments TEXT,
      wants_contact BOOLEAN NOT NULL DEFAULT 1,
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_submissions_created_at_desc
      ON submissions (created_at DESC);

    CREATE INDEX IF NOT EXISTS idx_submissions_wants_contact
      ON submissions (wants_contact);

    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

initDatabase();

export { db, databasePath };
