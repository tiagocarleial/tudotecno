import { getPosts, getLatestPosts } from '@/lib/posts';
import HeroSection from '@/components/public/HeroSection';
import PostGrid from '@/components/public/PostGrid';
import Sidebar from '@/components/public/Sidebar';

// ISR: Revalida a cada 5 minutos (300 segundos)
// Reduz chamadas ao banco Turso e melhora performance
export const revalidate = 300;

export default async function HomePage({ searchParams }) {
  const page = parseInt(searchParams?.page || '1');

  // Otimização: Uma única query para buscar posts
  const { data: allPosts, pagination } = await getPosts({ page, limit: 12, status: 'published' });

  // Reutilizar dados: Hero usa os 3 primeiros posts da primeira página
  const heroPosts = page === 1 ? allPosts.slice(0, 3) : [];
  const latestPosts = allPosts;

  // Sidebar: reutiliza os primeiros posts ao invés de fazer query separada
  const sidebarPosts = page === 1 ? allPosts.slice(0, 6) : await getLatestPosts(6);

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
          <PostGrid posts={latestPosts} title="Últimas notícias" />

          {/* Página 1: botão Mais notícias recentes */}
          {page === 1 && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <a
                href="/?page=2"
                className="px-6 py-2.5 bg-brand-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mais notícias recentes
              </a>
            </div>
          )}

          {/* Página 2+: apenas numeração de páginas */}
          {page > 1 && pagination.totalPages > 1 && (
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
