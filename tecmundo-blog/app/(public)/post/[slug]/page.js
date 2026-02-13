import { notFound } from 'next/navigation';
import { formatDistanceToNow, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { getPostBySlug, getPostsByCategory } from '@/lib/posts';
import CategoryBadge from '@/components/public/CategoryBadge';
import RelatedPosts from '@/components/public/RelatedPosts';
import Sidebar from '@/components/public/Sidebar';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Post não encontrado' };
  return {
    title: `${post.title} — TudoTecno`,
    description: post.excerpt,
    openGraph: post.cover_image ? { images: [post.cover_image] } : {},
  };
}

export default async function PostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post || post.status !== 'published') notFound();

  const { data: related } = getPostsByCategory(post.category_slug, { page: 1, limit: 4 });
  const relatedPosts = related.filter(p => p.id !== post.id).slice(0, 3);
  const coverImage = post.cover_image || 'https://placehold.co/800x400/1e293b/94a3b8?text=Sem+imagem';

  const timeAgo = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
    : '';
  const dateFormatted = post.published_at
    ? format(new Date(post.published_at), "d 'de' MMMM 'de' yyyy", { locale: ptBR })
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Article */}
        <article className="flex-1 min-w-0">
          {/* Cover */}
          <div className="rounded-xl overflow-hidden aspect-video mb-6">
            <img src={coverImage} alt={post.title} className="w-full h-full object-cover" />
          </div>

          {/* Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <CategoryBadge name={post.category_name} color={post.category_color} />
            {post.tags?.map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-[var(--text-medium)] px-2 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--text-strong)] leading-tight mb-4">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg text-[var(--text-medium)] leading-relaxed mb-6 border-l-4 border-brand-blue pl-4">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-[var(--text-weak)] mb-8 pb-6 border-b border-[var(--border)]">
            <span className="font-semibold text-[var(--text-medium)]">{post.author}</span>
            <span>·</span>
            <time title={dateFormatted}>{timeAgo}</time>
            {post.source_url && (
              <>
                <span>·</span>
                <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline text-xs">
                  Fonte original
                </a>
              </>
            )}
          </div>

          {/* Content */}
          <div
            className="prose prose-gray max-w-none text-[var(--text-medium)] leading-relaxed"
            style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}
          >
            {post.content || <span className="text-[var(--text-weak)] italic">Conteúdo não disponível.</span>}
          </div>

          <RelatedPosts posts={relatedPosts} />
        </article>

        {/* Sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-20">
            <Sidebar latestPosts={relatedPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}
