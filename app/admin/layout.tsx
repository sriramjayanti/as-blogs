import { getAdminSession } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If unauthenticated (e.g. on /admin/login), render full-screen without admin navigation shell
  if (!session) {
    return <div className="min-h-screen bg-stone-950 text-stone-100">{children}</div>;
  }

  // Authenticated Admin Shell
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col md:flex-row">
      {/* Responsive Navigation Shell */}
      <AdminNav />

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-7xl w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
