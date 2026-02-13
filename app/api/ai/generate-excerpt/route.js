import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 });
  }

  const { title, content, category } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
  }

  // Truncate content to avoid token limits
  const contentSnippet = content ? content.slice(0, 1500) : '';

  const prompt = `Você é um editor de um blog de tecnologia brasileiro chamado TudoTecno.

Leia o artigo abaixo e escreva um resumo com no máximo 280 caracteres.

Regras obrigatórias:
- Mencione nomes específicos presentes no artigo (empresas, produtos, marcas, bancos, apps, etc.)
- Inclua o benefício ou ação principal do artigo
- Seja direto e informativo, como um lead jornalístico
- NÃO use frases genéricas como "Saiba como", "Veja como", "Descubra" — vá direto ao ponto
- NÃO inclua "O post apareceu primeiro em" nem nenhum rodapé de RSS

Título: ${title}
${category ? `Categoria: ${category}` : ''}
${contentSnippet ? `\nConteúdo do artigo:\n${contentSnippet}` : ''}

Responda APENAS com o texto do resumo, sem aspas, sem explicações.`;

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 120,
    });

    const excerpt = completion.choices[0]?.message?.content?.trim() || '';
    return NextResponse.json({ excerpt });
  } catch (err) {
    console.error('[AI generate-excerpt]', err);
    return NextResponse.json({ error: err.message || 'Erro ao gerar resumo' }, { status: 500 });
  }
}
