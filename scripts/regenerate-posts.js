#!/usr/bin/env node

import Groq from 'groq-sdk';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
config({ path: join(__dirname, '..', '.env.local') });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:database.sqlite',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function regeneratePost(post) {
  const prompt = `Você é um redator de tecnologia brasileiro especializado em criar conteúdo informativo e de alta qualidade para o blog TudoTecno.

Título: ${post.title}
${post.excerpt ? `Resumo: ${post.excerpt}` : ''}
${post.category_name ? `Categoria: ${post.category_name}` : ''}
${post.source_url ? `Fonte de referência: ${post.source_url}` : ''}

IMPORTANTE - Instruções obrigatórias:
- Escreva um artigo COMPLETO com 800 a 1200 palavras (mínimo absoluto: 800 palavras)
- Estruture o artigo em pelo menos 8-12 parágrafos bem desenvolvidos
- Use parágrafos bem separados (linha em branco entre eles)
- Tom informativo, direto e acessível ao público geral brasileiro

Estrutura obrigatória:
1. INTRODUÇÃO (2-3 parágrafos): Apresente o tema, contextualize e explique por que é relevante
2. DESENVOLVIMENTO (5-7 parágrafos):
   - Detalhe os principais pontos do assunto
   - Inclua informações técnicas quando relevante
   - Explique impactos, benefícios ou consequências
   - Use exemplos práticos quando possível
   - Adicione dados, estatísticas ou fatos interessantes
3. CONTEXTO ADICIONAL (2-3 parágrafos): Histórico, comparações, tendências futuras
4. CONCLUSÃO (1-2 parágrafos): Resumo dos pontos principais e perspectivas

Regras de formatação:
- NÃO use markdown (sem #, **, *, etc.) — apenas texto puro com parágrafos
- NÃO repita o título no início do texto
- NÃO escreva introduções como "Aqui está o artigo:" ou similares
- Escreva APENAS o corpo do artigo
- Cada parágrafo deve ter no mínimo 3-5 linhas
- Use linguagem natural e fluida

Lembre-se: O artigo DEVE ter no mínimo 800 palavras para atender aos padrões de qualidade do site.`;

  const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 3000,
  });

  return completion.choices[0]?.message?.content || '';
}

async function main() {
  if (!process.env.GROQ_API_KEY) {
    console.error('❌ GROQ_API_KEY não configurada no arquivo .env.local');
    process.exit(1);
  }

  console.log('🔍 Buscando posts que precisam de regeneração...\n');

  const result = await db.execute(`
    SELECT * FROM posts
    WHERE status = 'draft'
    AND (content IS NULL OR LENGTH(content) < 500)
    ORDER BY id
  `);
  const posts = result.rows;

  if (posts.length === 0) {
    console.log('✅ Nenhum post necessita regeneração.');
    return;
  }

  console.log(`📝 Encontrados ${posts.length} posts para regenerar.\n`);

  const results = [];

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    console.log(`[${i + 1}/${posts.length}] Regenerando: "${post.title}"`);

    try {
      const content = await regeneratePost(post);
      const wordCount = content.split(/\s+/).length;

      // Atualizar post no banco
      await db.execute({
        sql: 'UPDATE posts SET content = ? WHERE id = ?',
        args: [content, post.id]
      });

      console.log(`   ✅ Sucesso! ${content.length} caracteres, ~${wordCount} palavras\n`);

      results.push({
        id: post.id,
        title: post.title,
        success: true,
        contentLength: content.length,
        wordCount
      });

      // Aguardar 2 segundos entre requisições para evitar rate limit
      if (i < posts.length - 1) {
        console.log('   ⏳ Aguardando 2 segundos...\n');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

    } catch (err) {
      console.error(`   ❌ Erro: ${err.message}\n`);
      results.push({
        id: post.id,
        title: post.title,
        success: false,
        error: err.message
      });
    }
  }

  // Resumo
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESUMO DA REGENERAÇÃO\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Sucesso: ${successful.length}`);
  console.log(`❌ Falhas: ${failed.length}`);

  if (successful.length > 0) {
    const avgWords = Math.round(
      successful.reduce((sum, r) => sum + r.wordCount, 0) / successful.length
    );
    console.log(`📝 Média de palavras: ${avgWords}`);
  }

  console.log('\n' + '='.repeat(70));
}

main().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
