import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  ShoppingBag,
  Megaphone,
  BarChart3,
  Globe,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-stone-950 border-r border-stone-800 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="pb-4 border-b border-stone-800">
            <div className="flex items-center gap-2 text-gold-400 font-serif font-bold text-lg">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
              <span>A.S. Editorial CMS</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-stone-400 mt-1 font-mono">
              v1.0 • SEO & Promo Engine
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-800/80 text-stone-300 hover:text-white transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-gold-500" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/admin/articles"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-800/80 text-stone-300 hover:text-white transition-colors"
            >
              <FileText className="w-4 h-4 text-forest-400" />
              <span>Articles & SEO</span>
            </Link>

            <Link
              href="/admin/rules"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-800/80 text-stone-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Contextual Rules</span>
            </Link>

            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-800/80 text-stone-300 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Products & Links</span>
            </Link>

            <Link
              href="/admin/analytics"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-stone-800/80 text-stone-300 hover:text-white transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span>Analytics & UTM</span>
            </Link>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="pt-6 border-t border-stone-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-xs text-stone-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-gold-400" /> Live Magazine
            </span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-lg hover:bg-red-950/40 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto max-w-7xl">
        {children}
      </main>
    </div>
  );
}
