import getDb from './db.js';

function withCategory(post) {
  if (!post) return null;
  return {
    ...post,
    tags: post.tags ? post.tags.split(',').filter(Boolean) : [],
  };
}

// getPosts - cache gerenciado pelo ISR da página
export async function getPosts({ page = 1, limit = 12, status, categoryId } = {}) {
  try {
    const db = getDb();
    const offset = (page - 1) * limit;
    const conditions = [];
    const params = [];

    if (status) { conditions.push('p.status = ?'); params.push(status); }
    if (categoryId) { conditions.push('p.category_id = ?'); params.push(categoryId); }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    // Otimização: Deferred join para melhor performance com OFFSET alto
    // Primeiro busca apenas IDs (rápido via índice), depois JOIN para dados completos
    const [rowsResult, countResult] = await Promise.all([
      db.execute({
        sql: `SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.category_id,
                     p.status, p.source_url, p.author, p.tags, p.created_at, p.published_at,
                     c.name as category_name, c.slug as category_slug, c.color as category_color
              FROM posts p
              LEFT JOIN categories c ON c.id = p.category_id
              WHERE p.id IN (
                SELECT id FROM posts ${where}
                ORDER BY published_at DESC, created_at DESC
                LIMIT ? OFFSET ?
              )
              ORDER BY p.published_at DESC, p.created_at DESC`,
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
  } catch (error) {
    console.error('[posts] Error fetching posts:', error.message);
    console.error('[posts] Error code:', error.code);
    console.error('[posts] Stack:', error.stack);
    // Fallback: retorna vazio para permitir build e runtime com falha
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }
}

// getPostBySlug - cache gerenciado pelo ISR da página
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

// getPostsByCategory - cache gerenciado pelo ISR da página
export async function getPostsByCategory(categorySlug, { page = 1, limit = 12 } = {}) {
  try {
    const db = getDb();
    const offset = (page - 1) * limit;

    // Otimização: Deferred join para melhor performance com OFFSET alto
    const [rowsResult, countResult] = await Promise.all([
      db.execute({
        sql: `SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.category_id,
                     p.status, p.source_url, p.author, p.tags, p.created_at, p.published_at,
                     c.name as category_name, c.slug as category_slug, c.color as category_color
              FROM posts p
              JOIN categories c ON c.id = p.category_id
              WHERE p.id IN (
                SELECT p2.id FROM posts p2
                JOIN categories c2 ON c2.id = p2.category_id
                WHERE c2.slug = ? AND p2.status = 'published'
                ORDER BY p2.published_at DESC
                LIMIT ? OFFSET ?
              )
              ORDER BY p.published_at DESC`,
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
  } catch (error) {
    console.error('[posts] Error fetching posts by category:', error.message);
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }
}

export async function searchPosts(query, { page = 1, limit = 12 } = {}) {
  try {
    const db = getDb();
    const offset = (page - 1) * limit;
    const q = `%${query}%`;

    // Otimização: Deferred join para melhor performance com OFFSET alto
    const [rowsResult, countResult] = await Promise.all([
      db.execute({
        sql: `SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.category_id,
                     p.status, p.source_url, p.author, p.tags, p.created_at, p.published_at,
                     c.name as category_name, c.slug as category_slug, c.color as category_color
              FROM posts p
              LEFT JOIN categories c ON c.id = p.category_id
              WHERE p.id IN (
                SELECT id FROM posts
                WHERE status = 'published' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)
                ORDER BY published_at DESC
                LIMIT ? OFFSET ?
              )
              ORDER BY p.published_at DESC`,
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
  } catch (error) {
    console.error('[posts] Error searching posts:', error.message);
    return {
      data: [],
      pagination: { page, limit, total: 0, totalPages: 0 },
    };
  }
}

// getLatestPosts - cache gerenciado pelo ISR da página
export async function getLatestPosts(limit = 5) {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: `SELECT p.id, p.title, p.slug, p.excerpt, p.cover_image, p.category_id,
                   p.status, p.source_url, p.author, p.tags, p.created_at, p.published_at,
                   c.name as category_name, c.slug as category_slug, c.color as category_color
            FROM posts p
            LEFT JOIN categories c ON c.id = p.category_id
            WHERE p.status = 'published'
            ORDER BY p.published_at DESC
            LIMIT ?`,
      args: [limit],
    });
    return result.rows.map(withCategory);
  } catch (error) {
    console.error('[posts] Error fetching latest posts:', error.message);
    return [];
  }
}

export async function getPostsCount(status) {
  try {
    const db = getDb();
    if (status) {
      const result = await db.execute({ sql: 'SELECT COUNT(*) as count FROM posts WHERE status = ?', args: [status] });
      return Number(result.rows[0].count);
    }
    const result = await db.execute({ sql: 'SELECT COUNT(*) as count FROM posts', args: [] });
    return Number(result.rows[0].count);
  } catch (error) {
    console.error('[posts] Error counting posts:', error.message);
    return 0;
  }
}

// Função especial para sitemap - SEM cache (usado apenas em build time)
export async function getAllPostsForSitemap() {
  try {
    const db = getDb();
    const result = await db.execute({
      sql: `SELECT id, slug, published_at
            FROM posts
            WHERE status = 'published'
            ORDER BY published_at DESC`,
      args: [],
    });
    return result.rows;
  } catch (error) {
    console.error('[posts] Error fetching posts for sitemap:', error.message);
    return [];
  }
}
