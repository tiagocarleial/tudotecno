import { NextResponse } from 'next/server';

export async function POST(request) {
  const { source_url, title } = await request.json();

  if (!source_url) {
    return NextResponse.json({ error: 'source_url é obrigatório' }, { status: 400 });
  }

  try {
    const res = await fetch(source_url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TudoTecno/1.0)',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Não foi possível acessar a URL (${res.status})` }, { status: 400 });
    }

    const html = await res.text();

    // Try og:image first, then twitter:image, then first <img> with a full URL
    const patterns = [
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
      /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match?.[1] && match[1].startsWith('http')) {
        return NextResponse.json({ image_url: match[1] });
      }
    }

    return NextResponse.json({ error: 'Nenhuma imagem encontrada na fonte' }, { status: 404 });
  } catch (err) {
    if (err.name === 'TimeoutError') {
      return NextResponse.json({ error: 'A fonte demorou demais para responder' }, { status: 408 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
