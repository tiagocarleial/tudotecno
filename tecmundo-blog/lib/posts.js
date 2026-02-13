import getDb from './db.js';

function withCategory(post) {
  if (!post) return null;
  return {
    ...post,
    tags: post.tags ? post.tags.split(',').filter(Boolean) : [],
  };
}

export function getPosts({ page = 1, limit = 12, status, categoryId } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;
  const conditions = [];
  const params = [];

  if (status) { conditions.push('p.status = ?'); params.push(status); }
  if (categoryId) { conditions.push('p.category_id = ?'); params.push(categoryId); }

  const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

  const rows = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    ${where}
    ORDER BY p.published_at DESC, p.created_at DESC
    LIMIT ? OFFSET ?
  `).all(...params, limit, offset);

  const { total } = db.prepare(`
    SELECT COUNT(*) as total FROM posts p ${where}
  `).get(...params);

  return {
    data: rows.map(withCategory),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export function getPostBySlug(slug) {
  const db = getDb();
  const post = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.slug = ?
  `).get(slug);
  return withCategory(post);
}

export function getPostById(id) {
  const db = getDb();
  const post = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.id = ?
  `).get(id);
  return withCategory(post);
}

export function createPost({ title, slug, content, excerpt, cover_image, category_id, status, source_url, author, tags }) {
  const db = getDb();
  const tagsStr = Array.isArray(tags) ? tags.join(',') : (tags || '');
  const published_at = status === 'published' ? new Date().toISOString() : null;

  const result = db.prepare(`
    INSERT INTO posts (title, slug, content, excerpt, cover_image, category_id, status, source_url, author, tags, published_at)
    VALUES (@title, @slug, @content, @excerpt, @cover_image, @category_id, @status, @source_url, @author, @tags, @published_at)
  `).run({ title, slug, content: content || '', excerpt: excerpt || '', cover_image: cover_image || '', category_id, status: status || 'draft', source_url: source_url || '', author: author || 'Redacao', tags: tagsStr, published_at });

  return getPostById(result.lastInsertRowid);
}

export function updatePost(id, fields) {
  const db = getDb();
  const post = getPostById(id);
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

  db.prepare(`
    UPDATE posts SET
      title = @title, slug = @slug, content = @content, excerpt = @excerpt,
      cover_image = @cover_image, category_id = @category_id, status = @status,
      source_url = @source_url, author = @author, tags = @tags, published_at = @published_at
    WHERE id = @id
  `).run({ ...updated, published_at, id });

  return getPostById(id);
}

export function deletePost(id) {
  const db = getDb();
  return db.prepare('DELETE FROM posts WHERE id = ?').run(id);
}

export function getPostsByCategory(categorySlug, { page = 1, limit = 12 } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;

  const rows = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM posts p
    JOIN categories c ON c.id = p.category_id
    WHERE c.slug = ? AND p.status = 'published'
    ORDER BY p.published_at DESC
    LIMIT ? OFFSET ?
  `).all(categorySlug, limit, offset);

  const { total } = db.prepare(`
    SELECT COUNT(*) as total FROM posts p
    JOIN categories c ON c.id = p.category_id
    WHERE c.slug = ? AND p.status = 'published'
  `).get(categorySlug);

  return {
    data: rows.map(withCategory),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export function searchPosts(query, { page = 1, limit = 12 } = {}) {
  const db = getDb();
  const offset = (page - 1) * limit;
  const q = `%${query}%`;

  const rows = db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published' AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)
    ORDER BY p.published_at DESC
    LIMIT ? OFFSET ?
  `).all(q, q, q, limit, offset);

  const { total } = db.prepare(`
    SELECT COUNT(*) as total FROM posts p
    WHERE p.status = 'published' AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)
  `).get(q, q, q);

  return {
    data: rows.map(withCategory),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export function getLatestPosts(limit = 5) {
  const db = getDb();
  return db.prepare(`
    SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
    FROM posts p
    LEFT JOIN categories c ON c.id = p.category_id
    WHERE p.status = 'published'
    ORDER BY p.published_at DESC
    LIMIT ?
  `).all(limit).map(withCategory);
}

export function getPostsCount(status) {
  const db = getDb();
  if (status) {
    return db.prepare('SELECT COUNT(*) as count FROM posts WHERE status = ?').get(status).count;
  }
  return db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
}
