'use client';

import { useState } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia' },
  { name: 'Games',      slug: 'games' },
  { name: 'Ciência',    slug: 'ciencia' },
  { name: 'Internet',   slug: 'internet' },
  { name: 'Segurança',  slug: 'seguranca' },
  { name: 'Mercado',    slug: 'mercado' },
];

export default function Header() {
  const [showSearch, setShowSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-brand-dark shadow-lg">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <img src="/logo.png" alt="TudoTecno" className="h-8 w-auto" />
        </Link>

        {/* Desktop nav links — centralizadas */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all whitespace-nowrap"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto lg:ml-0">
          <button
            onClick={() => setShowSearch(v => !v)}
            className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Buscar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button
            className="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* Search bar dropdown */}
      {showSearch && (
        <div className="bg-brand-dark border-t border-white/10 px-4 py-3">
          <div className="max-w-2xl mx-auto">
            <SearchBar onClose={() => setShowSearch(false)} />
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-brand-dark border-t border-white/10 px-4 py-3">
          <nav className="flex flex-col gap-1">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
