import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import CategoryBadge from './CategoryBadge';

function HeroMainCard({ post }) {
  const timeAgo = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
    : '';
  const coverImage = post.cover_image || 'https://placehold.co/800x450/0f1117/94a3b8?text=Sem+imagem';

  return (
    <Link href={`/post/${post.slug}`} className="block relative rounded-xl overflow-hidden group" style={{ minHeight: '360px' }}>
      <img
        src={coverImage}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <CategoryBadge name={post.category_name} color={post.category_color} className="mb-3" />
        <h1 className="text-white text-2xl font-bold leading-tight line-clamp-3 mb-2 group-hover:text-brand-cyan transition-colors">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-gray-300 text-sm line-clamp-2 mb-2">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <span>{post.author}</span>
          {timeAgo && <><span>·</span><span>{timeAgo}</span></>}
        </div>
      </div>
    </Link>
  );
}

function HeroSmallCard({ post }) {
  const timeAgo = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
    : '';
  const coverImage = post.cover_image || 'https://placehold.co/400x200/0f1117/94a3b8?text=Sem+imagem';

  return (
    <Link href={`/post/${post.slug}`} className="block relative rounded-xl overflow-hidden group flex-1" style={{ minHeight: '170px' }}>
      <img
        src={coverImage}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <CategoryBadge name={post.category_name} color={post.category_color} className="mb-2" />
        <h3 className="text-white text-sm font-bold leading-snug line-clamp-2 group-hover:text-brand-cyan transition-colors">
          {post.title}
        </h3>
        {timeAgo && <span className="text-gray-400 text-xs">{timeAgo}</span>}
      </div>
    </Link>
  );
}

export default function HeroSection({ posts }) {
  if (!posts?.length) return null;

  const [main, ...rest] = posts;

  return (
    <section className="mb-10">
      <div className="flex flex-col lg:flex-row gap-4" style={{ minHeight: '360px' }}>
        <div className="flex-1 lg:flex-[2]">
          <HeroMainCard post={main} />
        </div>
        {rest.length > 0 && (
          <div className="flex flex-row lg:flex-col gap-4 lg:flex-1">
            {rest.slice(0, 2).map(post => (
              <HeroSmallCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
