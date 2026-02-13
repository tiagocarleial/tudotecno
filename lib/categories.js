import getDb from './db.js';

export async function getAllCategories() {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM categories ORDER BY name ASC', args: [] });
  return result.rows;
}

export async function getCategoryBySlug(slug) {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM categories WHERE slug = ?', args: [slug] });
  return result.rows[0] ?? null;
}

export async function getCategoryById(id) {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM categories WHERE id = ?', args: [id] });
  return result.rows[0] ?? null;
}

export async function getCategoriesWithPostCount() {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT c.*, COUNT(p.id) as post_count
          FROM categories c
          LEFT JOIN posts p ON p.category_id = c.id AND p.status = 'published'
          GROUP BY c.id
          ORDER BY c.name ASC`,
    args: [],
  });
  return result.rows;
}
