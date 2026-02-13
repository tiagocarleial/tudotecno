import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export async function POST(request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 });
  }

  const { title, category, content } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
  }

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const contentSnippet = content ? content.slice(0, 500) : '';

    const promptCompletion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Create a short image generation prompt in English (max 120 characters) for a tech blog article cover photo.
The image should be photorealistic, modern, high quality, suitable as a blog header.
Do NOT include text, logos or words in the image.

Article title: ${title}
${category ? `Category: ${category}` : ''}
${contentSnippet ? `Content snippet: ${contentSnippet}` : ''}

Reply with ONLY the image prompt, no explanations.`,
      }],
      max_tokens: 80,
    });

    const imagePrompt = promptCompletion.choices[0]?.message?.content?.trim() || title;

    const encodedPrompt = encodeURIComponent(imagePrompt);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=630&nologo=true&model=flux&seed=${Date.now()}`;

    return NextResponse.json({ image_url: imageUrl, prompt: imagePrompt });
  } catch (err) {
    console.error('[AI generate-image-ai]', err);
    return NextResponse.json({ error: err.message || 'Erro ao gerar imagem' }, { status: 500 });
  }
}
