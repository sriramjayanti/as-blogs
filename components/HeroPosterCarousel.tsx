'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Info,
  Candy,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface Slide {
  image: string;
  badge: string;
  badgeIcon: string;
  title: string;
  subtitle: string;
  highlightTag?: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  secondaryBtnLink: string;
}

const SLIDES: Slide[] = [
  {
    image: 'https://asbrandoils.com/cdn/shop/files/oils_banner_1920x1080_3821eb9b-0efc-45ef-ab45-2dac30595174_1600x.jpg',
    badge: 'My Everyday Kitchen • Healthy Food Recipes',
    badgeIcon: 'Sparkles',
    title: 'Delicious Food Recipe Ideas for Your Everyday Kitchen',
    subtitle: 'Explore authentic home recipes, oil-based traditional sweets, crispy street food favorites, and healthy South & North Indian culinary classics made with honest ingredients.',
    primaryBtnText: 'About Our Kitchen',
    primaryBtnLink: '/about',
    secondaryBtnText: 'Oil-Based Sweets',
    secondaryBtnLink: '/sweet-recipes',
  },
  {
    image: 'https://asbrandoils.com/cdn/shop/files/Gingelly_Oil_banner_1600x.jpg',
    badge: 'A.S. Brand Flagship Purity • Cold-Pressed Tradition',
    badgeIcon: 'Flame',
    title: 'Pure Hulled Gingelly Oil: The Soul of South Indian Gastronomy',
    subtitle: 'De-hulled white sesame seeds deliver celestial nutty aroma, rich natural sesamol antioxidants, and zero bitterness in every sambar, rasam, and tawa dosa.',
    primaryBtnText: 'South Indian Recipes',
    primaryBtnLink: '/south-indian-recipes',
    secondaryBtnText: 'Explore Hulled Oil',
    secondaryBtnLink: '/products',
  },
  {
    image: 'https://asbrandoils.com/cdn/shop/files/Groundnut_1_1600x.jpg',
    badge: 'Crispy Frying Secret • Double Filtered Peanut Oil',
    badgeIcon: 'ShieldCheck',
    title: 'Crispy Frying & Street Food with A.S. Brand Groundnut Oil',
    subtitle: 'Double filtered from handpicked peanuts. Ensures golden, crispy pakodas, murukkus, and fish fry without greasy oil absorption.',
    primaryBtnText: 'Street Food Recipes',
    primaryBtnLink: '/street-food-recipes',
    secondaryBtnText: 'Groundnut Oil Guide',
    secondaryBtnLink: '/health-wellness/groundnut-oil-vs-refined-oils-cold-pressed-benefits',
  },
  {
    image: 'https://asbrandoils.com/cdn/shop/files/mansion_gigelly_oil_taglines_1600x.jpg',
    badge: 'Heritage Non-Veg & Robust Curries • Whole Seed Character',
    badgeIcon: 'Flame',
    title: 'Mansion Gingelly Oil: Bold Taste for Spicy Roasts & Curries',
    subtitle: 'Crafted from whole raw gingelly seeds to tenderize meat and capture irresistible aroma in Chettinad Pepper Chicken, Andhra Mutton Chops & Prawn fry.',
    primaryBtnText: 'Non-Vegetarian Recipes',
    primaryBtnLink: '/non-vegetarian-recipes',
    secondaryBtnText: 'Pantry Roster',
    secondaryBtnLink: '/products',
  },
  {
    image: 'https://asbrandoils.com/cdn/shop/files/Hulled_gingelly_seeds_banner_01_1600x.jpg',
    badge: 'Festive Confections • Pure White Sesame Seeds',
    badgeIcon: 'Sparkles',
    title: 'Traditional Festive Sweets & Til Ladoos with Pure Seeds',
    subtitle: 'Handcrafted festival sweets made with A.S. Brand hulled white sesame seeds, pure jaggery, and unadulterated cold-pressed cooking oils.',
    primaryBtnText: 'Festival Recipes',
    primaryBtnLink: '/festival-recipes',
    secondaryBtnText: 'Sweet Recipes',
    secondaryBtnLink: '/sweet-recipes',
  },
];

