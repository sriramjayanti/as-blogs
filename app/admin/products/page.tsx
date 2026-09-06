import { prisma } from '@/lib/db';
import { ShoppingBag, ArrowUpRight, ShieldCheck, Plus, Store } from 'lucide-react';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            A.S. Brand Product Catalog & Marketplaces
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Manage product metadata, high-resolution CDN images, and verified marketplace channels (Amazon, Blinkit, Zepto, BigBasket, Instamart).
          </p>
        </div>
      </div>

      {/* Product List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((prod) => {
          let marketplaces: { name: string; url: string; badge?: string }[] = [];
          try {
            marketplaces = JSON.parse(prod.marketplaceLinks || '[]');
          } catch {
            marketplaces = [];
          }

          return (
            <div
              key={prod.id}
              className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-white rounded-2xl p-3 flex items-center justify-center mb-4">
                  <img
                    src={prod.imageUrl}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-gold-400 uppercase tracking-wider">
                    {prod.tags.split(',')[0]}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-100 leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {prod.shortDescription}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800 space-y-3">
                <a
                  href={prod.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-semibold py-2.5 rounded-xl border border-stone-800 transition-colors"
                >
                  Direct Destination <ArrowUpRight className="w-3.5 h-3.5 text-gold-400" />
                </a>

                {marketplaces.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Store className="w-3 h-3 text-stone-400" /> Verified Marketplaces:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {marketplaces.map((mp) => (
                        <span
                          key={mp.name}
                          className="text-[11px] bg-stone-900 text-stone-300 px-2 py-0.5 rounded border border-stone-800"
                        >
                          {mp.name}
                        </span>
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
