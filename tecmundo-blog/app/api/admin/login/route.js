import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

function signValue(value) {
  const secret = process.env.COOKIE_SECRET || 'dev-secret';
  return createHmac('sha256', secret).update(value).digest('hex');
}

export function verifySession(cookieValue) {
  if (!cookieValue) return false;
  const [value, sig] = cookieValue.split('.');
  return sig === signValue(value) && value === 'authenticated';
}

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

    const value = 'authenticated';
    const sig = signValue(value);
    const cookieValue = `${value}.${sig}`;

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', cookieValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  return response;
}
