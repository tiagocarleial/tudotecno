import { fetchFromNewsAPI } from './newsapi.js';
import { fetchFromGNews }   from './gnews.js';
import { fetchFromRSS }     from './rss.js';
import { isDuplicate, getRecentSuggestionTitles } from './deduplication.js';
import { createSuggestion } from '../suggestions.js';

export async function fetchAllNews() {
  console.log('[fetcher] Iniciando busca de notícias...');

  const [newsapiResult, gnewsResult, rssResult] = await Promise.allSettled([
    fetchFromNewsAPI(),
    fetchFromGNews(),
    fetchFromRSS(),
  ]);

  const all = [
    ...(newsapiResult.status === 'fulfilled' ? newsapiResult.value : []),
    ...(gnewsResult.status  === 'fulfilled' ? gnewsResult.value  : []),
    ...(rssResult.status    === 'fulfilled' ? rssResult.value    : []),
  ];

  console.log(`[fetcher] Total coletado: ${all.length} artigos`);

  const recentTitles = getRecentSuggestionTitles(200);
  let inserted = 0;
  let skipped = 0;

  for (const item of all) {
    if (!item.title || !item.source_url) { skipped++; continue; }
    if (isDuplicate(item, recentTitles)) { skipped++; continue; }

    try {
      createSuggestion(item);
      recentTitles.push(item.title);
      inserted++;
    } catch (err) {
      console.warn('[fetcher] Erro ao inserir sugestão:', err.message);
      skipped++;
    }
  }

  console.log(`[fetcher] Inseridas: ${inserted}, Ignoradas: ${skipped}`);
  return { total: all.length, inserted, skipped };
}
