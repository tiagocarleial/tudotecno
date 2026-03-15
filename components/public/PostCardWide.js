import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CategoryBadge from './CategoryBadge';

export default function PostCardWide({ post }) {
  const timeAgo = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
    : '';

  // Trata imagens vazias e base64 (next/image não suporta data URIs)
  const coverImage = !post.cover_image || post.cover_image.startsWith('data:')
    ? 'https://placehold.co/120x90/1e293b/94a3b8?text=...'
    : post.cover_image;

  return (
    <div className="flex gap-3 py-3 border-b border-[var(--border)] last:border-0">
      <Link href={`/post/${post.slug}`} className="shrink-0">
        <div className="relative w-24 h-16 rounded-lg overflow-hidden">
          <Image
            src={coverImage}
            alt={post.title}
            fill
            sizes="96px"
            className="object-cover"
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
