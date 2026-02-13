'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = [
  { id: 1, name: 'Tecnologia' },
  { id: 2, name: 'Games' },
  { id: 3, name: 'Ciência' },
  { id: 4, name: 'Internet' },
  { id: 5, name: 'Segurança' },
  { id: 6, name: 'Mercado' },
];

function autoSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function PostForm({ post, suggestionMode = false, onSuccess }) {
  const router = useRouter();
  const isEdit = !!post?.id;

  const [form, setForm] = useState({
    title:       post?.title       || '',
    slug:        post?.slug        || '',
    excerpt:     post?.excerpt     || '',
    content:     post?.content     || '',
    cover_image: post?.cover_image || '',
    category_id: post?.category_id || 1,
    status:      post?.status      || 'draft',
    author:      post?.author      || 'Redacao',
    tags:        Array.isArray(post?.tags) ? post.tags.join(', ') : (post?.tags || ''),
    source_url:  post?.source_url  || '',
  });

  const [slugTouched, setSlugTouched] = useState(isEdit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    if (!slugTouched && form.title) {
      setForm(f => ({ ...f, slug: autoSlug(f.title) }));
    }
  }, [form.title, slugTouched]);

  function set(field) {
    return e => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function submitForm(statusOverride) {
    setError('');
    setLoading(true);

    const payload = {
      ...form,
      status:      statusOverride ?? form.status,
      category_id: parseInt(form.category_id),
      tags:        form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    try {
      const url    = isEdit ? `/api/posts/${post.id}` : '/api/posts';
      const method = isEdit ? 'PUT' : 'POST';
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Erro ao salvar');
        return;
      }

      if (onSuccess) {
        onSuccess(data);
      } else {
        router.push('/admin/posts');
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function generateWithAI() {
    if (!form.title) {
      setAiError('Preencha o título antes de gerar o conteúdo.');
      return;
    }
    setAiError('');
    setAiLoading(true);
    try {
      const categoryName = CATEGORIES.find(c => c.id === parseInt(form.category_id))?.name || '';
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt,
          source_url: form.source_url,
          category: categoryName,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAiError(data.error || 'Erro ao gerar conteúdo');
        return;
      }
      setForm(f => ({ ...f, content: data.content }));
    } catch (err) {
      setAiError(err.message);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await submitForm();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Title */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-[var(--text-medium)] mb-1.5">Título *</label>
          <input
            type="text"
            value={form.title}
            onChange={set('title')}
            required
            placeholder="Título do post..."
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-medium)] mb-1.5">Slug</label>
          <input
            type="text"
            value={form.slug}
            onChange={e => { setSlugTouched(true); set('slug')(e); }}
            placeholder="url-do-post"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm font-mono"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-medium)] mb-1.5">Categoria *</label>
          <select
            value={form.category_id}
            onChange={set('category_id')}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm bg-white"
          >
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Excerpt */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-[var(--text-medium)] mb-1.5">
            Resumo <span className="text-[var(--text-weak)] font-normal">({form.excerpt.length}/300)</span>
          </label>
          <textarea
            value={form.excerpt}
            onChange={set('excerpt')}
            maxLength={300}
            rows={2}
            placeholder="Breve descrição do post..."
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm resize-none"
          />
        </div>

        {/* Content */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-medium text-[var(--text-medium)]">Conteúdo</label>
            <button
              type="button"
              onClick={generateWithAI}
              disabled={aiLoading || loading}
              className="flex items-center gap-1.5 px-3 py-1 bg-purple-600 text-white text-xs font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {aiLoading ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Gerando...
                </>
              ) : (
                <>✦ Gerar com IA</>
              )}
            </button>
          </div>
          {aiError && (
            <p className="text-xs text-red-600 mb-1.5">{aiError}</p>
          )}
          <textarea
            value={form.content}
            onChange={set('content')}
            rows={12}
            placeholder="Escreva o conteúdo completo do post aqui..."
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm resize-y font-mono"
          />
        </div>

        {/* Cover image */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-[var(--text-medium)] mb-1.5">URL da imagem de capa</label>
          <input
            type="url"
            value={form.cover_image}
            onChange={set('cover_image')}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
          {form.cover_image && (
            <div className="mt-2 rounded-lg overflow-hidden max-h-40 border border-[var(--border)]">
              <img src={form.cover_image} alt="Preview" className="w-full h-full object-cover max-h-40" />
            </div>
          )}
        </div>

        {/* Author */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-medium)] mb-1.5">Autor</label>
          <input
            type="text"
            value={form.author}
            onChange={set('author')}
            placeholder="Nome do autor"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-medium)] mb-1.5">Tags (separadas por vírgula)</label>
          <input
            type="text"
            value={form.tags}
            onChange={set('tags')}
            placeholder="ia, openai, tecnologia"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
        </div>

        {/* Source URL */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-medium)] mb-1.5">URL da fonte (opcional)</label>
          <input
            type="url"
            value={form.source_url}
            onChange={set('source_url')}
            placeholder="https://fonte-original.com/artigo"
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-medium)] mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={set('status')}
            className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-brand-blue text-sm bg-white"
          >
            <option value="draft">Rascunho</option>
            <option value="published">Publicado</option>
            <option value="archived">Arquivado</option>
          </select>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-brand-blue text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Salvando...' : (isEdit ? 'Salvar alterações' : 'Criar post')}
        </button>
        <button
          type="button"
          onClick={() => submitForm('published')}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar agora'}
        </button>
        {!suggestionMode && (
          <button
            type="button"
            onClick={() => router.back()}
            className="text-[var(--text-weak)] text-sm hover:text-[var(--text-strong)] transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
