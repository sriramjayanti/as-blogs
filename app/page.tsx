import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/db';
import ArticleCard from '@/components/ArticleCard';
import { ArrowRight, ArrowUpRight, Sparkles, Flame, ShieldCheck, BookOpen } from 'lucide-react';

export const revalidate = 60; // ISR 60 seconds

export default async function HomePage() {
  // Fetch published articles with relations
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      category: true,
      author: true,
    },
    orderBy: { publishedAt: 'desc' },
    take: 12,
  });

  // Featured and trending slices
  const featuredArticle = articles[0];
  const trendingArticles = articles.slice(1, 4);
  const foodArticles = articles.filter((a) => a.category.slug === 'food' || a.category.slug === 'recipes');
  const cultureArticles = articles.filter((a) => a.category.slug === 'culture' || a.category.slug === 'health');
  const remainingArticles = articles.slice(4);

  // Fetch official products for subtle pantry showcase
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    orderBy: { orderIndex: 'asc' },
    take: 6,
  });

  return (
    <div className="space-y-16 sm:space-y-20 pb-16">
      {/* 1. Hero Editorial Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Lead Story */}
          <div className="lg:col-span-8">
            {featuredArticle ? (
              <ArticleCard article={featuredArticle} variant="featured" />
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-cream-200">
                <BookOpen className="w-8 h-8 mx-auto text-stone-400 mb-2" />
                <p className="text-stone-600">Publishing editorial articles...</p>
              </div>
            )}
          </div>

          {/* Trending Stories Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-cream-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 mb-3 border-b border-cream-200">
                <Flame className="w-4 h-4 text-gold-600" />
                <h3 className="font-serif text-lg font-bold text-stone-950 uppercase tracking-wider">
                  Trending Stories
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
                <Sparkles className="w-3.5 h-3.5 text-gold-600" /> Editorial Note
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Our culinary guides are peer-reviewed by food anthropologists and nutrition specialists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Topic Spotlight: Culinary Science & Recipes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-forest-900/20">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest-800">
              Gastronomy & Technique
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 mt-1">
              Food & Heirloom Recipes
            </h2>
          </div>
          <Link
            href="/food"
            className="text-xs sm:text-sm font-bold text-forest-900 hover:text-gold-600 flex items-center gap-1 transition-colors"
          >
            Explore Food Section <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {foodArticles.slice(0, 3).map((art) => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

      {/* 3. Subtle Brand Story / Heritage Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-forest-950 text-white p-6 sm:p-12 lg:p-16 border border-forest-900 shadow-xl">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:16px_16px]" />
          
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-gold-950/80 text-gold-400 border border-gold-800/50 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              Heritage Pillar
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 leading-tight">
              Purity Rooted in South Indian Tradition
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              For generations, traditional cold-pressed gingelly oil, double-filtered groundnut oil, and sacred Pancha Thailam deepam blends have nourished Indian homes. We celebrate authentic methods that preserve natural aroma, essential sesamol antioxidants, and crisp culinary perfection.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
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

      {/* 4. Topic Section: Culture, Wellness & Sacred Rituals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-forest-900/20">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-forest-800">
              Wellness & Sacred Living
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 mt-1">
              Culture, Ayurveda & Deepam Traditions
            </h2>
          </div>
          <Link
            href="/culture"
            className="text-xs sm:text-sm font-bold text-forest-900 hover:text-gold-600 flex items-center gap-1 transition-colors"
          >
            Explore Culture Section <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {cultureArticles.slice(0, 3).map((art) => (
            <ArticleCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      </section>

      {/* 5. The Curated Pantry Showcase (Non-intrusive Product Directory) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 border border-cream-200 shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">

            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              Curated Essentials
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

      {/* 6. Latest Articles Feed */}
      {remainingArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 pb-3 border-b-2 border-forest-900/20">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-forest-800">
                Fresh Dispatches
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950 mt-1">
                Latest Articles & Stories
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {remainingArticles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="horizontal" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
