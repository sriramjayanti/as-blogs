'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Heart, ShieldCheck, Mail } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();

  // Hide customer footer on admin panel routes
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-forest-950 text-stone-300 pt-16 pb-12 border-t border-forest-900 mt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-forest-900/80">
          {/* Brand & Editorial Mission */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif text-2xl font-bold text-cream-50 tracking-tight block">
                A.S. HERITAGE & LIVING
              </span>
              <span className="text-[11px] uppercase tracking-widest text-gold-400 font-semibold">
                Authentic Indian Food, Health & Culture
              </span>
            </Link>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Dedicated to documenting traditional culinary arts, smoke point science, cold-pressed oil nutrition, and sacred Pooja rituals. Rooted in authentic South Indian heritage and wellness wisdom.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 pt-2">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Editorial standards compliant • Transparent brand partnership</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-cream-100">
              Categories
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/food" className="hover:text-gold-400 transition-colors">
                  Food & Cooking
                </Link>
              </li>
              <li>
                <Link href="/recipes" className="hover:text-gold-400 transition-colors">
                  Heirloom Recipes
                </Link>
              </li>
              <li>
                <Link href="/health" className="hover:text-gold-400 transition-colors">
                  Health & Wellness
                </Link>
              </li>
              <li>
                <Link href="/culture" className="hover:text-gold-400 transition-colors">
                  Culture & Deepam
                </Link>
              </li>
              <li>
                <Link href="/agriculture" className="hover:text-gold-400 transition-colors">
                  Agriculture & Seeds
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-gold-400 transition-colors">
                  Buying Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified A.S. Brand Pantry */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-cream-100 flex items-center gap-1.5">
              <span>A.S. Brand Collection</span>
              <span className="bg-gold-500/20 text-gold-400 text-[10px] px-1.5 py-0.5 rounded border border-gold-500/30">
                Official
              </span>
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a
                  href="https://asbrandoils.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 flex items-center justify-between group"
                >
                  <span>Hulled Gingelly Oil</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://asbrandoils.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 flex items-center justify-between group"
                >
                  <span>Mansion Gingelly Oil</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://asbrandoils.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 flex items-center justify-between group"
                >
                  <span>Double Filtered Groundnut Oil</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://asbrandoils.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 flex items-center justify-between group"
                >
                  <span>Hulled Sesame Seeds</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://asbrandoils.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 flex items-center justify-between group"
                >
                  <span>Sree Divya Deeparadhana Oil</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a
                  href="https://asbrandoils.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 flex items-center justify-between group"
                >
                  <span>Pooja Brand Pure Gingelly Oil</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-cream-100">
              Heritage Dispatch
            </h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Receive curated heirloom recipes, smoke-point charts, and festival rituals delivered to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-forest-900/80 border border-forest-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-gold-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold px-3 rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Join
                </button>
              </div>
              <p className="text-[10px] text-stone-500">
                No spam. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Bar & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} A.S. Heritage & Living. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-stone-300 transition-colors">
              Terms of Editorial Service
            </Link>
            <Link href="/sitemap.xml" className="hover:text-stone-300 transition-colors">
              XML Sitemap
            </Link>
            <Link href="/admin" className="hover:text-gold-400 transition-colors">
              Editorial CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
