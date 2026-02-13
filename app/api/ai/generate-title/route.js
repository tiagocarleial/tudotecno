import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 });
  }

  const { title, excerpt, category } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Título atual é obrigatório' }, { status: 400 });
  }

  const prompt = `Você é um editor de um blog de tecnologia brasileiro chamado TudoTecno.

Com base nas informações abaixo, crie um título novo, original e atraente para o artigo. O título deve ser diferente do original, mas cobrir o mesmo assunto. Deve ser direto, informativo e chamar atenção do leitor.

Título atual: ${title}
${excerpt ? `Resumo: ${excerpt}` : ''}
${category ? `Categoria: ${category}` : ''}

Responda APENAS com o novo título, sem aspas, sem explicações, sem pontuação final.`;

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 100,
    });

    const newTitle = completion.choices[0]?.message?.content?.trim() || '';
    return NextResponse.json({ title: newTitle });
  } catch (err) {
    console.error('[AI generate-title]', err);
    return NextResponse.json({ error: err.message || 'Erro ao gerar título' }, { status: 500 });
  }
}
