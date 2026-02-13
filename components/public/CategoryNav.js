'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia', color: '#2859f1' },
  { name: 'Games',      slug: 'games',      color: '#9333ea' },
  { name: 'Ciência',    slug: 'ciencia',    color: '#16a34a' },
  { name: 'Internet',   slug: 'internet',   color: '#0891b2' },
  { name: 'Segurança',  slug: 'seguranca',  color: '#dc2626' },
  { name: 'Mercado',    slug: 'mercado',    color: '#d97706' },
];

export default function CategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide gap-1 py-1">
          {CATEGORIES.map(cat => {
            const isActive = pathname === `/${cat.slug}`;
            return (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`shrink-0 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : 'text-[var(--text-medium)] hover:text-[var(--text-strong)] hover:bg-gray-100'
                }`}
                style={isActive ? { backgroundColor: cat.color } : {}}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
