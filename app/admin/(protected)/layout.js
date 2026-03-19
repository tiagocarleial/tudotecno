import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createHmac } from 'crypto';
import AdminSidebar from '@/components/admin/AdminSidebar';

function verifySession(cookieValue) {
  if (!cookieValue) return false;
  const [value, sig] = (cookieValue || '').split('.');
  if (value !== 'authenticated') return false;
  const secret = process.env.COOKIE_SECRET || 'dev-secret';
  const expected = createHmac('sha256', secret).update(value).digest('hex');
  return sig === expected;
}

export const metadata = { title: 'Admin — TudoTecno' };

export default async function ProtectedLayout({ children }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  if (!verifySession(session)) {
    redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
