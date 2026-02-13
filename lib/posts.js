import getDb from './db.js';

function withCategory(post) {
  if (!post) return null;
  return {
    ...post,
    tags: post.tags ? post.tags.split(',').filter(Boolean) : [],
  };
}

export async function getPosts({ page = 1, limit = 12, status, categoryId } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (status) { conditions.push('p.status = ?'); params.push(status); }
  if (categoryId) { conditions.push('p.category_id = ?'); params.push(categoryId); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const [rowsResult, countResult] = await Promise.all([
    db.execute({
      sql: `SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
            FROM posts p
            LEFT JOIN categories c ON c.id = p.category_id
            ${where}
            ORDER BY p.published_at DESC, p.created_at DESC
            LIMIT ? OFFSET ?`,
      args: [...params, limit, offset],
    }),
    db.execute({
      sql: `SELECT COUNT(*) as total FROM posts p ${where}`,
      args: params,
    }),
  ]);

  const total = Number(countResult.rows[0].total);

  return {
    data: rowsResult.rows.map(withCategory),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getPostBySlug(slug) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
          FROM posts p
          LEFT JOIN categories c ON c.id = p.category_id
          WHERE p.slug = ?`,
    args: [slug],
  });
  return withCategory(result.rows[0] ?? null);
}

export async function getPostById(id) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
          FROM posts p
          LEFT JOIN categories c ON c.id = p.category_id
          WHERE p.id = ?`,
    args: [id],
  });
  return withCategory(result.rows[0] ?? null);
}

export async function createPost({ title, slug, content, excerpt, cover_image, category_id, status, source_url, author, tags }) {
  const db = getDb();
  const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
  const published_at = status === 'published' ? new Date().toISOString() : null;

  const result = await db.execute({
    sql: `INSERT INTO posts (title, slug, content, excerpt, cover_image, category_id, status, source_url, author, tags, published_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [title, slug, content || '', excerpt || '', cover_image || '', category_id, status || 'draft', source_url || '', author || 'Redacao', tagsStr, published_at],
  });

  return getPostById(Number(result.lastInsertRowid));
}

export async function updatePost(id, fields) {
  const db = getDb();
  const post = await getPostById(id);
  if (!post) return null;

  const updated = {
    title:       fields.title       ?? post.title,
    slug:        fields.slug        ?? post.slug,
    content:     fields.content     ?? post.content,
    excerpt:     fields.excerpt     ?? post.excerpt,
    cover_image: fields.cover_image ?? post.cover_image,
    category_id: fields.category_id ?? post.category_id,
    status:      fields.status      ?? post.status,
    source_url:  fields.source_url  ?? post.source_url,
    author:      fields.author      ?? post.author,
    tags:        Array.isArray(fields.tags) ? fields.tags.join(',') : (fields.tags ?? post.tags.join(',')),
  };

  const published_at = updated.status === 'published' && !post.published_at
    ? new Date().toISOString()
    : post.published_at;

  await db.execute({
    sql: `UPDATE posts SET
            title = ?, slug = ?, content = ?, excerpt = ?,
            cover_image = ?, category_id = ?, status = ?,
            source_url = ?, author = ?, tags = ?, published_at = ?
          WHERE id = ?`,
    args: [updated.title, updated.slug, updated.content, updated.excerpt,
           updated.cover_image, updated.category_id, updated.status,
           updated.source_url, updated.author, updated.tags, published_at, id],
  });

  return getPostById(id);
}

export async function deletePost(id) {
  const db = getDb();
  const result = await db.execute({ sql: 'DELETE FROM posts WHERE id = ?', args: [id] });
  return { changes: result.rowsAffected };
}

export async function getPostsByCategory(categorySlug, { page = 1, limit = 12 } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;

  const [rowsResult, countResult] = await Promise.all([
    db.execute({
      sql: `SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
            FROM posts p
            JOIN categories c ON c.id = p.category_id
            WHERE c.slug = ? AND p.status = 'published'
            ORDER BY p.published_at DESC
            LIMIT ? OFFSET ?`,
      args: [categorySlug, limit, offset],
    }),
    db.execute({
      sql: `SELECT COUNT(*) as total FROM posts p
            JOIN categories c ON c.id = p.category_id
            WHERE c.slug = ? AND p.status = 'published'`,
      args: [categorySlug],
    }),
  ]);

  const total = Number(countResult.rows[0].total);

  return {
    data: rowsResult.rows.map(withCategory),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function searchPosts(query, { page = 1, limit = 12 } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;
  const q = `%${query}%`;

  const [rowsResult, countResult] = await Promise.all([
    db.execute({
      sql: `SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
            FROM posts p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.status = 'published' AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)
            ORDER BY p.published_at DESC
            LIMIT ? OFFSET ?`,
      args: [q, q, q, limit, offset],
    }),
    db.execute({
      sql: `SELECT COUNT(*) as total FROM posts p
            WHERE p.status = 'published' AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)`,
      args: [q, q, q],
    }),
  ]);

  const total = Number(countResult.rows[0].total);

  return {
    data: rowsResult.rows.map(withCategory),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getLatestPosts(limit = 5) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
          FROM posts p
          LEFT JOIN categories c ON c.id = p.category_id
          WHERE p.status = 'published'
          ORDER BY p.published_at DESC
          LIMIT ?`,
    args: [limit],
  });
  return result.rows.map(withCategory);
}

export async function getPostsCount(status) {
  const db = getDb();
  if (status) {
    const result = await db.execute({ sql: 'SELECT COUNT(*) as count FROM posts WHERE status = ?', args: [status] });
    return Number(result.rows[0].count);
  }
  const result = await db.execute({ sql: 'SELECT COUNT(*) as count FROM posts', args: [] });
  return Number(result.rows[0].count);
}
