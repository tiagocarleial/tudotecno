import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database.sqlite');

function createDb() {
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  return db;
}

let db;

function getDb() {
  if (process.env.NODE_ENV !== 'production') {
    if (!global.__db) {
      global.__db = createDb();
    }
    db = global.__db;
  } else {
    if (!db) {
      db = createDb();
    }
  }
  return db;
}

export default getDb;
