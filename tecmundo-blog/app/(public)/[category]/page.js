import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/categories';
import { getPostsByCategory, getLatestPosts } from '@/lib/posts';
import PostGrid from '@/components/public/PostGrid';
import Sidebar from '@/components/public/Sidebar';

export const dynamic = 'force-dynamic';

const VALID_CATEGORIES = ['tecnologia', 'games', 'ciencia', 'internet', 'seguranca', 'mercado'];

export async function generateMetadata({ params }) {
  const category = getCategoryBySlug(params.category);
  if (!category) return { title: 'Categoria não encontrada' };
  return { title: `${category.name} — TudoTecno` };
}

export default async function CategoryPage({ params, searchParams }) {
  if (!VALID_CATEGORIES.includes(params.category)) notFound();

  const category = getCategoryBySlug(params.category);
  if (!category) notFound();

  const page = parseInt(searchParams?.page || '1');
  const { data: posts, pagination } = getPostsByCategory(params.category, { page, limit: 12 });
  const sidebarPosts = getLatestPosts(6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 rounded-full" style={{ backgroundColor: category.color }} />
        <div>
          <h1 className="text-3xl font-extrabold text-[var(--text-strong)]">{category.name}</h1>
          <p className="text-[var(--text-weak)] text-sm mt-0.5">{pagination.total} artigos</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-[var(--text-weak)]">
              <p className="text-lg">Nenhum post nesta categoria ainda.</p>
            </div>
          ) : (
            <>
              <PostGrid posts={posts} />
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                    <a
                      key={p}
                      href={`/${params.category}?page=${p}`}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'text-white'
                          : 'bg-white text-[var(--text-medium)] border border-[var(--border)] hover:bg-gray-50'
                      }`}
                      style={p === page ? { backgroundColor: category.color } : {}}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
        <div className="w-full lg:w-80 shrink-0">
          <Sidebar latestPosts={sidebarPosts} />
        </div>
      </div>
    </div>
  );
}
