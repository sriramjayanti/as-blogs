import Image from 'next/image';
import { ProductPromoInfo, buildUtmUrl } from '@/lib/promotion-engine';
import { ShoppingBag, ArrowUpRight, Sparkles, CheckCircle2 } from 'lucide-react';

interface InlineProductCardProps {
  product: ProductPromoInfo;
  articleSlug?: string;
}

export default function InlineProductCard({ product, articleSlug = 'article' }: InlineProductCardProps) {
  const directPromoUrl = buildUtmUrl(
    product.productUrl,
    'inline_product_card',
    product.slug,
    articleSlug
  );

  return (
    <aside className="my-8 sm:my-10 bg-gradient-to-br from-cream-100 via-cream-50 to-amber-50/40 rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-sm relative overflow-hidden not-prose">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-forest-700 via-gold-500 to-amber-400" />

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        {/* Product Visual */}
        <div className="relative w-28 h-36 sm:w-32 sm:h-40 shrink-0 bg-white rounded-xl p-2 border border-cream-200 shadow-sm flex items-center justify-center">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-contain p-2 hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 112px, 128px"
          />
        </div>

        {/* Product Information */}
        <div className="flex-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-forest-800 uppercase tracking-wider bg-forest-100/80 px-2.5 py-0.5 rounded-full mb-1.5">
            <Sparkles className="w-3 h-3 text-gold-600" />
            Culinary Selection • A.S. Brand Heritage
          </div>

          <h4 className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-snug">
            {product.name}
          </h4>

          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Action Row */}
          <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <a
              href={directPromoUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="inline_product_card"
              data-product-id={product.id}
              className="inline-flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow"
            >
              Explore at asbrandoils.com
              <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
            </a>

            {/* Quick Marketplace Pills */}
            {product.marketplaceLinks && product.marketplaceLinks.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-stone-500 font-medium">Also on:</span>
                {product.marketplaceLinks.slice(0, 3).map((mp) => (
                  <a
                    key={mp.name}
                    href={mp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white hover:bg-cream-200 text-stone-700 px-2.5 py-1.5 rounded-lg border border-cream-300 transition-colors"
                    title={`Buy on ${mp.name}`}
                  >
                    <ShoppingBag className="w-3 h-3 text-stone-500" />
                    {mp.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
