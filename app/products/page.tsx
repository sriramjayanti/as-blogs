import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { buildUtmUrl } from '@/lib/promotion-engine';
import { ShoppingBag, ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'The A.S. Brand Pantry | Verified Culinary & Pooja Oils',
  description:
    'Explore the full roster of A.S. Brand Hulled Gingelly Oil, Mansion Gingelly Oil, Double Filtered Groundnut Oil, Sesame Seeds, and Sree Divya Deeparadhana Oil with verified marketplace channels.',
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Hero */}
      <div className="bg-forest-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-forest-900 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-gold-950/80 text-gold-400 border border-gold-800/50 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-gold-400" /> Verified Brand Directory
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-50 leading-tight">
            The A.S. Brand Pantry Collection
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Crafted through authentic cold-pressing and state-of-the-art mechanical seed de-hulling. Discover our complete line of edible cooking oils, nutrient-dense sesame seeds, and sacred Pancha Thailam pooja formulations.
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((prod) => {
          let marketplaces: { name: string; url: string; badge?: string }[] = [];
          try {
            marketplaces = JSON.parse(prod.marketplaceLinks || '[]');
          } catch {
            marketplaces = [];
          }

          const directUrl = buildUtmUrl(
            prod.productUrl,
            'products_directory',
            prod.slug,
            'pantry_page'
          );

          return (
            <div
              key={prod.id}
              className="bg-white rounded-3xl p-6 border border-cream-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-60 w-full bg-cream-50 rounded-2xl p-4 flex items-center justify-center border border-cream-200 mb-6">
                  <Image
                    src={prod.imageUrl}
                    alt={prod.name}
                    fill
                    className="object-contain p-4 hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-forest-800 uppercase tracking-wider">
                    {prod.tags.split(',')[0]}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
                    {prod.fullDescription}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-cream-200 space-y-4">
                <a
                  href={directUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-placement="pantry_page_card"
                  data-product-id={prod.id}
                  className="w-full inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-white text-xs font-bold py-3 rounded-xl transition-colors shadow-sm"
                >
                  Order on asbrandoils.com <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
                </a>

                {marketplaces.length > 0 && (
                  <div>
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2">
                      Verified Delivery Partners:
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {marketplaces.map((mp) => (
                        <a
                          key={mp.name}
                          href={mp.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between text-xs font-semibold bg-cream-100 hover:bg-cream-200 text-stone-700 px-3 py-2 rounded-lg border border-cream-200 transition-colors"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <ShoppingBag className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                            {mp.name}
                          </span>
                          <span className="text-[10px] text-forest-700 bg-white px-1.5 py-0.5 rounded shrink-0">
                            {mp.badge || 'Buy'}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
