'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  Flame,
  ShieldCheck,
  Truck,
  CheckCircle2,
} from 'lucide-react';

interface ProductItem {
  name: string;
  nameTe: string;
  tagline: string;
  badge: string;
  smokePoint: string;
  bestFor: string;
  image: string;
  buyUrl: string;
  marketplaces: { name: string; url: string; badge: string }[];
}

const PRODUCTS: ProductItem[] = [
  {
    name: 'A.S. Brand Hulled Gingelly Oil',
    nameTe: 'A.S. బ్రాండ్ హల్డ్ జింజెల్లీ ఆయిల్',
    tagline: 'De-hulled white sesame for sweet aroma & zero bitter taste.',
    badge: 'Flagship Purity',
    smokePoint: '177°C – 210°C (Medium-High)',
    bestFor: 'Daily Sambars, Rasams, Chutneys, Dosas & Light Sautés',
    image: 'https://asbrandoils.com/cdn/shop/files/Gingelly_oil_1_720x.png?v=1721982944',
    buyUrl: 'https://asbrandoils.com/products/a-s-brand-hulled-gingelly-oil-1-litre-bottle',
    marketplaces: [
      { name: 'Amazon', url: 'http://www.amazon.in/stores/ASBrand/page/9B4B1CF0-5C56-45FD-AD23-867404DC88CF', badge: 'Prime' },
      { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=as+brand+gingelly+oil', badge: 'Instant' },
      { name: 'Blinkit', url: 'https://blinkit.com/s/?q=as+brand+oil', badge: '10 Mins' },
      { name: 'Zepto', url: 'https://www.zeptonow.com/search?query=as+brand+gingelly+oil', badge: 'Fast' },
    ],
  },
  {
    name: 'A.S. Brand Groundnut Oil',
    nameTe: 'A.S. బ్రాండ్ గ్రౌండ్‌నట్ ఆయిల్ (వేరుశెనగ నూనె)',
    tagline: 'Double filtered from handpicked peanuts. 232°C high smoke point.',
    badge: 'King of Frying',
    smokePoint: '232°C / 450°F (High Smoke Point)',
    bestFor: 'Deep Frying Pakodas, Vada, Murukku, Chicken 65, Paneer Tikka & Parotta',
    image: 'https://asbrandoils.com/cdn/shop/files/Groundnut_oil_01_720x.png?v=1721480148',
    buyUrl: 'https://asbrandoils.com/products/a-s-brand-groundnut-oil-1-liter-pouch',
    marketplaces: [
      { name: 'Amazon', url: 'http://www.amazon.in/stores/ASBrand/page/9B4B1CF0-5C56-45FD-AD23-867404DC88CF', badge: 'Prime' },
      { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=as+brand+groundnut+oil', badge: 'Fresh' },
      { name: 'Blinkit', url: 'https://blinkit.com/s/?q=groundnut+oil+as+brand', badge: '10 Mins' },
    ],
  },
  {
    name: 'Mansion Gingelly Oil',
    nameTe: 'మాన్షన్ జింజెల్లీ ఆయిల్ (Mansion Brand)',
    tagline: 'Whole raw gingelly seeds pressed for robust heritage flavor.',
    badge: 'Heritage Non-Veg',
    smokePoint: '175°C – 205°C',
    bestFor: 'Chettinad Pepper Chicken, Spicy Mutton Chops, Prawn Fry & Idli Podi',
    image: 'https://asbrandoils.com/cdn/shop/files/Mansion_oil_720x.png?v=1721477339',
    buyUrl: 'https://asbrandoils.com/products/mansion-gingelly-oil-1-liter-pouch',
    marketplaces: [
      { name: 'Amazon', url: 'http://www.amazon.in/stores/ASBrand/page/9B4B1CF0-5C56-45FD-AD23-867404DC88CF', badge: 'Prime' },
      { name: 'Swiggy Instamart', url: 'https://www.swiggy.com/instamart', badge: '15 Mins' },
      { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=mansion+gingelly+oil', badge: 'Verified' },
    ],
  },
  {
    name: 'A.S. Brand Hulled Gingelly Seeds',
    nameTe: 'A.S. బ్రాండ్ హల్డ్ జింజెల్లీ సీడ్స్ (తెల్ల నువ్వులు)',
    tagline: 'Premium white sesame seeds with natural crunch and sweet nutty flavor.',
    badge: 'Sweets & Confectionery',
    smokePoint: 'Baking / Roasting',
    bestFor: 'Til Ladoos, Sesame Sweets, Panchamirtham & Podi Making',
    image: 'https://asbrandoils.com/cdn/shop/files/Gingelly_seeds_01_720x.png?v=1721480048',
    buyUrl: 'https://asbrandoils.com/products/a-s-brand-hulled-gingelly-seeds-white-sesame-seed-1-kg-500grm-x-2',
    marketplaces: [
      { name: 'Amazon', url: 'http://www.amazon.in/stores/ASBrand/page/9B4B1CF0-5C56-45FD-AD23-867404DC88CF', badge: '1 Kg Pack' },
      { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=as+brand+gingelly+seeds', badge: 'Pure' },
    ],
  },
  {
    name: 'Sree Divya Sugandha Deeparadhana Oil',
    nameTe: 'శ్రీ దివ్య సుగంధ దీపారాధన తైలం (Jasmine Pancha Thailam)',
    tagline: '5-oil sacred blend infused with divine Jasmine fragrance for pooja lamps.',
    badge: 'Divine Worship',
    smokePoint: 'Diya & Lamp Flame',
    bestFor: 'Daily Temple Pooja, Diwali, Karthigai Deepam & Devotional Rituals',
    image: 'https://asbrandoils.com/cdn/shop/files/Deeparadhana_oil_720x.png?v=1721480073',
    buyUrl: 'https://asbrandoils.com/products/sree-divya-sugandha-deeparadhana-oil-910ml-bottle',
    marketplaces: [
      { name: 'Amazon', url: 'http://www.amazon.in/stores/ASBrand/page/9B4B1CF0-5C56-45FD-AD23-867404DC88CF', badge: 'Auspicious' },
      { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=divya+sugandha+oil', badge: 'Devotion' },
    ],
  },
];

export default function ProductBannerShowcase() {
  return (
    <section className="bg-gradient-to-b from-cream-100/90 to-cream-50 rounded-3xl p-6 sm:p-8 lg:p-10 border border-cream-300 shadow-sm space-y-6">
      {/* Top Banner Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center gap-2 bg-forest-900 text-gold-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            Official A.S. Brand Pantry & Oil Science
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Select the Right Oil for Your Cooking Temperature & Smoke Point
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl font-normal">
            Every dish requires a specific oil to unlock its authentic flavor and maintain health without overheating.
          </p>
        </div>

        {/* Free Shipping Badge */}
        <div className="flex items-center gap-2.5 bg-white px-4 py-2.5 rounded-2xl border border-cream-300 text-forest-950 font-bold text-xs shadow-2xs shrink-0 self-start md:self-auto">
          <Truck className="w-4 h-4 text-emerald-600" />
          <span>Free Delivery to AP, Telangana, Bangalore & Chennai!</span>
        </div>
      </div>

      {/* Product Banner Cards Carousel / Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PRODUCTS.map((prod, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-cream-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Product Header Pill & Image */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="bg-gold-500/20 text-forest-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-gold-500/30">
                  {prod.badge}
                </span>
                <span className="text-[11px] font-semibold text-stone-500 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-600" />
                  {prod.smokePoint}
                </span>
              </div>

              {/* Product Image */}
              <div className="relative h-44 w-full rounded-xl bg-cream-50/80 border border-cream-200/80 overflow-hidden mb-4 flex items-center justify-center p-2 group-hover:scale-[1.02] transition-transform">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 300px"
                />
              </div>

              {/* Product Name & Details */}
              <h3 className="font-serif text-base font-bold text-stone-900 leading-snug group-hover:text-forest-900 transition-colors">
                {prod.name}
              </h3>
              <div className="text-[11px] font-medium text-forest-800 mt-0.5">
                {prod.nameTe}
              </div>

              <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed font-normal">
                {prod.tagline}
              </p>

              {/* Best For Tag */}
              <div className="mt-3 bg-cream-100/70 p-2.5 rounded-xl border border-cream-200 text-[11px] text-stone-700">
                <span className="font-bold text-stone-900">Best For: </span>
                {prod.bestFor}
              </div>
            </div>

            {/* Quick Marketplace Action Bar */}
            <div className="pt-4 mt-4 border-t border-cream-200 space-y-2.5">
              <a
                href={prod.buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-gold-400" />
                <span>Buy Official Pack</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {/* Marketplace Pills */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                <span className="text-[10px] text-stone-400 font-semibold uppercase">Also on:</span>
                {prod.marketplaces.map((m, mIdx) => (
                  <a
                    key={mIdx}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-bold bg-cream-100 hover:bg-cream-200 text-stone-700 px-2 py-0.5 rounded border border-cream-300 transition-colors"
                  >
                    {m.name} ({m.badge})
                  </a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
