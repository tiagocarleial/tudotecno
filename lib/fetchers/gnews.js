import axios from 'axios';

function mapArticle(article, categoryId = 1) {
  return {
    title:       article.title || '',
    excerpt:     article.description || '',
    source_url:  article.url || '',
    source_name: article.source?.name || 'GNews',
    category_id: categoryId,
  };
}

// Category mapping: GNews topic → our category_id
const TOPIC_CATEGORY_MAP = {
  technology: 1, // Tecnologia
  science:    3, // Ciência
  business:   6, // Mercado
};

export async function fetchFromGNews() {
  const key = process.env.GNEWS_API_KEY;
  if (!key || key === 'sua_chave_aqui') {
    console.log('[gnews] Chave não configurada, pulando...');
    return [];
  }

  const results = [];

  for (const [topic, categoryId] of Object.entries(TOPIC_CATEGORY_MAP)) {
    try {
      const res = await axios.get('https://gnews.io/api/v4/top-headlines', {
        params: { category: topic, lang: 'pt', country: 'br', max: 10, apikey: key },
        timeout: 10000,
      });

      const articles = (res.data?.articles || [])
        .filter(a => a.title && a.url)
        .map(a => mapArticle(a, categoryId));

      results.push(...articles);
    } catch (err) {
      console.warn(`[gnews] Erro no tópico ${topic}:`, err.message);
    }
  }

  return results;
}
