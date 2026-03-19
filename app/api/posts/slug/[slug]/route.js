import { NextResponse } from 'next/server';
import { getPostBySlug } from '@/lib/posts';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post || post.status !== 'published') {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
