import getDb from './db.js';

export async function initSchema() {
  const db = getDb();

  await db.batch([
    `CREATE TABLE IF NOT EXISTS categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      slug       TEXT NOT NULL UNIQUE,
      color      TEXT NOT NULL DEFAULT '#2859f1',
      icon       TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS posts (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      title        TEXT NOT NULL,
      slug         TEXT NOT NULL UNIQUE,
      content      TEXT NOT NULL DEFAULT '',
      excerpt      TEXT NOT NULL DEFAULT '',
      cover_image  TEXT NOT NULL DEFAULT '',
      category_id  INTEGER NOT NULL,
      status       TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived')),
      source_url   TEXT NOT NULL DEFAULT '',
      author       TEXT NOT NULL DEFAULT 'Redacao',
      tags         TEXT NOT NULL DEFAULT '',
      created_at   TEXT NOT NULL DEFAULT (datetime('now')),
      published_at TEXT,
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_posts_slug         ON posts(slug)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_status       ON posts(status)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_category_id  ON posts(category_id)`,
    `CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at)`,
    `CREATE TABLE IF NOT EXISTS suggestions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      excerpt     TEXT NOT NULL DEFAULT '',
      source_url  TEXT NOT NULL,
      source_name TEXT NOT NULL DEFAULT '',
      category_id INTEGER,
      status      TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      fetched_at  TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    )`,
    `CREATE INDEX IF NOT EXISTS idx_suggestions_status     ON suggestions(status)`,
    `CREATE INDEX IF NOT EXISTS idx_suggestions_fetched_at ON suggestions(fetched_at)`,
  ], 'write');

  console.log('[db] Schema initialized');
}
