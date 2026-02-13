import { NextResponse } from 'next/server';
import { getSuggestionById, updateSuggestionStatus } from '@/lib/suggestions';

export async function POST(request, { params }) {
  try {
    const suggestion = await getSuggestionById(parseInt(params.id));
    if (!suggestion) return NextResponse.json({ error: 'Sugestão não encontrada' }, { status: 404 });

    await updateSuggestionStatus(parseInt(params.id), 'rejected');
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
