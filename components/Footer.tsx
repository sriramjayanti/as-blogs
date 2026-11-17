'use client';

import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Mail, Phone, MapPin, Youtube, Instagram, Sparkles } from 'lucide-react';

export default function Footer() {
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
                Healthy Food Recipes • My Everyday Kitchen
              </span>
            </Link>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Sharing authentic home recipes, healthy cooking techniques, oil-based festival sweets, and traditional culinary secrets. In proud association with A.S. Brand Oils.
            </p>
            <div className="space-y-1.5 text-xs text-stone-400 pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <a href="tel:9177455998" className="hover:text-gold-300 font-mono">
                  +91 91774 55998
                </a>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Editorial standards compliant • Pure & healthy cooking</span>
              </div>
            </div>

            {/* Social Media Highlight Box */}
            <div className="pt-2 space-y-2">
              <div className="text-[11px] uppercase tracking-wider font-bold text-gold-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Follow Our Kitchen & Recipe Videos:
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href="https://youtube.com/@asbrandoilsrecipes?si=Q3ScmdUlfgl_0gIa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-red-600/90 hover:bg-red-600 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs group"
                >
                  <Youtube className="w-4 h-4 text-white shrink-0" />
                  <span className="truncate">@asbrandoilsrecipes</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 ml-auto" />
                </a>

                <a
                  href="https://www.instagram.com/asbrand_oils_recipes?psln=MW82OWQ2djg0bWdweQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-xs group"
                >
                  <Instagram className="w-4 h-4 text-white shrink-0" />
                  <span className="truncate">@asbrand_oils_recipes</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 group-hover:opacity-100 ml-auto" />
                </a>
              </div>
            </div>
          </div>

          {/* 8 Recipe Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-cream-100">
              Recipe Vault
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/vegetarian-recipes" className="hover:text-gold-400 transition-colors">
                  Vegetarian Recipes
                </Link>
              </li>
              <li>
                <Link href="/sweet-recipes" className="hover:text-gold-400 transition-colors">
                  Sweet Recipes (With Oils)
                </Link>
              </li>
              <li>
                <Link href="/non-vegetarian-recipes" className="hover:text-gold-400 transition-colors">
                  Non-Vegetarian Recipes
                </Link>
              </li>
              <li>
                <Link href="/festival-recipes" className="hover:text-gold-400 transition-colors">
                  Festival Recipes
                </Link>
              </li>
              <li>
                <Link href="/south-indian-recipes" className="hover:text-gold-400 transition-colors">
                  South Indian Recipes
                </Link>
              </li>
              <li>
                <Link href="/north-indian-recipes" className="hover:text-gold-400 transition-colors">
                  North Indian Recipes
                </Link>
              </li>
              <li>
                <Link href="/breakfast-recipes" className="hover:text-gold-400 transition-colors">
                  Breakfast Recipes
                </Link>
              </li>
              <li>
                <Link href="/street-food-recipes" className="hover:text-gold-400 transition-colors">
                  Street Food Recipes
                </Link>
              </li>
            </ul>
          </div>

          {/* Verified A.S. Brand Pantry */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-cream-100 flex items-center gap-1.5">
              <span>A.S. Brand Oils</span>
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
                  <span>Groundnut Oil</span>
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
                  <span>Sesame Seeds</span>
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
                  <span>Deeparadhana Oil</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <Link href="/products" className="text-gold-400 hover:text-gold-300 font-bold block pt-1">
                  View Full Pantry →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Newsletter */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-cream-100">
              Everyday Dispatch
            </h4>
            <p className="text-stone-400 text-xs leading-relaxed">
              Get tested home recipes, healthy kitchen tips, and festival sweets delivered to your inbox.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  aria-label="Email address for recipe dispatch"
                  className="w-full bg-forest-900/80 border border-forest-800 rounded-xl px-3.5 py-2 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:border-gold-500"
                />
                <button
                  type="submit"
                  aria-label="Join recipe dispatch newsletter"
                  className="absolute right-1 top-1 bottom-1 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold px-3 rounded-lg text-xs transition-colors flex items-center gap-1"
                >
                  <Mail className="w-3 h-3" />
                  Join
                </button>
              </div>
            </form>
            <div className="pt-2">
              <Link href="/about" className="text-xs text-gold-400 hover:text-gold-300 font-semibold underline">
                About Our Editorial Kitchen →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} A.S. Heritage & Living • Healthy Food Recipes
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <a
              href="https://youtube.com/@asbrandoilsrecipes?si=Q3ScmdUlfgl_0gIa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="A.S. Brand Recipes on YouTube"
              className="text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span>YouTube</span>
            </a>
            <a
              href="https://www.instagram.com/asbrand_oils_recipes?psln=MW82OWQ2djg0bWdweQ=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="A.S. Brand Oils Recipes on Instagram"
              className="text-stone-400 hover:text-pink-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <Instagram className="w-4 h-4 text-pink-400" />
              <span>Instagram</span>
            </a>
            <Link href="/about" className="hover:text-stone-300 transition-colors">
              About Us
            </Link>
            <Link href="/sitemap.xml" className="hover:text-stone-300 transition-colors">
              XML Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
