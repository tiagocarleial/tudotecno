import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'GEMINI_API_KEY não configurada' },
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
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(prompt);
    const content = result.response.text();

    return NextResponse.json({ content });
  } catch (err) {
    console.error('[AI generate-content]', err);
    return NextResponse.json(
      { error: err.message || 'Erro ao gerar conteúdo' },
      { status: 500 }
    );
  }
}
