import { NextResponse } from 'next/server';
import { getCategoriesWithPostCount } from '@/lib/categories';

export async function GET() {
  try {
    const categories = getCategoriesWithPostCount();
    return NextResponse.json(categories);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
