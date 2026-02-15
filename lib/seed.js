import getDb from './db.js';

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia', color: '#2859f1', icon: 'laptop' },
  { name: 'Games',      slug: 'games',      color: '#9333ea', icon: 'gamepad' },
  { name: 'Ciência',    slug: 'ciencia',    color: '#16a34a', icon: 'flask' },
  { name: 'Internet',   slug: 'internet',   color: '#0891b2', icon: 'globe' },
  { name: 'Segurança',  slug: 'seguranca',  color: '#dc2626', icon: 'shield' },
  { name: 'Mercado',    slug: 'mercado',    color: '#d97706', icon: 'trending-up' },
  { name: 'Notícias',   slug: 'noticias',   color: '#e11d48', icon: 'newspaper' },
];

export async function seedCategories() {
  const db = getDb();
  await db.batch(
    CATEGORIES.map(cat => ({
      sql: `INSERT OR IGNORE INTO categories (name, slug, color, icon) VALUES (?, ?, ?, ?)`,
      args: [cat.name, cat.slug, cat.color, cat.icon],
    })),
    'write'
  );
  console.log('[db] Categories seeded');
}
