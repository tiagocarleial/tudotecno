import cron from 'node-cron';
import { fetchAllNews } from '../lib/fetchers/index.js';

export function startScheduler() {
  // Run every 2 hours at minute 0
  cron.schedule('0 */2 * * *', async () => {
    console.log(`[cron] Disparando busca de notícias em ${new Date().toISOString()}`);
    try {
      const result = await fetchAllNews();
      console.log(`[cron] Concluído: ${result.inserted} novas sugestões, ${result.skipped} ignoradas`);
    } catch (err) {
      console.error('[cron] Erro na busca de notícias:', err.message);
    }
  });

  console.log('[cron] Agendador iniciado — busca a cada 2 horas');
}
