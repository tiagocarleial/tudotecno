import { getPosts } from '@/lib/posts';
import { getAllCategories } from '@/lib/categories';

const BASE_URL = 'https://tudotecno.vercel.app';

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

  const categories = await getAllCategories();
  const categoryPages = categories.map((cat) => ({
    url: `${BASE_URL}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  const { data: posts } = await getPosts({ page: 1, limit: 5000, status: 'published' });
  const postPages = posts.map((post) => ({
    url: `${BASE_URL}/post/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
