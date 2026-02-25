import { databasePath, initDatabase } from '../src/lib/server/db';

initDatabase();
console.log(`Database initialized at: ${databasePath}`);
