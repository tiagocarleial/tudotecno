/**
 * Script para aplicar otimizações no banco de dados existente
 * Executa: node --env-file=.env.local scripts/optimize-database.js
 * ou: NODE_OPTIONS="--env-file=.env.local" node scripts/optimize-database.js
 */

import { createClient } from '@libsql/client';

async function optimizeDatabase() {
  console.log('🔧 Iniciando otimização do banco de dados...\n');

  // Criar cliente diretamente para evitar problemas com env loading
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:database.sqlite',
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // 1. Criar novos índices compostos (se não existirem)
    console.log('📊 Criando índices compostos...');

    const indices = [
      {
        name: 'idx_posts_status_published_at',
        sql: 'CREATE INDEX IF NOT EXISTS idx_posts_status_published_at ON posts(status, published_at DESC)',
        desc: 'Query: WHERE status = ? ORDER BY published_at DESC'
      },
      {
        name: 'idx_posts_category_status_published',
        sql: 'CREATE INDEX IF NOT EXISTS idx_posts_category_status_published ON posts(category_id, status, published_at DESC)',
        desc: 'Query: WHERE category_id = ? AND status = ? ORDER BY published_at DESC'
      },
      {
        name: 'idx_posts_published_created',
        sql: 'CREATE INDEX IF NOT EXISTS idx_posts_published_created ON posts(published_at DESC, created_at DESC)',
        desc: 'Query: ORDER BY published_at DESC, created_at DESC'
      },
      {
        name: 'idx_suggestions_status_fetched',
        sql: 'CREATE INDEX IF NOT EXISTS idx_suggestions_status_fetched ON suggestions(status, fetched_at DESC)',
        desc: 'Query: WHERE status = ? ORDER BY fetched_at DESC'
      },
    ];

    for (const index of indices) {
      try {
        await client.execute(index.sql);
        console.log(`  ✅ ${index.name}`);
        console.log(`     → ${index.desc}`);
      } catch (err) {
        console.error(`  ❌ Erro ao criar ${index.name}:`, err.message);
      }
    }

    // 2. Analisar tabelas para otimizar query planner
    console.log('\n📈 Analisando tabelas...');
    try {
      await client.execute('ANALYZE posts');
      await client.execute('ANALYZE categories');
      await client.execute('ANALYZE suggestions');
      console.log('  ✅ Análise completa');
    } catch (err) {
      console.error('  ⚠️  Aviso:', err.message);
    }

    // 3. Verificar estatísticas
    console.log('\n📊 Estatísticas do banco:');

    const stats = await client.execute(`
      SELECT
        (SELECT COUNT(*) FROM posts) as total_posts,
        (SELECT COUNT(*) FROM posts WHERE status = 'published') as published_posts,
        (SELECT COUNT(*) FROM categories) as total_categories,
        (SELECT COUNT(*) FROM suggestions) as total_suggestions
    `);

    console.log('  Posts totais:', stats.rows[0].total_posts);
    console.log('  Posts publicados:', stats.rows[0].published_posts);
    console.log('  Categorias:', stats.rows[0].total_categories);
    console.log('  Sugestões:', stats.rows[0].total_suggestions);

    // 4. Listar todos os índices criados
    console.log('\n📋 Índices ativos:');
    const indexes = await client.execute(`
      SELECT name, tbl_name
      FROM sqlite_master
      WHERE type = 'index' AND tbl_name IN ('posts', 'categories', 'suggestions')
      ORDER BY tbl_name, name
    `);

    indexes.rows.forEach(idx => {
      console.log(`  - ${idx.name} (${idx.tbl_name})`);
    });

    console.log('\n✅ Otimização concluída com sucesso!');
    console.log('\n💡 Dica: Execute este script sempre que atualizar o schema\n');

  } catch (error) {
    console.error('\n❌ Erro durante otimização:', error);
    process.exit(1);
  } finally {
    client.close();
  }
}

// Executar
optimizeDatabase()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Erro fatal:', err);
    process.exit(1);
  });
