import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import ArticleCard from '@/components/ArticleCard';
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Flame,
  ShieldCheck,
  BookOpen,
  Utensils,
  Candy,
  Drumstick,
  Soup,
  ChefHat,
  Coffee,
  Pizza,
  Info,
} from 'lucide-react';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  // Fetch published recipes and categories
  const [articles, categories, products] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        category: true,
        author: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: 16,
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

  // Featured Lead Story
  const featuredArticle = articles[0];
  const trendingArticles = articles.slice(1, 4);

  // Group recipes by the 8 categories
  const vegArticles = articles.filter((a) => a.category.slug === 'vegetarian-recipes');
  const sweetArticles = articles.filter((a) => a.category.slug === 'sweet-recipes');
  const nonVegArticles = articles.filter((a) => a.category.slug === 'non-vegetarian-recipes');
  const festivalArticles = articles.filter((a) => a.category.slug === 'festival-recipes');
  const southIndianArticles = articles.filter((a) => a.category.slug === 'south-indian-recipes');
  const northIndianArticles = articles.filter((a) => a.category.slug === 'north-indian-recipes');
  const breakfastArticles = articles.filter((a) => a.category.slug === 'breakfast-recipes');
  const streetFoodArticles = articles.filter((a) => a.category.slug === 'street-food-recipes');

  return (
    <div className="space-y-14 sm:space-y-18 pb-20">
      {/* 1. Pleasant Appetizing Food Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="relative rounded-3xl overflow-hidden bg-forest-950 text-white border border-forest-900 shadow-2xl">
          {/* High quality appetizing food background with soft dark gradient overlay */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1600&auto=format&fit=crop&q=85"
              alt="Pleasant banquet of delicious Indian food, fragrant spices, and traditional cooking"
              fill
              priority
              className="object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/80 to-forest-950/40" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 bg-gold-950/90 text-gold-400 border border-gold-800/60 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              My Everyday Kitchen • Healthy Food Recipes
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cream-50 leading-[1.12] tracking-tight">
              Delicious Food Recipe Ideas for Your Everyday Kitchen
            </h1>

            <p className="text-stone-200 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-normal">
              Explore authentic home recipes, oil-based traditional sweets, crispy street food favorites, and healthy South & North Indian culinary classics made with honest ingredients.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/about"
                className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
              >
                <Info className="w-4 h-4" /> About Our Kitchen
              </Link>
              <Link
                href="/sweet-recipes"
                className="bg-forest-900/90 hover:bg-forest-800 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-full border border-forest-700 hover:border-gold-500 transition-all flex items-center gap-2"
              >
                <Candy className="w-4 h-4 text-gold-400" /> Oil-Based Sweets
              </Link>
              <Link
                href="/products"
                className="text-stone-300 hover:text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-full border border-stone-700 hover:border-stone-500 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-gold-400" /> A.S. Brand Pantry
              </Link>
            </div>

            {/* 8 Category Discovery Pills */}
            <div className="pt-4 border-t border-forest-800/80">
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2.5">
                Explore Recipe Categories:
              </div>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {[
                  { name: 'Vegetarian Recipes', slug: 'vegetarian-recipes' },
                  { name: 'Sweet Recipes (Oils)', slug: 'sweet-recipes' },
                  { name: 'Non-Vegetarian', slug: 'non-vegetarian-recipes' },
                  { name: 'Festival Recipes', slug: 'festival-recipes' },
                  { name: 'South Indian', slug: 'south-indian-recipes' },
                  { name: 'North Indian', slug: 'north-indian-recipes' },
                  { name: 'Breakfast Recipes', slug: 'breakfast-recipes' },
                  { name: 'Street Food', slug: 'street-food-recipes' },
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${cat.slug}`}
                    className="text-xs bg-forest-900/80 hover:bg-gold-500 hover:text-forest-950 text-stone-200 px-3 py-1.5 rounded-lg border border-forest-800 transition-colors font-medium whitespace-nowrap"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Recipe & Trending Stories */}
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

      {/* 3. Category Highlight: Sweet Recipes (Made With Pure Oils) */}
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
          {(sweetArticles.length > 0 ? sweetArticles : articles.slice(0, 3)).map((art) => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

      {/* 4. Category Highlight: South & North Indian Recipes */}
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
          {[...southIndianArticles, ...northIndianArticles].slice(0, 3).map((art) => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

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
          {[...breakfastArticles, ...streetFoodArticles].slice(0, 3).map((art) => (
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
    </div>
  );
}
