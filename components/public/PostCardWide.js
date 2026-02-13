import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CategoryBadge from './CategoryBadge';

export default function PostCardWide({ post }) {
  const timeAgo = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
    : '';

  const coverImage = post.cover_image || 'https://placehold.co/120x90/1e293b/94a3b8?text=...';

  return (
    <div className="flex gap-3 py-3 border-b border-[var(--border)] last:border-0">
      <Link href={`/post/${post.slug}`} className="shrink-0">
        <div className="w-24 h-16 rounded-lg overflow-hidden">
          <img
            src={coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>
      <div className="flex flex-col justify-center min-w-0">
        <CategoryBadge name={post.category_name} color={post.category_color} className="self-start mb-1" />
        <Link href={`/post/${post.slug}`}>
          <h4 className="text-sm font-semibold text-[var(--text-strong)] line-clamp-2 hover:text-brand-blue transition-colors leading-snug">
            {post.title}
          </h4>
        </Link>
        {timeAgo && <span className="text-xs text-[var(--text-weak)] mt-1">{timeAgo}</span>}
      </div>
    </div>
  );
}
