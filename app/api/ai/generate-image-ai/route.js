import Groq from 'groq-sdk';
import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function POST(request) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'GROQ_API_KEY não configurada' }, { status: 500 });
  }
  if (!process.env.HF_TOKEN) {
    return NextResponse.json({ error: 'HF_TOKEN não configurado' }, { status: 500 });
  }

  const { title, category, content } = await request.json();

  if (!title) {
    return NextResponse.json({ error: 'Título é obrigatório' }, { status: 400 });
  }

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const contentSnippet = content ? content.slice(0, 500) : '';

    // Generate a clean image prompt in English
    const promptCompletion = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Create a short image generation prompt in English (max 100 characters, no quotes) for a tech blog article cover photo.
Photorealistic, modern, high quality, suitable as a blog header. No text or logos in the image.

Article title: ${title}
${category ? `Category: ${category}` : ''}
${contentSnippet ? `Content: ${contentSnippet}` : ''}

Reply with ONLY the prompt, no quotes, no explanations.`,
      }],
      max_tokens: 60,
    });

    const imagePrompt = (promptCompletion.choices[0]?.message?.content?.trim() || title)
      .replace(/^["']+|["']+$/g, '')
      .replace(/["']/g, '')
      .trim();

    // Call Hugging Face FLUX.1-schnell
    const hfRes = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: imagePrompt,
          parameters: { width: 1024, height: 576 },
        }),
        signal: AbortSignal.timeout(50000),
      }
    );

    if (!hfRes.ok) {
      const errText = await hfRes.text();
      console.error('[HF error]', hfRes.status, errText);
      return NextResponse.json(
        { error: `Erro ao gerar imagem (${hfRes.status})` },
        { status: 500 }
      );
    }

    const buffer = await hfRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const contentType = hfRes.headers.get('content-type') || 'image/jpeg';
    const dataUrl = `data:${contentType};base64,${base64}`;

    return NextResponse.json({ image_url: dataUrl, prompt: imagePrompt });
  } catch (err) {
    console.error('[AI generate-image-ai]', err);
    return NextResponse.json({ error: err.message || 'Erro ao gerar imagem' }, { status: 500 });
  }
}
