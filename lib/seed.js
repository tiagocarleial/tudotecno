import getDb from './db.js';

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia', color: '#2859f1', icon: 'laptop' },
  { name: 'Games',      slug: 'games',      color: '#9333ea', icon: 'gamepad' },
  { name: 'Ciência',    slug: 'ciencia',    color: '#16a34a', icon: 'flask' },
  { name: 'Internet',   slug: 'internet',   color: '#0891b2', icon: 'globe' },
  { name: 'Segurança',  slug: 'seguranca',  color: '#dc2626', icon: 'shield' },
  { name: 'Mercado',    slug: 'mercado',    color: '#d97706', icon: 'trending-up' },
];

export function seedCategories() {
  const db = getDb();
  const insert = db.prepare(`
    INSERT OR IGNORE INTO categories (name, slug, color, icon)
    VALUES (@name, @slug, @color, @icon)
  `);

  const insertMany = db.transaction((cats) => {
    for (const cat of cats) insert.run(cat);
  });

  insertMany(CATEGORIES);
  console.log('[db] Categories seeded');
}
