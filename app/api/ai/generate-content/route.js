import { NextResponse } from 'next/server';
import { callLLMWithFallback } from '@/lib/ai-fallback';

export async function POST(request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY não configurada' },
      { status: 500 }
    );
  }

  const { title, excerpt, source_url, category } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
  }

  const prompt = `Você é um redator de tecnologia brasileiro especializado em criar conteúdo informativo e de alta qualidade para o blog TudoTecno.

Título: ${title}
${excerpt ? `Resumo: ${excerpt}` : ''}
${category ? `Categoria: ${category}` : ''}
${source_url ? `Fonte de referência: ${source_url}` : ''}

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

  try {
    const content = await callLLMWithFallback(prompt, { max_tokens: 3000 });
    return NextResponse.json({ content });
  } catch (err) {
    console.error('[AI generate-content]', err);
    return NextResponse.json(
      { error: err.message || 'Erro ao gerar conteúdo' },
      { status: 500 }
    );
  }
}
