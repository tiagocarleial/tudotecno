import getDb from './db.js';

export function getSuggestions({ page = 1, limit = 20, status = 'pending' } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;

  const rows = db.prepare(`
    SELECT s.*, c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM suggestions s
    LEFT JOIN categories c ON c.id = s.category_id
    WHERE s.status = ?
    ORDER BY s.fetched_at DESC
    LIMIT ? OFFSET ?
  `).all(status, limit, offset);

  const { total } = db.prepare(
    'SELECT COUNT(*) as total FROM suggestions WHERE status = ?'
  ).get(status);

  return {
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export function getSuggestionById(id) {
  const db = getDb();
  return db.prepare(`
    SELECT s.*, c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM suggestions s
    LEFT JOIN categories c ON c.id = s.category_id
    WHERE s.id = ?
  `).get(id);
}

export function createSuggestion({ title, excerpt, source_url, source_name, category_id }) {
  const db = getDb();
  const result = db.prepare(`
    INSERT INTO suggestions (title, excerpt, source_url, source_name, category_id)
    VALUES (@title, @excerpt, @source_url, @source_name, @category_id)
  `).run({ title, excerpt: excerpt || '', source_url, source_name: source_name || '', category_id: category_id || null });

  return getSuggestionById(result.lastInsertRowid);
}

export function updateSuggestionStatus(id, status) {
  const db = getDb();
  return db.prepare('UPDATE suggestions SET status = ? WHERE id = ?').run(status, id);
}

export function suggestionExists(sourceUrl) {
  const db = getDb();
  const row = db.prepare('SELECT id FROM suggestions WHERE source_url = ?').get(sourceUrl);
  return !!row;
}

export function getRecentSuggestionTitles(limit = 200) {
  const db = getDb();
  return db.prepare(`
    SELECT title FROM suggestions ORDER BY fetched_at DESC LIMIT ?
  `).all(limit).map(r => r.title);
}

export function getSuggestionsCount(status) {
  const db = getDb();
  if (status) {
    return db.prepare('SELECT COUNT(*) as count FROM suggestions WHERE status = ?').get(status).count;
  }
  return db.prepare('SELECT COUNT(*) as count FROM suggestions').get().count;
}
