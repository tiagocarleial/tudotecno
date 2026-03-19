import { NextResponse } from 'next/server';
import { getPostsByCategory } from '@/lib/posts';
import { getCategoryBySlug } from '@/lib/categories';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const category = await getCategoryBySlug(slug);
    if (!category) return NextResponse.json({ error: 'Categoria não encontrada' }, { status: 404 });

    const result = await getPostsByCategory(slug, { page, limit });
    return NextResponse.json({ ...result, category });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
