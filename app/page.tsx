import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import { isUnoptimizedImage } from '@/lib/utils';

import { Metadata } from 'next';
import ArticleCard from '@/components/ArticleCard';
import HeroPosterCarousel from '@/components/HeroPosterCarousel';
import BrandVideoShowcase from '@/components/BrandVideoShowcase';
import { getSiteUrl } from '@/lib/utils';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Flame,
  ShieldCheck,
  BookOpen,
  Candy,
  Soup,
  Coffee,
  Youtube,
  Instagram,
} from 'lucide-react';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: 'A.S. Heritage & Living | Indian Culinary, Wellness & Culture',
  description:
    'Discover authentic Indian culinary science, cold-pressed oil smoke points, heirloom recipes, Ayurvedic wellness, and sacred Pooja deepam traditions.',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'A.S. Heritage & Living | Indian Culinary, Wellness & Culture',
    description:
      'Discover authentic Indian culinary science, cold-pressed oil smoke points, heirloom recipes, Ayurvedic wellness, and sacred Pooja deepam traditions.',
    url: siteUrl,
  },
};

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  // Fetch published recipes, categories, and featured products
  const [articles, categories, products] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 60,
    }),
    prisma.category.findMany({
      orderBy: { orderIndex: 'asc' },
    }),
    prisma.product.findMany({
      where: { isFeatured: true },
      orderBy: { orderIndex: 'asc' },
      take: 6,
    }),
  ]);

  // Guaranteed Unique Article Display (no duplicates across sections)
  const usedIds = new Set<string>();

  // 1. Featured Lead Story
  const featuredArticle = articles[0];
  if (featuredArticle) usedIds.add(featuredArticle.id);

  // 2. Trending Stories (3 items, unique)
  const trendingArticles = articles.filter((a) => !usedIds.has(a.id)).slice(0, 3);
  trendingArticles.forEach((a) => usedIds.add(a.id));

  // 3. Sweet Recipes (3 items, unique)
  const sweetArticles = articles
    .filter((a) => a.category.slug === 'sweet-recipes' && !usedIds.has(a.id))
    .slice(0, 3);
  sweetArticles.forEach((a) => usedIds.add(a.id));

  // 4. Regional: South Indian & North Indian (3 items, unique)
  const regionalArticles = articles
    .filter(
      (a) =>
        (a.category.slug === 'south-indian-recipes' || a.category.slug === 'north-indian-recipes') &&
        !usedIds.has(a.id)
    )
    .slice(0, 3);
  regionalArticles.forEach((a) => usedIds.add(a.id));

  // 5. Breakfast & Street Food (3 items, unique)
  const breakfastStreetArticles = articles
    .filter(
      (a) =>
        (a.category.slug === 'breakfast-recipes' || a.category.slug === 'street-food-recipes') &&
        !usedIds.has(a.id)
    )
    .slice(0, 3);
  breakfastStreetArticles.forEach((a) => usedIds.add(a.id));

  return (
    <div className="space-y-14 sm:space-y-18 pb-20">
      {/* 1. Interactive Scrolling Hero Poster Banner with AS Brand Visuals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <HeroPosterCarousel />
      </section>

      {/* 2. Featured Recipe & Trending Stories (Immediately following Hero) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Lead Story */}
          <div className="lg:col-span-8">
            {featuredArticle ? (
              <ArticleCard article={featuredArticle} variant="featured" />
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-cream-200">
                <BookOpen className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                <p className="text-stone-600">Publishing recipes...</p>
              </div>
            )}
          </div>

          {/* Trending Stories Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-cream-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 mb-3 border-b border-cream-200">
                <Flame className="w-4 h-4 text-gold-600" />
                <h3 className="font-serif text-lg font-bold text-stone-950 uppercase tracking-wider">
                  Top Home Recipes
                </h3>
              </div>
              <div className="divide-y divide-cream-100">
                {trendingArticles.map((art) => (
                  <ArticleCard key={art.id} article={art} variant="compact" />
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-cream-200 bg-cream-50/70 p-4 rounded-xl">
              <div className="text-xs font-semibold text-forest-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-600" /> Simple Kitchen Tip
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                For authentic South Indian aroma, always finish your sambar and vegetable gravies with cold-pressed hulled gingelly oil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Category Highlight: Sweet Recipes (Made With Pure Oils) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-forest-900/20">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold-700">
              <Candy className="w-3.5 h-3.5" /> Traditional & Healthy Confections
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 mt-1">
              Sweet Recipes (Making with Pure Oils)
            </h2>
          </div>
          <Link
            href="/sweet-recipes"
            className="text-xs sm:text-sm font-bold text-forest-900 hover:text-gold-600 flex items-center gap-1 transition-colors"
          >
            All Sweet Recipes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sweetArticles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

      {/* 5. Category Highlight: South & North Indian Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-forest-900/20">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-forest-800">
              <Soup className="w-3.5 h-3.5" /> Regional Heritage Gastronomy
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 mt-1">
              South Indian & North Indian Classics
            </h2>
          </div>
          <Link
            href="/south-indian-recipes"
            className="text-xs sm:text-sm font-bold text-forest-900 hover:text-gold-600 flex items-center gap-1 transition-colors"
          >
            Explore Regional <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {regionalArticles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

      {/* 6. Middle Scroll Section: Brand Video Showcase & Heritage Masterclass */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <BrandVideoShowcase />
      </div>

      {/* 5. Subtle Brand Story / Heritage Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-forest-950 text-white p-8 sm:p-12 lg:p-14 border border-forest-900 shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-gold-950/80 text-gold-400 border border-gold-800/50 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              Heritage Pantry
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 leading-tight">
              Purity Rooted in South Indian Tradition
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Every delicious home recipe begins with genuine, chemical-free cold-pressed oils. A.S. Brand Hulled Gingelly Oil and double-filtered Groundnut Oil provide high smoke-point stability and unmatched aroma for everyday cooking and festival sweets.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md"
              >
                Explore The A.S. Brand Pantry
              </Link>
              <a
                href="https://asbrandoils.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white text-sm font-semibold flex items-center gap-1.5 px-4 py-3 rounded-full border border-stone-700 hover:border-stone-500 transition-colors"
              >
                asbrandoils.com <ArrowUpRight className="w-4 h-4 text-gold-400" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Category Highlight: Breakfast & Street Food Favorites */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-forest-900/20">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-forest-800">
              <Coffee className="w-3.5 h-3.5" /> Morning Tiffins & Evening Cravings
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 mt-1">
              Breakfast & Street Food Recipes
            </h2>
          </div>
          <Link
            href="/street-food-recipes"
            className="text-xs sm:text-sm font-bold text-forest-900 hover:text-gold-600 flex items-center gap-1 transition-colors"
          >
            View Street Food <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {breakfastStreetArticles.map((art) => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

      {/* 7. The Curated Pantry Showcase (Non-intrusive Product Directory) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-cream-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              Kitchen Essentials
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 mt-1">
              The A.S. Brand Pantry Roster
            </h2>
            <p className="text-stone-600 text-xs sm:text-sm mt-2 leading-relaxed">
              Unadulterated cold-pressed oils, de-hulled sesame seeds, and sacred Pancha Thailam formulated for pure culinary delight and auspicious pooja rituals.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="group bg-cream-50/70 hover:bg-white rounded-2xl p-4 border border-cream-200 hover:border-gold-300 hover:shadow-md transition-all flex flex-col justify-between text-center"
              >
                <div>
                  <div className="relative h-28 w-full mb-3 flex items-center justify-center">
                    <Image
                      src={prod.imageUrl}
                      alt={prod.name}
                      fill
                      unoptimized={isUnoptimizedImage(prod.imageUrl)}
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                      sizes="140px"
                    />

                  </div>
                  <h4 className="font-serif text-xs sm:text-sm font-bold text-stone-900 line-clamp-2 leading-tight">
                    {prod.name}
                  </h4>
                </div>

                <a
                  href={prod.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center gap-1 text-[11px] font-bold text-forest-800 hover:text-gold-600 pt-2 border-t border-cream-200 w-full"
                >
                  Details <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-cream-100 hover:bg-forest-900 hover:text-white text-stone-800 text-xs font-bold px-5 py-2.5 rounded-full border border-cream-300 transition-colors"
            >
              View Full Product Roster & Verified Channels <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Official Social Community Showcase (YouTube & Instagram) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white p-6 sm:p-10 border border-forest-800 shadow-xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-gold-950/80 text-gold-400 border border-gold-800/50 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Join Our Kitchen Community
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
                Cook With Us on YouTube & Instagram
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Watch detailed recipe masterclasses, quick 60-second cooking reels, traditional oil pairing tips, and festival feast preparations every week.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
              {/* YouTube Card */}
              <a
                href="https://youtube.com/@asbrandoilsrecipes?si=Q3ScmdUlfgl_0gIa"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-red-600 hover:bg-red-500 text-white px-5 py-3.5 rounded-2xl font-bold transition-all shadow-md group hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Youtube className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-red-100 uppercase tracking-wider font-semibold">Subscribe on YouTube</div>
                  <div className="text-sm font-bold">@asbrandoilsrecipes</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/70 group-hover:text-white ml-2" />
              </a>

              {/* Instagram Card */}
              <a
                href="https://www.instagram.com/asbrand_oils_recipes?psln=MW82OWQ2djg0bWdweQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white px-5 py-3.5 rounded-2xl font-bold transition-all shadow-md group hover:scale-[1.02]"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Instagram className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] text-pink-100 uppercase tracking-wider font-semibold">Follow on Instagram</div>
                  <div className="text-sm font-bold">@asbrand_oils_recipes</div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-white/70 group-hover:text-white ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
