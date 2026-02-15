import './globals.css';

const BASE_URL = 'https://tudotecno.vercel.app';

export const metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'TudoTecno — Tecnologia, Games, Ciência e mais',
    template: '%s — TudoTecno',
  },
  description: 'Fique por dentro das últimas novidades em tecnologia, games, ciência, internet, segurança e mercado.',
  icons: { icon: '/favicon.png' },
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
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
