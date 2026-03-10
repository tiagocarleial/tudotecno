import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import Groq from 'groq-sdk';

export async function POST(request) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'postId é obrigatório' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const db = getDb();

    // Buscar post
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(postId);

    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }

    // Gerar novo conteúdo
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

    const content = completion.choices[0]?.message?.content || '';

    // Atualizar post com novo conteúdo
    db.prepare('UPDATE posts SET content = ? WHERE id = ?')
      .run(content, postId);

    return NextResponse.json({
      success: true,
      postId,
      contentLength: content.length,
      wordCount: content.split(/\s+/).length
    });

  } catch (err) {
    console.error('[regenerate-content]', err);
    return NextResponse.json(
      { error: err.message || 'Erro ao regenerar conteúdo' },
      { status: 500 }
    );
  }
}

// Rota para regenerar conteúdo de todos os posts em draft
export async function GET() {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const db = getDb();

    // Buscar todos os posts em draft com conteúdo vazio ou curto
    const posts = db.prepare(
      'SELECT * FROM posts WHERE status = ? AND (content IS NULL OR LENGTH(content) < 500) LIMIT 10'
    ).all('draft');

    if (posts.length === 0) {
      return NextResponse.json({
        message: 'Nenhum post necessita regeneração',
        total: 0
      });
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const results = [];

    for (const post of posts) {
      try {
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

        const completion = await client.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 3000,
        });

        const content = completion.choices[0]?.message?.content || '';

        // Atualizar post
        db.prepare('UPDATE posts SET content = ? WHERE id = ?')
          .run(content, post.id);

        results.push({
          id: post.id,
          title: post.title,
          success: true,
          contentLength: content.length,
          wordCount: content.split(/\s+/).length
        });

        // Aguardar 2 segundos entre requisições para evitar rate limit
        await new Promise(resolve => setTimeout(resolve, 2000));

      } catch (err) {
        results.push({
          id: post.id,
          title: post.title,
          success: false,
          error: err.message
        });
      }
    }

    return NextResponse.json({
      total: posts.length,
      results
    });

  } catch (err) {
    console.error('[regenerate-content GET]', err);
    return NextResponse.json(
      { error: err.message || 'Erro ao regenerar conteúdos' },
      { status: 500 }
    );
  }
}
