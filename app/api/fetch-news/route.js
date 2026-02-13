import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/fetchers/index';

export async function POST() {
  try {
    const result = await fetchAllNews();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
