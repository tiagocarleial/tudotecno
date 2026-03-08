import getDb from './db.js';
import { unstable_cache } from 'next/cache';

// Cache para getAllCategories
const getAllCategoriesCached = unstable_cache(
  async () => {
    const db = getDb();
    const result = await db.execute({ sql: 'SELECT * FROM categories ORDER BY name ASC', args: [] });
    return result.rows;
  },
  ['all-categories'],
  { revalidate: 300, tags: ['categories'] } // 5 minutos (categorias mudam raramente)
);

export async function getAllCategories() {
  return getAllCategoriesCached();
}

// Cache para getCategoryBySlug
const getCategoryBySlugCached = unstable_cache(
  async (slug) => {
    const db = getDb();
    const result = await db.execute({ sql: 'SELECT * FROM categories WHERE slug = ?', args: [slug] });
    return result.rows[0] ?? null;
  },
  ['category-by-slug'],
  { revalidate: 300, tags: ['categories'] }
);

export async function getCategoryBySlug(slug) {
  return getCategoryBySlugCached(slug);
}

export async function getCategoryById(id) {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM categories WHERE id = ?', args: [id] });
  return result.rows[0] ?? null;
}

// Cache para getCategoriesWithPostCount
const getCategoriesWithPostCountCached = unstable_cache(
  async () => {
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
  },
  ['categories-with-count'],
  { revalidate: 60, tags: ['categories', 'posts'] }
);

export async function getCategoriesWithPostCount() {
  return getCategoriesWithPostCountCached();
}
