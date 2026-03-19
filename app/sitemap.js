import { getAllPostsForSitemap } from '@/lib/posts';
import { getAllCategories } from '@/lib/categories';

const BASE_URL = 'https://www.tudotecno.com.br';

// Force dynamic: gera sitemap em runtime para evitar timeout no build
export const dynamic = 'force-dynamic';

// Revalida a cada 1 hora
export const revalidate = 3600;

export default async function sitemap() {
  const staticPages = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/busca`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    const categories = await getAllCategories();
    const categoryPages = categories.map((cat) => ({
      url: `${BASE_URL}/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    }));

    // Usa função sem cache otimizada para sitemap
    const posts = await getAllPostsForSitemap();
    const postPages = posts.map((post) => ({
      url: `${BASE_URL}/post/${post.slug}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    return [...staticPages, ...categoryPages, ...postPages];
  } catch (error) {
    console.error('[sitemap] Error generating sitemap:', error.message);
    // Fallback: retorna apenas páginas estáticas e categorias fixas
    const fallbackCategories = [
      'tecnologia', 'games', 'ciencia', 'internet', 'seguranca', 'mercado'
    ].map(slug => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    }));

    return [...staticPages, ...fallbackCategories];
  }
}
