import { NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost } from '@/lib/posts';

export async function GET(request, { params }) {
  try {
    const post = getPostById(parseInt(params.id));
    if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const body = await request.json();
    const post = updatePost(parseInt(params.id), body);
    if (!post) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const result = deletePost(parseInt(params.id));
    if (result.changes === 0) return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
