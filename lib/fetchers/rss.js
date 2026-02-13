import Parser from 'rss-parser';

const parser = new Parser({ timeout: 10000 });

const FEEDS = [
  { url: 'https://olhardigital.com.br/feed/',         source_name: 'Olhar Digital', category_id: 1 },
  { url: 'https://canaltech.com.br/rss/',             source_name: 'Canaltech',     category_id: 1 },
  { url: 'https://tecnoblog.net/feed/',               source_name: 'Tecnoblog',     category_id: 1 },
  { url: 'https://www.tecmasters.com.br/feed/',       source_name: 'Tecmasters',    category_id: 1 },
  { url: 'https://www.showmetech.com.br/feed/',       source_name: 'Show Me Tech',  category_id: 1 },
];

export async function fetchFromRSS() {
  const results = [];

  for (const feed of FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url);
      const items = (parsed.items || []).slice(0, 15).map(item => ({
        title:       item.title || '',
        excerpt:     item.contentSnippet || item.summary || '',
        source_url:  item.link || item.guid || '',
        source_name: feed.source_name,
        category_id: feed.category_id,
      })).filter(i => i.title && i.source_url);

      results.push(...items);
    } catch (err) {
      console.warn(`[rss] Erro em ${feed.source_name}:`, err.message);
    }
  }

  return results;
}
