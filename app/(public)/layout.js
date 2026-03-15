import Script from 'next/script';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import NavigationProgress from '@/components/NavigationProgress';

export default function PublicLayout({ children }) {
  return (
    <>
      <NavigationProgress />

      {/* Google Analytics - Carrega de forma lazy para não bloquear */}
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-2RYD18CWCJ"
        strategy="lazyOnload"
      />
      <Script id="google-analytics" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-2RYD18CWCJ', {
            page_path: window.location.pathname,
          });
        `}
      </Script>

      {/* Google AdSense - Carrega com requestIdleCallback para máxima performance */}
      <Script id="adsense-loader" strategy="lazyOnload">
        {`
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              const script = document.createElement('script');
              script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8079361631746336';
              script.async = true;
              script.crossOrigin = 'anonymous';
              document.head.appendChild(script);
            });
          } else {
            setTimeout(() => {
              const script = document.createElement('script');
              script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8079361631746336';
              script.async = true;
              script.crossOrigin = 'anonymous';
              document.head.appendChild(script);
            }, 2000);
          }
        `}
      </Script>

      <Header />
      <main className="min-h-screen">
        {children}
      </main>
      <Footer />
    </>
  );
}
