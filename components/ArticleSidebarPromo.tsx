import Image from 'next/image';
import { ProductPromoInfo, buildUtmUrl } from '@/lib/promotion-engine';
import { ArrowUpRight, Sparkles, ShoppingBag } from 'lucide-react';

interface ArticleSidebarPromoProps {
  products: ProductPromoInfo[];
  articleSlug?: string;
}

export default function ArticleSidebarPromo({
  products,
  articleSlug = 'sidebar',
}: ArticleSidebarPromoProps) {
  if (!products || products.length === 0) return null;
  const featured = products[0];

  const promoUrl = buildUtmUrl(
    featured.productUrl,
    'sidebar_card',
    featured.slug,
    articleSlug
  );

  return (
    <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-sm sticky top-28 space-y-4">
      <div className="flex items-center gap-1.5 text-[11px] font-bold text-forest-800 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-gold-600" />
        Featured Culinary Heritage
      </div>

      <div className="relative h-44 bg-cream-50 rounded-xl p-3 flex items-center justify-center border border-cream-200">
        <Image
          src={featured.imageUrl}
          alt={featured.name}
          fill
          className="object-contain p-2"
          sizes="240px"
        />
      </div>

      <div>
        <h4 className="font-serif font-bold text-stone-900 text-base leading-snug">
          {featured.name}
        </h4>
        <p className="text-xs text-stone-600 mt-1 line-clamp-3 leading-relaxed">
          {featured.shortDescription}
        </p>
      </div>

      <a
        href={promoUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-placement="sidebar_card"
        data-product-id={featured.id}
        className="w-full flex items-center justify-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
      >
        Discover at asbrandoils.com <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
      </a>

      {featured.marketplaceLinks && featured.marketplaceLinks.length > 0 && (
        <div className="pt-2 border-t border-cream-100">
          <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">
            Available on Verified Channels:
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {featured.marketplaceLinks.slice(0, 4).map((mp) => (
              <a
                key={mp.name}
                href={mp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] font-medium bg-cream-100 hover:bg-cream-200 text-stone-700 px-2 py-1.5 rounded border border-cream-200"
              >
                <ShoppingBag className="w-3 h-3 text-stone-400" />
                <span className="truncate">{mp.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
