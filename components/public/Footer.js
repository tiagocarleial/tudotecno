import Link from 'next/link';

const CATEGORIES = [
  { name: 'Tecnologia', slug: 'tecnologia' },
  { name: 'Games',      slug: 'games' },
  { name: 'Ciência',    slug: 'ciencia' },
  { name: 'Internet',   slug: 'internet' },
  { name: 'Segurança',  slug: 'seguranca' },
  { name: 'Mercado',    slug: 'mercado' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img src="/logo.png" alt="TudoTecno" className="h-8 w-auto brightness-0 invert" />
            <p className="mt-3 text-sm leading-relaxed">
              Tudo sobre tecnologia, games, ciência e muito mais. Fique por dentro das últimas novidades.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-3">Categorias</h4>
            <ul className="space-y-2">
              {CATEGORIES.map(cat => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} className="text-sm hover:text-white transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm hover:text-white transition-colors">Início</Link></li>
              <li><Link href="/busca" className="text-sm hover:text-white transition-colors">Busca</Link></li>
              <li><Link href="/admin" className="text-sm hover:text-white transition-colors">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs">
          <p>© {new Date().getFullYear()} TudoTecno. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
