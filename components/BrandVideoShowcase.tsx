'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Sparkles,
  Flame,
  ShieldCheck,
  ArrowUpRight,
  Youtube,
  CheckCircle2,
  Tv,
  Award,
} from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  titleTe: string;
  duration: string;
  category: string;
  thumbnail: string;
  youtubeUrl: string;
  embedId?: string;
  description: string;
  descriptionTe: string;
  oilUsed: string;
  oilUsedTe: string;
}

const BRAND_VIDEOS: VideoItem[] = [
  {
    id: 'vid-1',
    title: 'The Art of Traditional Hulled Gingelly Oil & Tempering',
    titleTe: 'సాంప్రదాయ హల్డ్ జింజెల్లీ ఆయిల్ & పోపు తయారీ రహస్యాలు',
    duration: '04:15',
    category: 'Heritage Craft',
    thumbnail: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/@asbrandoils',
    embedId: 'dQw4w9WgXcQ', // fallback or channel showcase
    description: 'Discover how A.S. Brand carefully de-hulls white sesame seeds to eliminate bitterness and preserve natural sesamol antioxidants for aromatic daily cooking.',
    descriptionTe: 'చేదు లేకుండా సహజమైన సువాసన మరియు పోషకాలను నిలుపుతూ A.S. బ్రాండ్ హల్డ్ జింజెల్లీ ఆయిల్ ఎలా తయారవుతుందో చూడండి.',
    oilUsed: 'A.S. Brand Hulled Gingelly Oil',
    oilUsedTe: 'A.S. బ్రాండ్ హల్డ్ జింజెల్లీ ఆయిల్',
  },
  {
    id: 'vid-2',
    title: 'High Smoke Point Frying: Master Crispy Snacks with Groundnut Oil',
    titleTe: 'హై స్మోక్ పాయింట్ ఫ్రైయింగ్: గ్రౌండ్‌నట్ ఆయిల్‌తో క్రిస్పీ స్నాక్స్',
    duration: '05:30',
    category: 'Culinary Science',
    thumbnail: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/@asbrandoils',
    description: 'Why 232°C (450°F) high smoke point double-filtered peanut oil ensures pakoras, murukkus, and fish fry remain crispy without burning.',
    descriptionTe: '232°C స్మోక్ పాయింట్ కలిగిన వేరుశెనగ నూనెతో పకోడీలు, మురుకులు నూనె పీల్చకుండా కరకరలాడేలా వేయించుకోవచ్చు.',
    oilUsed: 'A.S. Brand Groundnut Oil',
    oilUsedTe: 'A.S. బ్రాండ్ వేరుశెనగ నూనె',
  },
  {
    id: 'vid-3',
    title: 'Chettinad Pepper Chicken & Spicy Gravies with Mansion Oil',
    titleTe: 'మాన్షన్ ఆయిల్‌తో ఘుమఘుమలాడే చెట్టినాడు పెప్పర్ చికెన్ & రోస్ట్స్',
    duration: '06:10',
    category: 'Heritage Non-Veg',
    thumbnail: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/@asbrandoils',
    description: 'Watch how whole-seed Mansion Gingelly Oil captures robust heat, blends with stone-ground black pepper, and creates irresistible rustic gravy.',
    descriptionTe: 'సాంప్రదాయ హోల్ సీడ్ మాన్షన్ జింజెల్లీ ఆయిల్‌తో చెట్టినాడు స్టైల్ ఘాటైన చికెన్ రోస్ట్ ఎలా చేయాలో చూడండి.',
    oilUsed: 'Mansion Gingelly Oil',
    oilUsedTe: 'మాన్షన్ జింజెల్లీ ఆయిల్',
  },
  {
    id: 'vid-4',
    title: 'Festival Sweets & Til Ladoos: Pure Sesame Seeds & Oils',
    titleTe: 'పండుగ స్వీట్లు & నువ్వుల లడ్డూ: స్వచ్ఛమైన జింజెల్లీ సీడ్స్ రహస్యం',
    duration: '03:45',
    category: 'Festival & Sweets',
    thumbnail: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    youtubeUrl: 'https://www.youtube.com/@asbrandoils',
    description: 'Learn the heirloom technique of making melt-in-mouth Til Ladoos using A.S. Brand premium white hulled sesame seeds and pure oils.',
    descriptionTe: 'A.S. బ్రాండ్ హల్డ్ తెల్ల నువ్వులు మరియు స్వచ్ఛమైన నూనెతో రుచికరమైన నువ్వుల లడ్డూ తయారీ విధానం.',
    oilUsed: 'A.S. Brand Hulled Gingelly Seeds',
    oilUsedTe: 'A.S. బ్రాండ్ హల్డ్ జింజెల్లీ సీడ్స్',
  },
];

