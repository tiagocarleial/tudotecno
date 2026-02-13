import getDb from './db.js';

export async function getSuggestions({ page = 1, limit = 20, status = 'pending' } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;

  const [rowsResult, countResult] = await Promise.all([
    db.execute({
      sql: `SELECT s.*, c.name as category_name, c.slug as category_slug, c.color as category_color
            FROM suggestions s
            LEFT JOIN categories c ON c.id = s.category_id
            WHERE s.status = ?
            ORDER BY s.fetched_at DESC
            LIMIT ? OFFSET ?`,
      args: [status, limit, offset],
    }),
    db.execute({ sql: 'SELECT COUNT(*) as total FROM suggestions WHERE status = ?', args: [status] }),
  ]);

  const total = Number(countResult.rows[0].total);

  return {
    data: rowsResult.rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getSuggestionById(id) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT s.*, c.name as category_name, c.slug as category_slug, c.color as category_color
          FROM suggestions s
          LEFT JOIN categories c ON c.id = s.category_id
          WHERE s.id = ?`,
    args: [id],
  });
  return result.rows[0] ?? null;
}

export async function createSuggestion({ title, excerpt, source_url, source_name, category_id }) {
  const db = getDb();
  const result = await db.execute({
    sql: `INSERT INTO suggestions (title, excerpt, source_url, source_name, category_id)
          VALUES (?, ?, ?, ?, ?)`,
    args: [title, excerpt || '', source_url, source_name || '', category_id || null],
  });
  return getSuggestionById(Number(result.lastInsertRowid));
}

export async function updateSuggestionStatus(id, status) {
  const db = getDb();
  return db.execute({ sql: 'UPDATE suggestions SET status = ? WHERE id = ?', args: [status, id] });
}

export async function suggestionExists(sourceUrl) {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT id FROM suggestions WHERE source_url = ?', args: [sourceUrl] });
  return result.rows.length > 0;
}

export async function getRecentSuggestionTitles(limit = 200) {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT title FROM suggestions ORDER BY fetched_at DESC LIMIT ?',
    args: [limit],
  });
  return result.rows.map(r => r.title);
}

export async function getSuggestionsCount(status) {
  const db = getDb();
  if (status) {
    const result = await db.execute({ sql: 'SELECT COUNT(*) as count FROM suggestions WHERE status = ?', args: [status] });
    return Number(result.rows[0].count);
  }
  const result = await db.execute({ sql: 'SELECT COUNT(*) as count FROM suggestions', args: [] });
  return Number(result.rows[0].count);
}
