import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 });
  }

  const { title, category } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
  }

  const prompt = `Você é um editor de um blog de tecnologia brasileiro chamado TudoTecno.

Escreva um resumo curto e atraente para o artigo abaixo. O resumo deve ter no máximo 280 caracteres, ser direto e despertar curiosidade no leitor.

Título: ${title}
${category ? `Categoria: ${category}` : ''}

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
