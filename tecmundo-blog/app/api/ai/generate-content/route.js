import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request) {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'sua_chave_aqui') {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY não configurada no .env.local' },
      { status: 500 }
    );
  }

  const { title, excerpt, source_url, category } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
  }

  const prompt = `Você é um redator de tecnologia brasileiro. Escreva um artigo completo em português do Brasil para o blog de tecnologia TudoTecno.

Título: ${title}
${excerpt ? `Resumo: ${excerpt}` : ''}
${category ? `Categoria: ${category}` : ''}
${source_url ? `Fonte: ${source_url}` : ''}

Instruções:
- Escreva entre 400 e 600 palavras
- Use parágrafos bem separados (linha em branco entre eles)
- Tom informativo, direto e acessível ao público geral
- Não use markdown (sem #, **, *, etc.) — apenas texto puro com parágrafos
- Não repita o título no início do texto
- Inclua contexto sobre o assunto, detalhes relevantes e uma conclusão
- Escreva apenas o corpo do artigo, sem introdução do tipo "Aqui está o artigo:"`;

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5-20251101',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const content = message.content[0]?.text || '';
    return NextResponse.json({ content });
  } catch (err) {
    console.error('[AI generate-content]', err);
    return NextResponse.json(
      { error: err.message || 'Erro ao gerar conteúdo' },
      { status: 500 }
    );
  }
}
