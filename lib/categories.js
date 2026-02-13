import getDb from './db.js';

export function getAllCategories() {
  const db = getDb();
  return db.prepare('SELECT * FROM categories ORDER BY name ASC').all();
}

export function getCategoryBySlug(slug) {
  const db = getDb();
  return db.prepare('SELECT * FROM categories WHERE slug = ?').get(slug);
}

export function getCategoryById(id) {
  const db = getDb();
  return db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
}

export function getCategoriesWithPostCount() {
  const db = getDb();
  return db.prepare(`
    SELECT c.*, COUNT(p.id) as post_count
    FROM categories c
    LEFT JOIN posts p ON p.category_id = c.id AND p.status = 'published'
    GROUP BY c.id
    ORDER BY c.name ASC
  `).all();
}
