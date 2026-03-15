import './globals.css';
import Script from 'next/script';

const BASE_URL = 'https://www.tudotecno.com.br';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'TudoTecno — Tecnologia, Games, Ciência e mais',
    template: '%s — TudoTecno',
  },
  description: 'Fique por dentro das últimas novidades em tecnologia, games, ciência, internet, segurança e mercado.',
  keywords: ['tecnologia', 'games', 'ciência', 'internet', 'segurança', 'mercado', 'notícias tech', 'inteligência artificial', 'gadgets', 'smartphones'],
  authors: [{ name: 'TudoTecno' }],
  creator: 'TudoTecno',
  publisher: 'TudoTecno',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: { icon: '/favicon.png' },
  verification: {
    google: 'xhxLmwMhYO35qCr1bYLHKKLFwaR3IF3CEYx46v-bcgM',
    bing: 'E816E0B595A25B9D365E2E5BBDCE60E9',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE_URL,
    siteName: 'TudoTecno',
    title: 'TudoTecno — Tecnologia, Games, Ciência e mais',
    description: 'Fique por dentro das últimas novidades em tecnologia, games, ciência, internet, segurança e mercado.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'TudoTecno',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TudoTecno — Tecnologia, Games, Ciência e mais',
    description: 'Fique por dentro das últimas novidades em tecnologia, games, ciência, internet, segurança e mercado.',
    images: ['/logo.png'],
    creator: '@tudotecno', // Adicione seu @ do Twitter se tiver
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      'application/rss+xml': `${BASE_URL}/feed.xml`, // Se você adicionar RSS no futuro
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect para domínios de terceiros - acelera carregamento */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
