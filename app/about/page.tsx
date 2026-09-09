import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  Utensils,
  HeartPulse,
  Sparkles,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | Delicious Food Recipe Ideas & Everyday Kitchen',
  description:
    'Welcome to My Everyday Kitchen & Food Universe. We share healthy food recipes, simple kitchen cooking techniques, and traditional oil-based secrets for everyday home cooks.',
};

export default function AboutPage() {
  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      {/* 1. Hero Header Banner */}
      <section className="relative bg-forest-950 text-white overflow-hidden py-16 sm:py-24 border-b border-forest-900">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-gold-950/80 text-gold-400 border border-gold-800/60 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-gold-400" />
            Culinary Heritage & Everyday Kitchen
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cream-50 leading-tight">
            Delicious Food Recipe Ideas for Your Everyday Kitchen
          </h1>

          <p className="text-stone-300 text-sm sm:text-base lg:text-lg max-w-3xl mx-auto leading-relaxed font-normal">
            We are dedicated to bringing you the best home recipes, healthy cooking techniques, and authentic culinary secrets. From everyday simple vegetarian curries and crispy street food snacks to traditional oil-based festival sweets—we make home cooking joyful, wholesome, and flavorful.
          </p>
        </div>
      </section>

      {/* 2. Our Mission & Philosophy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative h-80 sm:h-96 lg:h-[480px] rounded-3xl overflow-hidden shadow-xl border border-cream-200">
            <Image
              src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1000&auto=format&fit=crop&q=80"
              alt="Fresh culinary spices, vegetables, and traditional cooking in a warm home kitchen"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs font-bold text-forest-800 uppercase tracking-widest">
              Our Food Philosophy
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-950 leading-tight">
              Good Food Starts with Honest, Unadulterated Ingredients
            </h2>

            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              In modern cooking, shortcut ingredients and chemically refined oils have often replaced time-tested wisdom. We believe that true flavor and cardiovascular wellness come from simple, whole foods tempered with pure, cold-pressed oils.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-forest-100 text-forest-800 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Tested & Perfected Home Recipes</h4>
                  <p className="text-xs text-stone-600 mt-0.5">Every recipe is kitchen-tested for foolproof proportions, clear steps, and authentic regional flavor.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-forest-100 text-forest-800 shrink-0 mt-0.5">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Healthy Cooking & Smoke Point Science</h4>
                  <p className="text-xs text-stone-600 mt-0.5">We guide home cooks on pairing the right cooking oil—cold-pressed gingelly or double-filtered groundnut oil—for optimal heat stability and zero lipid oxidation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-forest-100 text-forest-800 shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900">Sweets Crafted with Pure Oils</h4>
                  <p className="text-xs text-stone-600 mt-0.5">Discover our signature sweet recipes made with natural sesame seeds, jaggery, and golden unadulterated oils.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The 8 Recipe Vault Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-700">
              Recipe Vault
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-950">
              8 Signature Recipe Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-600">
              Explore our curated archives designed for home chefs, tiffin lovers, and festive celebrations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'Vegetarian Recipes', slug: 'vegetarian-recipes', desc: 'All Indian & Non-Indian' },
              { name: 'Sweet Recipes', slug: 'sweet-recipes', desc: 'Made with pure oils & sesame' },
              { name: 'Non-Vegetarian', slug: 'non-vegetarian-recipes', desc: 'Aromatic curries & roasts' },
              { name: 'Festival Recipes', slug: 'festival-recipes', desc: 'Pooja dishes & crisp snacks' },
              { name: 'South Indian', slug: 'south-indian-recipes', desc: 'Sambar, dosas & podis' },
              { name: 'North Indian', slug: 'north-indian-recipes', desc: 'Dal tadkas & rich sabzis' },
              { name: 'Breakfast Recipes', slug: 'breakfast-recipes', desc: 'Quick morning energizers' },
              { name: 'Street Food', slug: 'street-food-recipes', desc: 'Crisp bajjis & pakoras' },
            ].map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group p-4 sm:p-5 rounded-2xl bg-cream-50 hover:bg-forest-950 hover:text-white border border-cream-200 hover:border-forest-900 transition-all duration-300 text-center flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-gold-600 group-hover:text-gold-400 mb-1">
                    0{i + 1}
                  </div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-stone-900 group-hover:text-cream-50">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 group-hover:text-stone-300 mt-1">
                    {cat.desc}
                  </p>
                </div>
                <span className="text-xs font-bold text-forest-800 group-hover:text-gold-400 mt-3 flex items-center justify-center gap-1">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Brand Heritage & Partnership */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-forest-950 text-white rounded-3xl p-8 sm:p-12 lg:p-14 border border-forest-900 shadow-xl grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 bg-gold-950/80 text-gold-400 border border-gold-800/60 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              Partnership In Purity
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
              In Association with A.S. Brand Oils
            </h3>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Our culinary platform proudly features authentic recipes developed in association with A.S. Brand Oils—pioneers in cold-pressed de-hulled gingelly oil, double-filtered groundnut oil, and sacred Pancha Thailam pooja formulations.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-gold-500 hover:bg-gold-400 text-forest-950 text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
              >
                View Verified Product Roster
              </Link>
              <a
                href="https://asbrandoils.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-300 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-full border border-stone-700 hover:border-stone-500 transition-colors"
              >
                Visit Official asbrandoils.com →
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 bg-forest-900/80 p-6 rounded-2xl border border-forest-800 space-y-3">
            <h4 className="font-serif font-bold text-sm text-gold-400 uppercase tracking-wider">
              Editorial Helpdesk & Inquiries
            </h4>
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="tel:9177455998" className="hover:text-gold-300 font-mono font-semibold">
                  +91 91774 55998
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:recipes@asbrandoils.com" className="hover:text-gold-300">
                  recipes@asbrandoils.com
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Editorial Desk • South Indian Culinary Research</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
