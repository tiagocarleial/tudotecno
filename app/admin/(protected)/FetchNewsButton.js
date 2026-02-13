'use client';

import { useState } from 'react';

export default function FetchNewsButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleFetch() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/fetch-news', { method: 'POST' });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleFetch}
        disabled={loading}
        className="bg-white border border-[var(--border)] text-[var(--text-medium)] px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {loading ? 'Buscando...' : '🔄 Buscar Notícias Agora'}
      </button>
      {result && !result.error && (
        <span className="text-sm text-green-600 font-medium">
          ✓ {result.inserted} novas, {result.skipped} ignoradas
        </span>
      )}
      {result?.error && (
        <span className="text-sm text-red-600">{result.error}</span>
      )}
    </div>
  );
}
