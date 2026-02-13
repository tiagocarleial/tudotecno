'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PostForm from '@/components/admin/PostForm';

export default function EditPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setPost(data);
      })
      .catch(() => setError('Erro ao carregar post'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-6" />
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">Editar Post</h1>
        <p className="text-[var(--text-weak)] text-sm mt-1 line-clamp-1">{post.title}</p>
      </div>
      <div className="bg-white rounded-xl border border-[var(--border)] p-6">
        <PostForm post={post} />
      </div>
    </div>
  );
}
