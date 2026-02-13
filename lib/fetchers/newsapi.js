import axios from 'axios';

// Maps NewsAPI article to our suggestion shape
function mapArticle(article, categoryId = 1) {
  return {
    title:       article.title || '',
    excerpt:     article.description || '',
    source_url:  article.url || '',
    source_name: article.source?.name || 'NewsAPI',
    category_id: categoryId,
  };
}

export async function fetchFromNewsAPI() {
  const key = process.env.NEWSAPI_KEY;
  if (!key || key === 'sua_chave_aqui') {
    console.log('[newsapi] Chave não configurada, pulando...');
    return [];
  }

  try {
    const res = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: { category: 'technology', language: 'pt', pageSize: 20, apiKey: key },
      timeout: 10000,
    });

    return (res.data?.articles || [])
      .filter(a => a.title && a.url && a.title !== '[Removed]')
      .map(a => mapArticle(a, 1));
  } catch (err) {
    console.warn('[newsapi] Erro:', err.message);
    return [];
  }
}
