import AdminNav from '@/components/admin/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col md:flex-row">
      {/* Responsive Navigation Shell (Sticky Mobile Header + Drawer on mobile, Persistent Sidebar on desktop) */}
      <AdminNav />

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 overflow-y-auto max-w-7xl w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
