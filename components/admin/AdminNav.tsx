'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  ShoppingBag,
  BarChart3,
  Globe,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Menu,
  X,
  Plus,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    iconColor: 'text-gold-500',
  },
  {
    label: 'Articles & SEO',
    href: '/admin/articles',
    icon: FileText,
    iconColor: 'text-forest-400',
  },
  {
    label: 'Contextual Rules',
    href: '/admin/rules',
    icon: Sparkles,
    iconColor: 'text-amber-400',
  },
  {
    label: 'Products & Links',
    href: '/admin/products',
    icon: ShoppingBag,
    iconColor: 'text-emerald-400',
  },
  {
    label: 'Analytics & UTM',
    href: '/admin/analytics',
    icon: BarChart3,
    iconColor: 'text-cyan-400',
  },
];

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const currentNav = NAV_ITEMS.find((item) =>
    item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
  );

  return (
    <>
      {/* 1. Mobile Top App Bar (visible on < md) */}
      <header className="md:hidden sticky top-0 z-40 bg-stone-950/95 backdrop-blur-md border-b border-stone-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 -ml-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            aria-label="Open administration menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gold-400" />
            <span className="font-serif font-bold text-sm text-stone-100 tracking-tight">
              A.S. Editorial CMS
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {currentNav && (
            <span className="hidden xs:inline-block text-[11px] font-mono text-gold-400 bg-stone-900 border border-stone-800 px-2.5 py-1 rounded-full">
              {currentNav.label}
            </span>
          )}

          <Link
            href="/admin/articles/new"
            className="p-2 bg-gold-500 hover:bg-gold-400 text-stone-950 rounded-xl transition-colors shadow-sm"
            title="Publish New Article"
            aria-label="Publish New Article"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </header>

      {/* 2. Mobile Drawer Backdrop & Slide-out (visible on < md when isOpen) */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-stone-950 border-r border-stone-800 h-full p-5 flex flex-col justify-between z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <div>
                  <div className="flex items-center gap-2 text-gold-400 font-serif font-bold text-base">
                    <ShieldCheck className="w-5 h-5 text-gold-400" />
                    <span>A.S. Editorial CMS</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 mt-0.5 font-mono">
                    SEO & Promotion Engine
                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5 text-sm font-medium">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === '/admin'
                      ? pathname === '/admin'
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all ${
                        isActive
                          ? 'bg-stone-800 text-white font-semibold shadow-inner border border-stone-700/80'
                          : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${item.iconColor}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions in Drawer */}
            <div className="pt-4 border-t border-stone-800 space-y-2">
              <Link
                href="/"
                target="_blank"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-xs text-stone-300 hover:text-white transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gold-400" /> View Live Magazine
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Link>

              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl hover:bg-red-950/40 text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Desktop Persistent Sidebar (visible on md:) */}
      <aside className="hidden md:flex w-64 bg-stone-950 border-r border-stone-800 p-5 flex-col justify-between shrink-0 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="pb-4 border-b border-stone-800">
            <Link href="/admin" className="flex items-center gap-2 text-gold-400 font-serif font-bold text-lg">
              <ShieldCheck className="w-5 h-5 text-gold-400" />
              <span>A.S. Editorial CMS</span>
            </Link>
            <div className="text-[10px] uppercase tracking-wider text-stone-400 mt-1 font-mono">
              v1.0 • SEO & Promo Engine
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="space-y-1.5 text-sm font-medium">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? 'bg-stone-800 text-white font-semibold border border-stone-700/80'
                      : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.iconColor}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
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
    </>
  );
}
