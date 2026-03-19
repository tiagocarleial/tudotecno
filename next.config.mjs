/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otimizações de performance
  compress: true, // Compressão gzip
  poweredByHeader: false, // Remove header X-Powered-By

  // Otimizações adicionais
  reactStrictMode: true,

  // Otimizações de build
  experimental: {
    optimizePackageImports: ['date-fns', '@libsql/client'],
  },

  // Otimização de imagens
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: '**.imgur.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.imgix.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.glbimg.com',
      },
      {
        protocol: 'https',
        hostname: '**.globo.com',
      },
      {
        protocol: 'https',
        hostname: '**.uol.com.br',
      },
      {
        protocol: 'https',
        hostname: '**.gamevicio.com',
      },
      {
        protocol: 'https',
        hostname: '**.tecmundo.com.br',
      },
      {
        protocol: 'https',
        hostname: '**.olhardigital.com.br',
      },
      {
        protocol: 'https',
        hostname: '**.ibxk.com.br',
      },
    ],
    // Permitir dados URI para imagens base64
    unoptimized: false,
  },

  // Headers de segurança e performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      // Cache agressivo para assets estáticos
      {
        source: '/(.*)\\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2|ttf|eot|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      // Cache intermediário para páginas
      {
        source: '/((?!api).*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=600, stale-while-revalidate=86400'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