const CATEGORIES = [
  { name: 'Vegetarian Recipes', slug: 'vegetarian-recipes' },
  { name: 'Sweet Recipes (Oils)', slug: 'sweet-recipes' },
  { name: 'Non-Vegetarian', slug: 'non-vegetarian-recipes' },
  { name: 'Festival Recipes', slug: 'festival-recipes' },
  { name: 'South Indian', slug: 'south-indian-recipes' },
  { name: 'North Indian', slug: 'north-indian-recipes' },
  { name: 'Breakfast Recipes', slug: 'breakfast-recipes' },
  { name: 'Street Food', slug: 'street-food-recipes' },
];

export default function HeroPosterCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentIndex];

  return (
    <section
      className="relative rounded-3xl overflow-hidden bg-forest-950 text-white border border-forest-900 shadow-2xl transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Poster Images with Smooth Fade Transition */}
      <div className="absolute inset-0">
        {SLIDES.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-85 sm:opacity-90 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority={idx === 0}
              className="object-cover object-center transition-transform duration-1000"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        ))}

        {/* Soft, Transparent Gradient Overlays for High Poster Clarity & Crisp Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/35 to-forest-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/50 to-transparent" />
      </div>

      {/* Main Poster Content with Enhanced Text Shadow */}
      <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-4xl space-y-5 min-h-[460px] sm:min-h-[520px] flex flex-col justify-between">
        <div className="space-y-4">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 bg-forest-950/90 backdrop-blur-md text-gold-400 border border-gold-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>{currentSlide.badge}</span>
          </div>

          {/* H1 Main Title */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-cream-50 leading-[1.14] tracking-tight transition-all duration-500 drop-shadow-lg">
            {currentSlide.title}
          </h1>

          {/* Subtitle Description */}
          <p className="text-stone-100 text-sm sm:text-base lg:text-lg leading-relaxed max-w-2xl font-medium drop-shadow-md">
            {currentSlide.subtitle}
          </p>

          {/* Quick Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href={currentSlide.primaryBtnLink}
              className="bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-full transition-all shadow-md flex items-center gap-2"
            >
              <Info className="w-4 h-4" /> {currentSlide.primaryBtnText}
            </Link>

            <Link
              href={currentSlide.secondaryBtnLink}
              className="bg-forest-900/90 hover:bg-forest-800 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-full border border-forest-700 hover:border-gold-500 transition-all flex items-center gap-2"
            >
              <Candy className="w-4 h-4 text-gold-400" /> {currentSlide.secondaryBtnText}
            </Link>

            <Link
              href="/products"
              className="text-stone-300 hover:text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-full border border-stone-700 hover:border-stone-500 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-gold-400" /> A.S. Brand Pantry
            </Link>
          </div>
        </div>

        {/* 8 Category Discovery Pills */}
        <div className="pt-4 border-t border-forest-800/80">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
              Explore Recipe Categories:
            </div>
            {/* Slide Indicators */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`h-2 rounded-full transition-all ${
                    dotIdx === currentIndex ? 'w-6 bg-gold-500' : 'w-2 bg-stone-600 hover:bg-stone-400'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {CATEGORIES.map((cat) => (
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

      {/* Navigation Arrow Controls */}
      <button
        type="button"
        onClick={handlePrev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-forest-950/70 hover:bg-gold-500 hover:text-forest-950 text-white border border-forest-800 flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm"
        aria-label="Previous Poster"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-forest-950/70 hover:bg-gold-500 hover:text-forest-950 text-white border border-forest-800 flex items-center justify-center transition-colors shadow-lg backdrop-blur-sm"
        aria-label="Next Poster"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}
