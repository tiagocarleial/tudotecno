#!/usr/bin/env node

/**
 * Script de teste para auto-publicação de posts
 *
 * Uso:
 *   node scripts/test-auto-publish.js [maxPosts]
 *
 * Exemplos:
 *   node scripts/test-auto-publish.js       # Processa até 8 posts (padrão)
 *   node scripts/test-auto-publish.js 2     # Processa até 2 posts
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const MAX_POSTS = parseInt(process.argv[2]) || 8;
const CRON_SECRET = process.env.CRON_SECRET;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

if (!CRON_SECRET) {
  console.error('❌ CRON_SECRET não está configurado no .env.local');
  process.exit(1);
}

console.log(`🚀 Testando auto-publicação de posts (máximo: ${MAX_POSTS})`);
console.log(`📡 URL: ${BASE_URL}/api/auto-publish`);
console.log('');

async function runTest() {
  try {
    const url = `${BASE_URL}/api/auto-publish?token=${CRON_SECRET}`;

    console.log('⏳ Enviando requisição...\n');

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ maxPosts: MAX_POSTS }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ Erro na requisição:', data);
      process.exit(1);
    }

    console.log('✅ Processamento concluído!\n');
    console.log('📊 Resumo:');
    console.log(`   • Posts processados: ${data.processed}`);
    console.log(`   • Sucessos: ${data.successful}`);
    console.log(`   • Falhas: ${data.failed}`);
    console.log('');

    if (data.results && data.results.length > 0) {
      console.log('📝 Detalhes dos posts processados:\n');

      data.results.forEach((result, index) => {
        const icon = result.status === 'success' ? '✅' : '❌';
        console.log(`${icon} Post ${index + 1}: ${result.title}`);
        console.log(`   ID da sugestão: ${result.suggestion_id}`);

        if (result.status === 'success') {
          console.log(`   ID do post criado: ${result.post_id}`);
          console.log(`   Slug: ${result.post_slug}`);
          console.log(`   URL: ${BASE_URL}/post/${result.post_slug}`);

          // Show steps
          const steps = result.steps.filter(s => s.status === 'completed');
          console.log(`   Passos completados: ${steps.length}`);
        } else {
          console.log(`   ❌ Erro: ${result.error}`);
        }
        console.log('');
      });
    }

    if (data.successful > 0) {
      console.log(`\n🎉 ${data.successful} post(s) publicado(s) com sucesso!`);
      console.log(`\n🌐 Acesse: ${BASE_URL}/admin para ver os posts`);
    }

  } catch (err) {
    console.error('❌ Erro ao executar teste:', err.message);
    process.exit(1);
  }
}

runTest();
