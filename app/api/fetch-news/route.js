import { NextResponse } from 'next/server';
import { fetchAllNews } from '@/lib/fetchers/index';

async function handler() {
  try {
    const result = await fetchAllNews();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export const POST = handler;
export const GET = handler;
