import { NextResponse } from 'next/server';
import { getPosts, createPost } from '@/lib/posts';
import { slugify } from '@/lib/slugify';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const status = searchParams.get('status') || undefined;
    const categoryId = searchParams.get('categoryId') ? parseInt(searchParams.get('categoryId')) : undefined;

    const result = getPosts({ page, limit, status, categoryId });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, content, excerpt, cover_image, category_id, status, source_url, author, tags } = body;

    if (!title || !category_id) {
      return NextResponse.json({ error: 'title e category_id são obrigatórios' }, { status: 400 });
    }

    const slug = body.slug || slugify(title);
    const post = createPost({ title, slug, content, excerpt, cover_image, category_id, status, source_url, author, tags });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    if (err.message?.includes('UNIQUE')) {
      return NextResponse.json({ error: 'Slug já existe, tente outro título' }, { status: 409 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
