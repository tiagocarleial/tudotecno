import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CategoryBadge from './CategoryBadge';

export default function PostCard({ post }) {
  const timeAgo = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
    : '';

  const coverImage = post.cover_image || 'https://placehold.co/400x225/1e293b/94a3b8?text=Sem+imagem';

  return (
    <div className="card-hover bg-white rounded-xl overflow-hidden shadow-sm border border-[var(--border)]">
      <Link href={`/post/${post.slug}`}>
        <div className="relative aspect-video overflow-hidden">
          <img
            src={coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="mb-2">
          <CategoryBadge name={post.category_name} color={post.category_color} />
        </div>
        <Link href={`/post/${post.slug}`}>
          <h3 className="font-bold text-[var(--text-strong)] text-base leading-snug line-clamp-2 hover:text-brand-blue transition-colors">
            {post.title}
          </h3>
        </Link>
        {post.excerpt && (
          <p className="text-[var(--text-weak)] text-sm mt-1 line-clamp-2">{post.excerpt}</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-[var(--text-weak)]">
          <span className="font-medium">{post.author}</span>
          {timeAgo && <><span>·</span><span>{timeAgo}</span></>}
        </div>
      </div>
    </div>
  );
}