export default function BrandVideoShowcase() {
  const [activeVideo, setActiveVideo] = useState<VideoItem>(BRAND_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="bg-forest-950 text-white rounded-3xl p-6 sm:p-10 lg:p-12 border-2 border-gold-500/20 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-forest-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-8 border-b border-forest-800">
        <div>
          <div className="inline-flex items-center gap-2 bg-gold-950/80 text-gold-400 border border-gold-700/60 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Tv className="w-3.5 h-3.5 text-gold-400" />
            A.S. Brand Kitchen Video Masterclass
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-cream-50 leading-tight">
            Watch & Learn: The Science of Cooking with Pure Oils
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm mt-2 max-w-2xl font-normal leading-relaxed">
            Step inside our culinary masterclass videos from <strong>@asbrandoils</strong>. See how smoke points, whole-seed pressing, and heirloom spices combine to create unforgettable dishes.
          </p>
        </div>

        <a
          href="https://www.youtube.com/@asbrandoils"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 self-start md:self-auto"
        >
          <Youtube className="w-4 h-4" />
          <span>Subscribe on YouTube</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Video & Playlist Grid */}
      <div className="grid lg:grid-cols-12 gap-8 mt-8 items-start">
        {/* Featured Video Player Area */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-video rounded-2xl overflow-hidden bg-forest-900 border border-forest-800 shadow-xl group">
            <Image
              src={activeVideo.thumbnail}
              alt={activeVideo.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent" />

            {/* Play Button Overlay */}
            <a
              href={activeVideo.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold-500 hover:bg-gold-400 text-forest-950 flex items-center justify-center shadow-2xl transition-transform transform group-hover:scale-110">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
              </div>
            </a>

            {/* Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-forest-950/80 backdrop-blur-sm text-gold-400 border border-gold-500/30 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-lg">
                {activeVideo.category} • {activeVideo.duration}
              </span>
            </div>

            {/* Bottom Title Bar */}
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="text-xs text-gold-400 font-bold uppercase tracking-wider">
                Recommended Oil: {activeVideo.oilUsed}
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold leading-snug mt-0.5">
                {activeVideo.title}
              </h3>
            </div>
          </div>

          {/* Video Description & Direct Action */}
          <div className="bg-forest-900/60 rounded-2xl p-4 sm:p-5 border border-forest-800 space-y-3">
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
              {activeVideo.description}
            </p>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-forest-800/80 text-xs">
              <div className="flex items-center gap-2 text-gold-400 font-semibold">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <span>100% Cold-Pressed Purity • Zero Bitter Aftertaste</span>
              </div>
              <a
                href="https://asbrandoils.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-gold-400 hover:text-white transition-colors"
              >
                <span>Shop {activeVideo.oilUsed}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Video Playlist Sidebar */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2">
            More Culinary Masterclass Episodes:
          </div>

          <div className="space-y-2.5">
            {BRAND_VIDEOS.map((vid) => {
              const isSelected = activeVideo.id === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => setActiveVideo(vid)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                    isSelected
                      ? 'bg-forest-900 border-gold-500/70 shadow-md'
                      : 'bg-forest-950/60 hover:bg-forest-900/70 border-forest-800/70'
                  }`}
                >
                  <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border border-forest-700 bg-forest-900">
                    <Image
                      src={vid.thumbnail}
                      alt={vid.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-forest-950/40 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-[10px] text-gold-400 font-bold uppercase tracking-wider">
                      <span>{vid.category}</span>
                      <span className="text-stone-400">{vid.duration}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-2 mt-0.5">
                      {vid.title}
                    </h4>
                    <div className="text-[11px] text-stone-300 truncate mt-1">
                      {vid.oilUsed}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Brand Trust Footer */}
          <div className="mt-4 p-4 rounded-2xl bg-forest-900/40 border border-forest-800 text-xs text-stone-300 space-y-2">
            <div className="flex items-center gap-2 text-gold-400 font-bold">
              <Award className="w-4 h-4" />
              <span>Ambati Subbanna & Co. Oil Firm (A.S. Brand)</span>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed font-normal">
              Supplying pure cold-pressed Gingelly and Groundnut oils for generations. Free shipping across AP, Telangana, Bangalore, and Chennai!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
