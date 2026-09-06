'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, X, ArrowUpRight, Flame, ShieldCheck } from 'lucide-react';
import SearchModal from './SearchModal';

const NAV_CATEGORIES = [
  { name: 'Food & Cooking', slug: 'food' },
  { name: 'Heirloom Recipes', slug: 'recipes' },
  { name: 'Health & Wellness', slug: 'health' },
  { name: 'Culture & Deepam', slug: 'culture' },
  { name: 'Agriculture & Science', slug: 'agriculture' },
  { name: 'Guides', slug: 'guides' },
];

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      {/* Top Editorial Ticker Bar */}
      <div className="bg-forest-950 text-stone-300 text-xs py-1.5 px-4 border-b border-forest-900">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-medium text-stone-400">{currentDate}</span>
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
          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/products"
              className="text-gold-400 hover:text-gold-300 flex items-center gap-1 font-medium transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified A.S. Brand Pantry
            </Link>
            <span className="text-forest-800">|</span>
            <Link href="/admin" className="text-stone-400 hover:text-stone-200 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Main Masthead */}
      <header className="bg-cream-50 border-b border-cream-200 sticky top-0 z-40 shadow-sm/50 backdrop-blur-md bg-cream-50/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 md:py-6 flex items-center justify-between border-b border-cream-200/70">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-forest-900 hover:text-forest-700"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Publication Logo / Masthead */}
            <div className="text-center mx-auto lg:mx-0">
              <Link href="/" className="inline-block group">
                <div className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-forest-950 group-hover:text-forest-800 transition-colors">
                  A.S. HERITAGE & LIVING
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-forest-700/80 font-medium mt-0.5">
                  Culinary Heritage • Wellness • Traditional Culture
                </div>
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 bg-cream-100 hover:bg-cream-200 text-stone-600 px-3.5 py-2 rounded-full border border-cream-300 text-sm transition-all hover:shadow-sm"
                aria-label="Search articles"
              >
                <Search className="w-4 h-4 text-forest-800" />
                <span className="hidden sm:inline font-medium">Search articles...</span>
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

          {/* Navigation Bar */}
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

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-cream-50 border-b border-cream-200 px-4 pt-2 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-forest-950 font-semibold border-b border-cream-200"
            >
              Home
            </Link>
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-stone-700 hover:text-forest-900 border-b border-cream-200/50"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-forest-800 font-bold border-b border-cream-200/50"
            >
              Heritage Oils & Seeds Roster
            </Link>
            <div className="pt-2">
              <a
                href="https://asbrandoils.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-forest-900 text-white py-2.5 rounded-lg text-sm font-semibold"
              >
                Visit A.S. Brand Oils Official Website <ArrowUpRight className="w-4 h-4 text-gold-400" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Fast Search Dialog */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
