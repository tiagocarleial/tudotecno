#!/usr/bin/env node
import { createClient } from '@libsql/client';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  url: process.env.DATABASE_URL || `file:${path.join(__dirname, '..', 'database.sqlite')}`,
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

async function migrateBase64Images() {
  console.log('🔍 Buscando posts com imagens base64...');

  const result = await client.execute({
    sql: `SELECT id, title, cover_image FROM posts WHERE cover_image LIKE 'data:image%'`,
    args: [],
  });

  const posts = result.rows;
  console.log(`📊 Encontrados ${posts.length} posts com imagens base64`);

  if (posts.length === 0) {
    console.log('✅ Nenhuma migração necessária!');
    return;
  }

  // Criar pasta se não existir
  const coversDir = path.join(__dirname, '..', 'public', 'images', 'covers');
  await fs.mkdir(coversDir, { recursive: true });

  let migrated = 0;
  let failed = 0;

  for (const post of posts) {
    try {
      console.log(`\n📝 Processando: ${post.title}`);

      // Extrair base64
      const base64Match = post.cover_image.match(/^data:image\/(\w+);base64,(.+)$/);
      if (!base64Match) {
        console.log(`  ⚠️  Formato inválido, pulando...`);
        failed++;
        continue;
      }

      const [, format, base64Data] = base64Match;
      const buffer = Buffer.from(base64Data, 'base64');

      // Gerar nome único
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const filename = `cover-${post.id}-${timestamp}-${randomString}.${format}`;
      const filepath = path.join(coversDir, filename);

      // Salvar arquivo
      await fs.writeFile(filepath, buffer);
      const imageUrl = `/images/covers/${filename}`;

      // Atualizar banco
      await client.execute({
        sql: `UPDATE posts SET cover_image = ? WHERE id = ?`,
        args: [imageUrl, post.id],
      });

      console.log(`  ✅ Salvo como: ${imageUrl}`);
      migrated++;

    } catch (error) {
      console.error(`  ❌ Erro ao processar post ${post.id}:`, error.message);
      failed++;
    }
  }

  console.log(`\n📊 Resumo:`);
  console.log(`  ✅ Migrados: ${migrated}`);
  console.log(`  ❌ Falhas: ${failed}`);
}

migrateBase64Images()
  .then(() => {
    console.log('\n✨ Migração concluída!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });
