'use client';

import { useState, useEffect, useCallback } from 'react';
import SuggestionCard from '@/components/admin/SuggestionCard';

const TABS = [
  { label: 'Pendentes', value: 'pending' },
  { label: 'Aprovadas',  value: 'approved' },
  { label: 'Rejeitadas', value: 'rejected' },
];

export default function SuggestionsPage() {
  const [tab, setTab] = useState('pending');
  const [suggestions, setSuggestions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [fetchResult, setFetchResult] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/suggestions?status=${tab}&page=${page}&limit=20`);
    const data = await res.json();
    setSuggestions(data.data || []);
    setPagination(data.pagination || {});
    setLoading(false);
  }, [tab, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [tab]);

  async function handleFetchNews() {
    setFetching(true);
    setFetchResult(null);
    try {
      const res = await fetch('/api/fetch-news', { method: 'POST' });
      const data = await res.json();
      setFetchResult(data);
      if (tab === 'pending') load();
    } catch (err) {
      setFetchResult({ error: err.message });
    } finally {
      setFetching(false);
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-strong)]">Sugestões de notícias</h1>
          <p className="text-[var(--text-weak)] text-sm mt-1">
            Posts sugeridos automaticamente aguardando sua revisão.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleFetchNews}
            disabled={fetching}
            className="bg-white border border-[var(--border)] text-[var(--text-medium)] px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {fetching ? '🔄 Buscando...' : '🔄 Buscar Notícias Agora'}
          </button>
          {fetchResult && !fetchResult.error && (
            <span className="text-xs text-green-600 font-medium">
              ✓ {fetchResult.inserted} novas, {fetchResult.skipped} ignoradas
            </span>
          )}
          {fetchResult?.error && (
            <span className="text-xs text-red-600">{fetchResult.error}</span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.value
                ? 'bg-brand-blue text-white'
                : 'bg-white text-[var(--text-medium)] border border-[var(--border)] hover:bg-gray-50'
            }`}
          >
            {t.label}
            {t.value === tab && pagination.total > 0 && (
              <span className="ml-2 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                {pagination.total}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-[var(--border)] p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="flex gap-2">
                <div className="h-8 bg-gray-200 rounded w-20" />
                <div className="h-8 bg-gray-200 rounded w-28" />
                <div className="h-8 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      ) : suggestions.length === 0 ? (
        <div className="text-center py-16 text-[var(--text-weak)]">
          <p className="text-lg">Nenhuma sugestão {tab === 'pending' ? 'pendente' : tab === 'approved' ? 'aprovada' : 'rejeitada'}.</p>
          {tab === 'pending' && (
            <p className="text-sm mt-2">Clique em "Buscar Notícias Agora" para importar sugestões.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {suggestions.map(s => (
            <SuggestionCard key={s.id} suggestion={s} onAction={load} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
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
    </div>
  );
}
