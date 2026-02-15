'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const CATEGORY_COLORS = {
  'Tecnologia': '#2859f1', 'Games': '#9333ea', 'Ciência': '#16a34a',
  'Internet': '#0891b2', 'Segurança': '#dc2626', 'Mercado': '#d97706',
  'Notícias': '#e11d48',
};

function StatusBadge({ status }) {
  const map = {
    published: { label: 'Publicado', cls: 'bg-green-100 text-green-700' },
    draft:     { label: 'Rascunho',  cls: 'bg-yellow-100 text-yellow-700' },
    archived:  { label: 'Arquivado', cls: 'bg-gray-100 text-gray-600' },
  };
  const s = map[status] || map.draft;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>;
}

export default function PostsListPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 20 });
    if (statusFilter) params.set('status', statusFilter);
    const res = await fetch(`/api/posts?${params}`);
    const data = await res.json();
    setPosts(data.data || []);
    setPagination(data.pagination || {});
    setLoading(false);
  }, [page, statusFilter]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  async function handleDelete(id) {
    const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    if (res.ok) { setDeleteConfirm(null); loadPosts(); }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Posts</h1>
          <p className="text-[var(--text-weak)] text-sm mt-1">{pagination.total} posts no total</p>
        </div>
        <Link href="/admin/posts/new" className="bg-brand-blue text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          + Novo Post
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {['', 'published', 'draft', 'archived'].map(s => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === s
                ? 'bg-brand-blue text-white'
                : 'bg-white text-[var(--text-medium)] border border-[var(--border)] hover:bg-gray-50'
            }`}
          >
            {s === '' ? 'Todos' : s === 'published' ? 'Publicados' : s === 'draft' ? 'Rascunhos' : 'Arquivados'}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-[var(--text-weak)]">Carregando...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-weak)] uppercase">Título</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-weak)] uppercase hidden md:table-cell">Categoria</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-weak)] uppercase">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-weak)] uppercase hidden lg:table-cell">Data</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-[var(--text-weak)] uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="font-medium text-[var(--text-strong)] line-clamp-1">{post.title}</span>
                  </td>
                  <td className="px-5 py-3 hidden md:table-cell">
                    <span className="text-[var(--text-weak)]">{post.category_name}</span>
                  </td>
                  <td className="px-5 py-3"><StatusBadge status={post.status} /></td>
                  <td className="px-5 py-3 hidden lg:table-cell text-[var(--text-weak)]">
                    {post.published_at
                      ? format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })
                      : '—'}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {post.status === 'published' && (
                        <Link href={`/post/${post.slug}`} target="_blank" className="text-xs text-[var(--text-weak)] hover:text-brand-blue transition-colors">
                          Ver
                        </Link>
                      )}
                      <Link href={`/admin/posts/${post.id}/edit`} className="text-xs text-brand-blue hover:underline">
                        Editar
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[var(--text-weak)]">Nenhum post encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                p === page
                  ? 'bg-brand-blue text-white'
                  : 'bg-white text-[var(--text-medium)] border border-[var(--border)] hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-bold text-[var(--text-strong)] mb-2">Confirmar exclusão</h3>
            <p className="text-sm text-[var(--text-weak)] mb-5">Esta ação não pode ser desfeita. O post será removido permanentemente.</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors"
              >
                Sim, excluir
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-100 text-[var(--text-medium)] py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
