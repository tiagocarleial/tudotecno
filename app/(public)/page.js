import { getPosts, getLatestPosts } from '@/lib/posts';
import HeroSection from '@/components/public/HeroSection';
import PostGrid from '@/components/public/PostGrid';
import Sidebar from '@/components/public/Sidebar';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1');
  const { data: heroPosts } = await getPosts({ page: 1, limit: 3, status: 'published' });
  const { data: latestPosts, pagination } = await getPosts({ page, limit: 12, status: 'published' });
  const sidebarPosts = await getLatestPosts(6);

  if (latestPosts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-[var(--text-strong)] mb-3">Nenhum post publicado ainda</h2>
        <p className="text-[var(--text-weak)] mb-6">Acesse o painel admin para criar ou aprovar posts.</p>
        <a href="/admin" className="inline-block bg-brand-blue text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
          Ir para o Admin
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {page === 1 && <HeroSection posts={heroPosts} />}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <PostGrid posts={latestPosts} title="Mais notícias recentes" />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                <a
                  key={p}
                  href={`/?page=${p}`}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    p === page
                      ? 'bg-brand-blue text-white'
                      : 'bg-white text-[var(--text-medium)] border border-[var(--border)] hover:bg-gray-50'
                  }`}
                >
                  {p}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <Sidebar latestPosts={sidebarPosts} />
        </div>
      </div>
    </div>
  );
}
