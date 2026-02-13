'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV = [
  { label: 'Dashboard',    href: '/admin',              icon: '📊' },
  { label: 'Posts',        href: '/admin/posts',         icon: '📝' },
  { label: 'Novo Post',    href: '/admin/posts/new',     icon: '✏️' },
  { label: 'Sugestões',    href: '/admin/suggestions',   icon: '📥' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    fetch('/api/suggestions?status=pending&limit=1')
      .then(r => r.json())
      .then(data => setPendingCount(data.pagination?.total || 0))
      .catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' });
    window.location.href = '/admin/login';
  }

  return (
    <aside className="w-56 shrink-0 bg-brand-dark min-h-screen flex flex-col">
      <div className="p-4 border-b border-white/10">
        <Link href="/">
          <img src="/logo.png" alt="TudoTecno" className="h-7 w-auto brightness-0 invert" />
        </Link>
        <p className="text-gray-400 text-xs mt-1">Painel Admin</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(item => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-brand-blue text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.label === 'Sugestões' && pendingCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {pendingCount > 99 ? '99+' : pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all">
          <span>🌐</span>
          <span>Ver site</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all mt-1"
        >
          <span>🚪</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
