'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Globe,
  Clock,
  Users,
  Printer,
  CheckCircle2,
  ChefHat,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  Flame,
  Calendar,
  BookOpen,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface RecipeData {
  title?: string;
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  ingredients?: string[];
  instructions?: string[];
}

interface BilingualRecipeReaderProps {
  article: {
    id: string;
    title: string;
    titleTe?: string | null;
    excerpt: string;
    excerptTe?: string | null;
    content: string;
    contentTe?: string | null;
    recipeJson?: string | null;
    recipeJsonTe?: string | null;
    slug: string;
    readingTime: number;
    publishedAt: Date | string;
    featuredImage: string;
    imageAlt?: string | null;
    isSponsored?: boolean;
    sponsoredBrand?: string | null;
    category: {
      name: string;
      slug: string;
    };
  };
  processedHtmlEn: string;
  processedHtmlTe: string;
  initialLang?: 'en' | 'te';
}

export default function BilingualRecipeReader({
  article,
  processedHtmlEn,
  processedHtmlTe,
  initialLang = 'en',
}: BilingualRecipeReaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Language state: 'en' or 'te'
  const paramLang = searchParams?.get('lang');
  const [lang, setLang] = useState<'en' | 'te'>(
    paramLang === 'te' ? 'te' : initialLang === 'te' ? 'te' : 'en'
  );
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const urlLang = searchParams?.get('lang');
    if (urlLang === 'te' || urlLang === 'en') {
      setLang(urlLang);
    }
  }, [searchParams]);

  const handleLanguageChange = (newLang: 'en' | 'te') => {
    if (newLang === lang) return;
    setIsTransitioning(true);
    setLang(newLang);
    setCheckedIngredients({});

    // Smooth URL synchronization without full page reload
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (newLang === 'te') {
        params.set('lang', 'te');
      } else {
        params.delete('lang');
      }
      const queryString = params.toString();
      const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ''}`;
      window.history.replaceState(null, '', newUrl);
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 200);
  };

  // Parse Recipe JSONs
  let recipeEn: RecipeData = {};
  let recipeTe: RecipeData = {};
  try {
    if (article.recipeJson) recipeEn = JSON.parse(article.recipeJson);
  } catch {}
  try {
    if (article.recipeJsonTe) recipeTe = JSON.parse(article.recipeJsonTe);
  } catch {}

  const isTe = lang === 'te';

  // Dynamic Titles and Excerpts with graceful fallbacks
  const currentTitle = isTe
    ? article.titleTe || article.title
    : article.title;
  const currentExcerpt = isTe
    ? article.excerptTe || article.excerpt
    : article.excerpt;
  const currentRecipe = isTe
    ? (recipeTe.ingredients && recipeTe.ingredients.length > 0 ? recipeTe : recipeEn)
    : recipeEn;
  const currentHtml = isTe
    ? processedHtmlTe || article.contentTe || processedHtmlEn
    : processedHtmlEn;

  const ingredients = currentRecipe.ingredients || recipeEn.ingredients || [];
  const instructions = currentRecipe.instructions || recipeEn.instructions || [];
  const prepTime = isTe
    ? recipeTe.prepTime || '20 నిమిషాలు'
    : recipeEn.prepTime || '20 mins';
  const cookTime = isTe
    ? recipeTe.cookTime || '25 నిమిషాలు'
    : recipeEn.cookTime || '25 mins';
  const servings = isTe
    ? recipeTe.servings || '4 వ్యక్తులకు'
    : recipeEn.servings || '4 Servings';

  const toggleIngredient = (idx: number) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Header Block (H1, Excerpt, Language Switcher, Meta Strip) */}
      <div className="bg-cream-100/70 border-b border-cream-200 py-6 sm:py-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 mb-6 sm:mb-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Top Bar: Category Pill & Language Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div className="flex items-center gap-2">
              <Link
                href={`/${article.category.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-200/80 hover:bg-forest-300 px-3 py-1 rounded-full transition-colors"
              >
                {article.category.name}
              </Link>
              {article.isSponsored && (
                <span className="bg-gold-500 text-forest-950 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
                  Sponsored by {article.sponsoredBrand}
                </span>
              )}
            </div>

            {/* Language Switcher Button Group */}
            <div className="inline-flex items-center bg-white p-1 rounded-xl border border-cream-300 shadow-2xs self-start sm:self-auto">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  lang === 'en'
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-cream-100'
                }`}
              >
                <span>🇬🇧</span>
                <span>English</span>
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange('te')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  lang === 'te'
                    ? 'bg-forest-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-cream-100'
                }`}
              >
                <span>🇮🇳</span>
                <span>తెలుగు (Telugu)</span>
              </button>
            </div>
          </div>

          {/* Dynamic H1 Title with smooth CSS transition */}
          <h1
            className={`font-serif text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 leading-[1.2] tracking-tight transition-all duration-300 ${
              isTransitioning ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentTitle}
          </h1>

          {/* Dynamic Excerpt with smooth CSS transition */}
          <p
            className={`text-sm sm:text-lg text-stone-600 leading-relaxed font-normal transition-all duration-300 ${
              isTransitioning ? 'opacity-40 translate-y-1' : 'opacity-100 translate-y-0'
            }`}
          >
            {currentExcerpt}
          </p>

          {/* Meta Strip */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-cream-200 text-xs text-stone-500">
            <div className="flex items-center gap-4 text-stone-600 font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-forest-700" />
                {formatDate(article.publishedAt)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-forest-700" />
                {article.readingTime} {isTe ? 'నిమిషాల సమయం' : 'min read'}
              </span>
            </div>

            <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-300/60">
              {isTe ? 'తెలుగు వెర్షన్ అందుబాటులో ఉంది' : 'English Edition'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Featured Hero Image */}
      <figure className="mb-6 sm:mb-8">
        <div className="relative h-60 xs:h-72 sm:h-96 lg:h-[420px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm border border-cream-200 bg-stone-100">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt || currentTitle}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 800px"
          />
        </div>
        {article.imageAlt && (
          <figcaption className="mt-2.5 text-center text-xs text-stone-500 font-medium italic">
            {article.imageAlt}
          </figcaption>
        )}
      </figure>

      {/* 3. Quick Recipe Highlights & Metrics Bar */}
      <div className="bg-cream-50/90 rounded-2xl p-4 sm:p-5 border border-cream-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-forest-800 bg-forest-200/60 px-3 py-1 rounded-full">
            <ChefHat className="w-3.5 h-3.5" />
            {isTe ? 'సాంప్రదాయ వంటకం సూచనలు' : 'Culinary Masterclass Guide'}
          </div>
          <span className="text-xs text-stone-500 font-medium">
            {isTe ? 'తెలుగు వివరణ' : 'Authentic Home Recipe'}
          </span>
        </div>

        {/* Quick Recipe Metrics Pill Bar */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 pt-2 text-center">
          <div className="bg-white p-3 rounded-xl border border-cream-200 shadow-2xs">
            <div className="text-[11px] text-stone-500 font-semibold uppercase flex items-center justify-center gap-1">
              <Clock className="w-3 h-3 text-forest-700" />
              {isTe ? 'తయారీ సమయం' : 'Prep Time'}
            </div>
            <div className="font-bold text-stone-900 text-xs sm:text-sm mt-0.5">{prepTime}</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-cream-200 shadow-2xs">
            <div className="text-[11px] text-stone-500 font-semibold uppercase flex items-center justify-center gap-1">
              <Flame className="w-3 h-3 text-amber-600" />
              {isTe ? 'వంట సమయం' : 'Cook Time'}
            </div>
            <div className="font-bold text-stone-900 text-xs sm:text-sm mt-0.5">{cookTime}</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-cream-200 shadow-2xs">
            <div className="text-[11px] text-stone-500 font-semibold uppercase flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-forest-700" />
              {isTe ? 'పరిమాణం' : 'Servings'}
            </div>
            <div className="font-bold text-stone-900 text-xs sm:text-sm mt-0.5">{servings}</div>
          </div>
        </div>
      </div>

      {/* 4. Interactive Recipe Card (Ingredients + Step-by-Step Instructions) */}
      {(ingredients.length > 0 || instructions.length > 0) && (
        <div
          className={`bg-white rounded-3xl p-6 sm:p-8 border-2 border-forest-900/20 shadow-md space-y-8 transition-all duration-300 ${
            isTransitioning ? 'opacity-40' : 'opacity-100'
          }`}
        >
          {/* Card Top Strip */}
          <div className="flex items-center justify-between pb-5 border-b border-cream-200 flex-wrap gap-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-forest-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-gold-500" />
                {isTe ? 'రెసిపీ వివరాలు' : 'Interactive Recipe Card'}
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mt-0.5">
                {currentTitle}
              </h3>
            </div>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-forest-900 bg-cream-100 hover:bg-cream-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer border border-cream-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isTe ? 'ప్రింట్ చేయండి' : 'Print Recipe'}</span>
            </button>
          </div>

          {/* Ingredients Section */}
          {ingredients.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-forest-800" />
                  {isTe ? 'కావలసిన పదార్థాలు (Ingredients)' : 'Ingredients Checklist'}
                </h4>
                <span className="text-xs text-stone-400 font-medium">
                  {Object.values(checkedIngredients).filter(Boolean).length}/{ingredients.length}{' '}
                  {isTe ? 'పూర్తయ్యాయి' : 'checked'}
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-2.5">
                {ingredients.map((ing, idx) => {
                  const isChecked = Boolean(checkedIngredients[idx]);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleIngredient(idx)}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-cream-100/60 border-cream-300 text-stone-400 line-through'
                          : 'bg-cream-50/50 hover:bg-cream-100/80 border-cream-200 text-stone-800'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 transition-colors ${
                          isChecked ? 'text-forest-700' : 'text-stone-300'
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-medium leading-snug">{ing}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cooking Instructions Section */}
          {instructions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-cream-200">
              <h4 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-forest-800" />
                {isTe ? 'తయారీ విధానం (Step-by-Step Method)' : 'Step-by-Step Cooking Instructions'}
              </h4>

              <div className="space-y-3">
                {instructions.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-4 rounded-2xl bg-cream-50/60 border border-cream-200 text-stone-800 hover:border-cream-300 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-forest-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm leading-relaxed font-normal">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Natural A.S. Brand Product Callout for Recipe */}
          {(() => {
            const isDeepFry = /pakoda|pakora|bonda|bajji|murukku|vada|chicken 65|fish fry|parotta|chappathi|kulcha|tikka|jalfrezi|butter masala/i.test(article.title);
            const isNonVeg = /chettinad|mutton|prawn|egg masala|non-veg/i.test(article.title) || article.category.slug === 'non-vegetarian-recipes';
            const isSweet = /ladoo|laddu|panchamirtham|urundai|sweet/i.test(article.title) || article.category.slug === 'sweet-recipes';

            let oilEn = 'A.S. Brand Hulled Gingelly Oil';
            let oilTe = 'A.S. బ్రాండ్ హల్డ్ జింజెల్లీ ఆయిల్';
            let rationaleEn = 'De-hulled sesame seeds provide fragrant aroma, high antioxidant sesamol, and zero bitter taste for daily cooking.';
            let rationaleTe = 'చేదు లేకుండా సహజమైన సువాసన మరియు పోషకాల కోసం A.S. బ్రాండ్ హల్డ్ జింజెల్లీ ఆయిల్ వాడండి.';

            if (isDeepFry) {
              oilEn = 'A.S. Brand Groundnut Oil';
              oilTe = 'A.S. బ్రాండ్ వేరుశెనగ నూనె';
              rationaleEn = 'Double filtered from selected peanuts. Ensures crispy frying without excess oil absorption.';
              rationaleTe = 'నూనె పీల్చకుండా కరకరలాడే ఫ్రైస్ మరియు స్నాక్స్ కోసం స్వచ్ఛమైన వేరుశెనగ నూనె ఉత్తమం.';
            } else if (isNonVeg) {
              oilEn = 'Mansion Gingelly Oil';
              oilTe = 'మాన్షన్ జింజెల్లీ ఆయిల్';
              rationaleEn = 'Whole raw gingelly seeds pressed to deliver robust rustic flavor and tenderize meat spices.';
              rationaleTe = 'ఘాటైన చికెన్, మటన్, ప్రాన్ రోస్ట్స్ మరియు నాన్‌వెజ్ గ్రేవీలకు మాన్షన్ ఆయిల్ సరైన ఎంపిక.';
            } else if (isSweet) {
              oilEn = 'A.S. Brand Hulled Gingelly Seeds & Pure Oils';
              oilTe = 'A.S. బ్రాండ్ హల్డ్ తెల్ల నువ్వులు & నూనెలు';
              rationaleEn = 'White sesame seeds with natural crunch and nutty aroma for traditional sweets.';
              rationaleTe = 'నువ్వుల లడ్డూలు, పండుగ స్వీట్లకు స్వచ్ఛమైన A.S. బ్రాండ్ హల్డ్ సీడ్స్ వాడండి.';
            }

            return (
              <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-forest-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm border border-gold-500/30">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-gold-500/20 text-gold-400 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {isTe ? `సిఫార్సు చేసిన నూనె: ${oilTe}` : `Recommended Cooking Oil: ${oilEn}`}
                    </div>
                    <div className="text-xs text-stone-300 mt-0.5 leading-relaxed">
                      {isTe ? rationaleTe : rationaleEn}
                    </div>
                  </div>
                </div>

                <a
                  href="https://asbrandoils.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-gold-500 hover:bg-gold-400 text-forest-950 px-4 py-2.5 rounded-xl transition-all shrink-0 shadow-sm"
                >
                  {isTe ? 'ఆర్డర్ చేయండి' : 'Buy Official Pack'}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })()}
        </div>
      )}

      {/* 5. Rich Editorial Article Content Body (Introduction & Cooking Notes) */}
      {currentHtml && (
        <div
          className={`editorial-prose bg-white rounded-3xl p-6 sm:p-8 border border-cream-200 shadow-xs transition-all duration-300 ${
            isTransitioning ? 'opacity-40' : 'opacity-100'
          }`}
          dangerouslySetInnerHTML={{ __html: currentHtml }}
        />
      )}
    </div>
  );
}
