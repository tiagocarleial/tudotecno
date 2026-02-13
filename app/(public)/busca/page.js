'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import PostGrid from '@/components/public/PostGrid';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=24`)
      .then(r => r.json())
      .then(data => { setResults(data.data || []); setTotal(data.pagination?.total || 0); })
      .finally(() => setLoading(false));
  }, [q]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">
          {q ? `Resultados para "${q}"` : 'Busca'}
        </h1>
        {q && !loading && (
          <p className="text-[var(--text-weak)] text-sm mt-1">
            {total} resultado{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--border)] animate-pulse">
              <div className="aspect-video bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && results.length === 0 && q && (
        <div className="text-center py-16 text-[var(--text-weak)]">
          <p className="text-lg">Nenhum resultado encontrado para "{q}".</p>
          <p className="text-sm mt-2">Tente outros termos de busca.</p>
        </div>
      )}

      {!loading && results.length > 0 && <PostGrid posts={results} />}
    </div>
  );
}

export default function BuscaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-[var(--text-weak)]">Carregando...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
