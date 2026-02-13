import { NextResponse } from 'next/server';
import { getSuggestionById, updateSuggestionStatus } from '@/lib/suggestions';
import { createPost } from '@/lib/posts';
import { slugify } from '@/lib/slugify';

export async function POST(request, { params }) {
  try {
    const suggestion = getSuggestionById(parseInt(params.id));
    if (!suggestion) return NextResponse.json({ error: 'Sugestão não encontrada' }, { status: 404 });

    const body = await request.json().catch(() => ({}));

    // "Editar e Aprovar" flow: PostForm already created the post, just mark suggestion approved
    if (body._skip_create) {
      updateSuggestionStatus(parseInt(params.id), 'approved');
      return NextResponse.json({ success: true, suggestion_id: parseInt(params.id) });
    }

    // Plain "Aprovar" flow: create post from suggestion data
    const title       = body.title       || suggestion.title;
    const content     = body.content     || '';
    const excerpt     = body.excerpt     || suggestion.excerpt;
    const cover_image = body.cover_image || '';
    const category_id = body.category_id || suggestion.category_id || 1;
    const author      = body.author      || 'Redacao';
    const tags        = body.tags        || '';
    const status      = body.status      || 'draft';

    const slug = body.slug || slugify(title);

    const post = createPost({
      title, slug, content, excerpt, cover_image,
      category_id, status, source_url: suggestion.source_url, author, tags,
    });

    updateSuggestionStatus(parseInt(params.id), 'approved');

    return NextResponse.json({ post, suggestion_id: parseInt(params.id) });
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return NextResponse.json({ error: 'Slug já existe para este título' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
