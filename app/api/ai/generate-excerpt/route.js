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
  const contentSnippet = content ? content.slice(0, 3000) : '';

  const prompt = `Você é um editor de um blog de tecnologia brasileiro chamado TudoTecno.

Leia o artigo abaixo e escreva um resumo com entre 300 e 1000 caracteres. Ajuste o tamanho conforme a riqueza e complexidade do conteúdo: artigos simples podem ter resumos mais curtos (próximos de 300), enquanto artigos densos ou com muitos detalhes relevantes podem chegar até 1000 caracteres.

Regras obrigatórias:
- Mencione nomes específicos presentes no artigo (empresas, produtos, marcas, modelos, apps, etc.)
- Inclua detalhes concretos e relevantes do conteúdo
- Seja direto e informativo, como um lead jornalístico
- NÃO comece com "Saiba como", "Veja como", "Descubra", "Aprenda" — vá direto ao ponto
- NÃO inclua "O post apareceu primeiro em" nem rodapé de RSS

Título: ${title}
${category ? `Categoria: ${category}` : ''}
${contentSnippet ? `\nConteúdo do artigo:\n${contentSnippet}` : ''}

Responda APENAS com o texto do resumo, sem aspas, sem explicações.`;

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
    });

    const excerpt = completion.choices[0]?.message?.content?.trim() || '';
    return NextResponse.json({ excerpt });
  } catch (err) {
    console.error('[AI generate-excerpt]', err);
    return NextResponse.json({ error: err.message || 'Erro ao gerar resumo' }, { status: 500 });
  }
}
