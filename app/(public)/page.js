import { getPosts, getLatestPosts } from '@/lib/posts';
import HeroSection from '@/components/public/HeroSection';
import PostGrid from '@/components/public/PostGrid';
import Sidebar from '@/components/public/Sidebar';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const { data: heroPosts } = getPosts({ page: 1, limit: 3, status: 'published' });
  const { data: latestPosts } = getPosts({ page: 1, limit: 12, status: 'published' });
  const sidebarPosts = getLatestPosts(6);

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
      <HeroSection posts={heroPosts} />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <PostGrid posts={latestPosts} title="Últimas notícias" />
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <Sidebar latestPosts={sidebarPosts} />
        </div>
      </div>
    </div>
  );
}
