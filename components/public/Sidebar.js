import PostCardWide from './PostCardWide';

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia', color: '#2859f1' },
  { name: 'Games',      slug: 'games',      color: '#9333ea' },
  { name: 'Ciência',    slug: 'ciencia',    color: '#16a34a' },
  { name: 'Internet',   slug: 'internet',   color: '#0891b2' },
  { name: 'Segurança',  slug: 'seguranca',  color: '#dc2626' },
  { name: 'Mercado',    slug: 'mercado',    color: '#d97706' },
];

export default function Sidebar({ latestPosts = [] }) {
  return (
    <aside className="space-y-6">
      {/* Most recent */}
      {latestPosts.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--border)] p-4">
          <h3 className="font-bold text-[var(--text-strong)] mb-3 flex items-center gap-2">
            <span className="w-1 h-5 bg-brand-blue rounded-full inline-block" />
            Mais recentes
          </h3>
          <div>
            {latestPosts.map(post => (
              <PostCardWide key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4">
        <h3 className="font-bold text-[var(--text-strong)] mb-3 flex items-center gap-2">
          <span className="w-1 h-5 bg-brand-blue rounded-full inline-block" />
          Categorias
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map(cat => (
            <a
              key={cat.slug}
              href={`/${cat.slug}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-sm font-medium text-[var(--text-medium)] group-hover:text-[var(--text-strong)] transition-colors">
                {cat.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
