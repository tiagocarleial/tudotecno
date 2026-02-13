'use client';

import { useState } from 'react';
import PostForm from './PostForm';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function SuggestionCard({ suggestion, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const timeAgo = suggestion.fetched_at
    ? formatDistanceToNow(new Date(suggestion.fetched_at), { addSuffix: true, locale: ptBR })
    : '';

  async function handleApprove() {
    setLoading(true);
    try {
      const res = await fetch(`/api/suggestions/${suggestion.id}/approve`, { method: 'POST' });
      if (res.ok) { setDone(true); onAction?.(); }
    } finally {
      setLoading(false);
    }
  }

  async function handleReject() {
    setLoading(true);
    try {
      const res = await fetch(`/api/suggestions/${suggestion.id}/reject`, { method: 'POST' });
      if (res.ok) { setDone(true); onAction?.(); }
    } finally {
      setLoading(false);
    }
  }

  if (done) return null;

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden shadow-sm transition-all">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {suggestion.category_color && (
                <span
                  className="category-badge"
                  style={{ backgroundColor: suggestion.category_color }}
                >
                  {suggestion.category_name}
                </span>
              )}
              <span className="text-xs text-[var(--text-weak)]">{suggestion.source_name}</span>
              <span className="text-xs text-[var(--text-weak)]">·</span>
              <span className="text-xs text-[var(--text-weak)]">{timeAgo}</span>
            </div>
            <h3 className="font-semibold text-[var(--text-strong)] leading-snug">{suggestion.title}</h3>
          </div>
          <a
            href={suggestion.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 text-xs text-brand-blue hover:underline mt-1"
          >
            Fonte ↗
          </a>
        </div>

        {suggestion.excerpt && (
          <p className="text-sm text-[var(--text-weak)] line-clamp-2 mb-3">{suggestion.excerpt}</p>
        )}

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleApprove}
            disabled={loading}
            className="px-4 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            Aprovar
          </button>
          <button
            onClick={() => setExpanded(v => !v)}
            disabled={loading}
            className="px-4 py-1.5 bg-brand-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {expanded ? 'Fechar editor' : 'Editar e Aprovar'}
          </button>
          <button
            onClick={handleReject}
            disabled={loading}
            className="px-4 py-1.5 bg-red-100 text-red-700 text-sm font-semibold rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
          >
            Rejeitar
          </button>
        </div>
      </div>

      {/* Inline post editor */}
      {expanded && (
        <div className="border-t border-[var(--border)] p-4 bg-gray-50">
          <PostForm
            post={{
              title:      suggestion.title,
              excerpt:    suggestion.excerpt,
              category_id: suggestion.category_id || 1,
              source_url: suggestion.source_url,
              status:     'draft',
            }}
            suggestionMode
            onSuccess={async (createdPost) => {
              await fetch(`/api/suggestions/${suggestion.id}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...createdPost, _skip_create: true }),
              }).catch(() => {});
              setDone(true);
              onAction?.();
            }}
          />
        </div>
      )}
    </div>
  );
}
