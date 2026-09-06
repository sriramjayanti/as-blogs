import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { buildUtmUrl } from '@/lib/promotion-engine';

interface MidArticleBannerProps {
  campaign?: {
    id: string;
    title: string;
    description: string;
    bannerImageUrl: string;
    ctaText: string;
    destinationUrl: string;
  };
  articleSlug?: string;
}

export default function MidArticleBanner({ campaign, articleSlug = 'article' }: MidArticleBannerProps) {
  if (!campaign) return null;

  const url = buildUtmUrl(
    campaign.destinationUrl || 'https://asbrandoils.com/',
    'article_middle_banner',
    campaign.id,
    articleSlug
  );

  return (
    <div className="my-10 rounded-2xl overflow-hidden relative bg-stone-900 border border-stone-800 shadow-md not-prose">
      <div className="relative h-48 sm:h-64 w-full">
        <Image
          src={campaign.bannerImageUrl}
          alt={campaign.title}
          fill
          className="object-cover opacity-35"
          sizes="(max-width: 768px) 100vw, 800px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/70 to-transparent flex flex-col justify-end p-6 sm:p-8">
          <div className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-1">
            Special Spotlight
          </div>
          <h4 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
            {campaign.title}
          </h4>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl line-clamp-2">
            {campaign.description}
          </p>
          <div className="mt-4">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              data-placement="mid_article_banner"
              data-campaign-id={campaign.id}
              className="inline-flex items-center gap-1.5 bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs px-4 py-2.5 rounded-full transition-colors"
            >
              {campaign.ctaText} <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
