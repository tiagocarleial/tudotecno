import { getPostsCount, getLatestPosts } from '@/lib/posts';
import { getSuggestionsCount } from '@/lib/suggestions';
import StatsCard from '@/components/admin/StatsCard';
import FetchNewsButton from './FetchNewsButton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const published = getPostsCount('published');
  const drafts    = getPostsCount('draft');
  const pending   = getSuggestionsCount('pending');
  const total     = getPostsCount();
  const recentPosts = getLatestPosts(5);

  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-strong)]">Dashboard</h1>
        <p className="text-[var(--text-weak)] text-sm mt-1">Bem-vindo ao painel do TudoTecno.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Publicados"   value={published} color="#16a34a" icon="✅" />
        <StatsCard label="Rascunhos"    value={drafts}    color="#d97706" icon="📝" />
        <StatsCard label="Sugestões"    value={pending}   color="#dc2626" icon="📥" />
        <StatsCard label="Total posts"  value={total}     color="#2859f1" icon="📰" />
      </div>

      {/* Quick actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link href="/admin/posts/new" className="bg-brand-blue text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
          + Novo Post
        </Link>
        <Link href="/admin/suggestions" className="bg-white border border-[var(--border)] text-[var(--text-medium)] px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
          Ver Sugestões {pending > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pending}</span>}
        </Link>
        <FetchNewsButton />
      </div>

      {/* Recent posts */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
          <h2 className="font-semibold text-[var(--text-strong)]">Posts recentes</h2>
          <Link href="/admin/posts" className="text-sm text-brand-blue hover:underline">Ver todos</Link>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-weak)] uppercase tracking-wider">Título</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-weak)] uppercase tracking-wider hidden md:table-cell">Categoria</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-weak)] uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-weak)] uppercase tracking-wider hidden lg:table-cell">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {recentPosts.map(post => (
              <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <Link href={`/admin/posts/${post.id}/edit`} className="font-medium text-[var(--text-strong)] hover:text-brand-blue line-clamp-1">
                    {post.title}
                  </Link>
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <span className="text-[var(--text-weak)]">{post.category_name}</span>
                </td>
                <td className="px-5 py-3">
                  <StatusBadge status={post.status} />
                </td>
                <td className="px-5 py-3 hidden lg:table-cell text-[var(--text-weak)]">
                  {post.published_at
                    ? format(new Date(post.published_at), 'dd/MM/yyyy', { locale: ptBR })
                    : '—'}
                </td>
              </tr>
            ))}
            {recentPosts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-[var(--text-weak)]">
                  Nenhum post ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    published: { label: 'Publicado', cls: 'bg-green-100 text-green-700' },
    draft:     { label: 'Rascunho',  cls: 'bg-yellow-100 text-yellow-700' },
    archived:  { label: 'Arquivado', cls: 'bg-gray-100 text-gray-600' },
  };
  const s = map[status] || map.draft;
  return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>;
}

