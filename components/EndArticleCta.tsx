import Image from 'next/image';
import { ProductPromoInfo, buildUtmUrl } from '@/lib/promotion-engine';
import { ArrowUpRight, ShieldCheck, HeartHandshake, Sparkles } from 'lucide-react';

interface EndArticleCtaProps {
  product?: ProductPromoInfo;
  articleSlug?: string;
}

export default function EndArticleCta({ product, articleSlug = 'article' }: EndArticleCtaProps) {
  if (!product) return null;

  const promoUrl = buildUtmUrl(
    product.productUrl,
    'end_article_cta',
    product.slug,
    articleSlug
  );

  return (
    <section className="my-12 bg-forest-950 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-forest-900 shadow-xl relative overflow-hidden not-prose">
      {/* Subtle background glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid md:grid-cols-12 gap-8 items-center">
        {/* Text column */}
        <div className="md:col-span-8">
          <div className="inline-flex items-center gap-2 bg-gold-950/80 text-gold-400 border border-gold-800/60 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Culinary Recommendation
          </div>

          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 leading-tight">
            Discover Pure South Indian Culinary Heritage
          </h3>

          <p className="text-stone-300 text-sm sm:text-base mt-2.5 leading-relaxed max-w-xl">
            Elevate everyday cooking with authentic, cold-pressed purity. <strong>{product.name}</strong> brings traditional aroma, nutrient retention, and chemical-free assurance directly to your family table.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-stone-300">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>100% Pure & Unadulterated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-gold-400" />
              <span>Trusted Heritage Brand</span>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={promoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="end_article_cta"
              data-product-id={product.id}
              className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold px-6 py-3 rounded-full text-sm transition-all shadow-lg hover:shadow-gold-500/20"
            >
              Explore {product.name}
              <ArrowUpRight className="w-4 h-4" />
            </a>

            <a
              href="https://asbrandoils.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-stone-300 hover:text-white text-xs font-semibold px-4 py-3 rounded-full border border-stone-700 hover:border-stone-500 transition-colors"
            >
              Visit Brand Website
            </a>
          </div>
        </div>

        {/* Visual column */}
        <div className="md:col-span-4 flex justify-center">
          <div className="relative w-44 h-56 sm:w-52 sm:h-64 bg-stone-900/80 rounded-2xl p-4 border border-forest-800 shadow-2xl flex items-center justify-center group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 176px, 208px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
