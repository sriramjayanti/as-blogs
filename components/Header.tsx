'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
  Flame,
  ShieldCheck,
  BookOpen,
  Utensils,
  HeartPulse,
  Sparkles,
  Sprout,
  Compass,
} from 'lucide-react';
import SearchModal from './SearchModal';

const NAV_CATEGORIES = [
  { name: 'Food & Cooking', slug: 'food', icon: Utensils },
  { name: 'Heirloom Recipes', slug: 'recipes', icon: BookOpen },
  { name: 'Health & Wellness', slug: 'health', icon: HeartPulse },
  { name: 'Culture & Deepam', slug: 'culture', icon: Sparkles },
  { name: 'Agriculture & Science', slug: 'agriculture', icon: Sprout },
  { name: 'Guides', slug: 'guides', icon: Compass },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Completely hide public customer header on admin routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      {/* 1. Top Editorial Ticker Bar */}
      <div className="bg-forest-950 text-stone-300 text-xs py-1.5 px-3 sm:px-4 border-b border-forest-900">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="font-medium text-stone-400 shrink-0 text-[11px] sm:text-xs">
              {currentDate}
            </span>
            <span className="hidden sm:inline text-forest-700">•</span>
            <div className="hidden md:flex items-center gap-2 text-stone-300">
              <span className="inline-flex items-center text-gold-400 font-semibold uppercase tracking-wider text-[10px] bg-gold-950/60 px-2 py-0.5 rounded border border-gold-800/40">
                <Flame className="w-3 h-3 mr-1 text-gold-400" /> Trending
              </span>
              <span className="text-stone-300 truncate max-w-md">
                Cold-Pressed Sesame Smoke Points & Pancha Thailam Deepam Traditions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] sm:text-xs shrink-0">
            <Link
              href="/products"
              className="text-gold-400 hover:text-gold-300 flex items-center gap-1 font-medium transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Verified</span> A.S. Brand
            </Link>
            <span className="text-forest-800">|</span>
            <Link href="/admin" className="text-stone-400 hover:text-stone-200 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Masthead Header */}
      <header className="bg-cream-50/95 border-b border-cream-200 sticky top-0 z-30 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 sm:py-4 md:py-6 flex items-center justify-between gap-2 border-b border-cream-200/70">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2.5 -ml-2.5 text-forest-950 hover:text-forest-700 rounded-xl hover:bg-cream-200/60 transition-colors cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6 stroke-[2.5]" />
            </button>

            {/* Publication Logo / Masthead */}
            <div className="text-center mx-auto lg:mx-0 flex-1 lg:flex-initial">
              <Link href="/" className="inline-block group">
                <div className="font-serif text-lg xs:text-xl sm:text-3xl md:text-4xl font-bold tracking-tight text-forest-950 group-hover:text-forest-800 transition-colors">
                  A.S. HERITAGE & LIVING
                </div>
                <div className="text-[9px] xs:text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.25em] text-forest-700/80 font-medium mt-0.5">
                  Culinary Heritage • Wellness • Traditional Culture
                </div>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-1.5 sm:gap-2 bg-cream-100 hover:bg-cream-200 text-stone-600 px-3 py-2 rounded-full border border-cream-300 text-xs sm:text-sm transition-all hover:shadow-sm"
                aria-label="Search articles"
              >
                <Search className="w-4 h-4 text-forest-800" />
                <span className="hidden sm:inline font-medium">Search...</span>
              </button>

              <a
                href="https://asbrandoils.com/"
                target="_blank"
                rel="noopener noreferrer"
                data-placement="header_cta"
                className="hidden sm:inline-flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold px-3.5 py-2 rounded-full transition-all shadow-sm hover:shadow"
              >
                asbrandoils.com
                <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
              </a>
            </div>
          </div>

          {/* Desktop Navigation Bar */}
          <nav className="hidden lg:flex items-center justify-between py-2.5 text-sm font-medium">
            <div className="flex items-center space-x-6">
              <Link
                href="/"
                className="text-forest-950 hover:text-gold-600 transition-colors py-1"
              >
                Home
              </Link>
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="text-stone-700 hover:text-forest-800 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-forest-700 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {cat.name}
                </Link>
              ))}
              <Link
                href="/products"
                className="text-forest-800 font-semibold hover:text-gold-600 transition-colors py-1 flex items-center gap-1"
              >
                Heritage Oils & Seeds
                <span className="bg-gold-100 text-gold-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                  Purity
                </span>
              </Link>
            </div>
          </nav>
        </div>
      </header>

      {/* 3. Mobile Slide-Over Drawer with Backdrop (Rendered as sibling to escape header stacking context) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer panel */}
          <div className="relative w-4/5 max-w-xs bg-cream-50 h-full p-5 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto border-r border-cream-200 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-cream-200">
                <div>
                  <div className="font-serif font-bold text-base text-forest-950">
                    A.S. Heritage & Living
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-forest-700 font-semibold mt-0.5">
                    Magazine Navigation
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-cream-200 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-6 h-6 stroke-[2.5]" />
                </button>
              </div>

              {/* Categories Navigation */}
              <nav className="space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl font-semibold text-forest-950 hover:bg-cream-200/80 transition-colors text-sm"
                >
                  <span>Home Editorial</span>
                  <span className="text-xs text-forest-700">★</span>
                </Link>

                <div className="pt-2 pb-1 px-3.5 text-[10px] uppercase font-bold tracking-widest text-stone-400">
                  Topic Clusters
                </div>

                {NAV_CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-stone-700 hover:text-forest-900 hover:bg-cream-200/80 transition-colors text-sm font-medium"
                    >
                      <Icon className="w-4 h-4 text-forest-800 shrink-0" />
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}

                <div className="pt-3">
                  <Link
                    href="/products"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3.5 py-3 rounded-xl bg-forest-900 text-white font-bold text-sm shadow-sm transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-gold-400" />
                      Verified Pantry Roster
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gold-400" />
                  </Link>
                </div>
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-cream-200 space-y-2.5">
              <a
                href="https://asbrandoils.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-cream-200 hover:bg-cream-300 text-forest-950 py-2.5 rounded-xl text-xs font-bold transition-colors border border-cream-300"
              >
                Visit asbrandoils.com <ArrowUpRight className="w-3.5 h-3.5 text-forest-700" />
              </a>

              <div className="text-center text-[10px] text-stone-400">
                A.S. Brand Heritage Oils & Wellness • 2026
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Fast Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
