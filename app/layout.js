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
    google: 'GOOGLE_VERIFICATION_CODE_AQUI', // Substitua pelo código do Google Search Console
    yandex: 'YANDEX_VERIFICATION_CODE_AQUI', // Opcional
    bing: 'BING_VERIFICATION_CODE_AQUI', // Substitua pelo código do Bing Webmaster
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
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-XXXXXXX');`}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8079361631746336"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased">
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
