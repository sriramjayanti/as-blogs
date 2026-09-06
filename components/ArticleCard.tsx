import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { Clock, ArrowUpRight } from 'lucide-react';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    featuredImage: string;
    imageAlt?: string | null;
    readingTime: number;
    publishedAt: string | Date;
    isSponsored?: boolean;
    sponsoredBrand?: string | null;
    category: {
      name: string;
      slug: string;
    };
    author: {
      name: string;
      slug: string;
      avatar: string;
    };
  };
  variant?: 'featured' | 'standard' | 'compact' | 'horizontal';
}

export default function ArticleCard({ article, variant = 'standard' }: ArticleCardProps) {
  const articleUrl = `/${article.category.slug}/${article.slug}`;

  if (variant === 'featured') {
    return (
      <article className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-cream-200 grid lg:grid-cols-12 gap-0">
        <div className="lg:col-span-7 relative h-64 sm:h-96 lg:h-full min-h-[240px] sm:min-h-[320px] overflow-hidden bg-stone-100">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex flex-wrap gap-1.5 sm:gap-2">
            <span className="bg-forest-900/90 backdrop-blur-md text-white font-semibold text-[11px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              {article.category.name}
            </span>
            {article.isSponsored && (
              <span className="bg-gold-500 text-forest-950 font-bold text-[10px] sm:text-xs px-2.5 py-1 rounded-full uppercase tracking-wider">
                In Association with {article.sponsoredBrand || 'A.S. Brand'}
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 p-5 sm:p-8 lg:p-10 flex flex-col justify-between bg-cream-50/50">
          <div>
            <div className="flex items-center gap-2 sm:gap-3 text-xs text-stone-500 font-medium mb-2.5 sm:mb-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-forest-700" />
                {article.readingTime} min read
              </span>
              <span>•</span>
              <span>{formatDate(article.publishedAt)}</span>
            </div>

            <h2 className="font-serif text-xl sm:text-3xl lg:text-4xl font-bold text-stone-950 group-hover:text-forest-800 transition-colors leading-snug sm:leading-tight mb-3 sm:mb-4">
              <Link href={articleUrl}>{article.title}</Link>
            </h2>


            <p className="text-stone-600 text-sm sm:text-base line-clamp-3 leading-relaxed mb-6">
              {article.excerpt}
            </p>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-cream-200">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-cream-300">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-stone-900">{article.author.name}</div>
                <div className="text-[11px] text-stone-500">Editorial Staff</div>
              </div>
            </div>

            <Link
              href={articleUrl}
              className="inline-flex items-center gap-1 text-sm font-bold text-forest-900 group-hover:text-gold-600 transition-colors"
            >
              Read Article <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex items-start gap-4 py-3.5 border-b border-cream-200 last:border-0">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-stone-100">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="80px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold text-forest-800 uppercase tracking-wider mb-1">
            {article.category.name}
          </div>
          <h3 className="font-serif text-sm sm:text-base font-bold text-stone-900 group-hover:text-forest-800 transition-colors line-clamp-2 leading-snug">
            <Link href={articleUrl}>{article.title}</Link>
          </h3>
          <div className="text-[11px] text-stone-400 mt-1">
            {article.readingTime} min read • {formatDate(article.publishedAt)}
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group bg-white rounded-2xl overflow-hidden border border-cream-200 hover:shadow-lg transition-all duration-300 flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/3 min-h-[200px] bg-stone-100">
          <Image
            src={article.featuredImage}
            alt={article.imageAlt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        </div>
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-2">
              <span className="text-forest-800 font-bold uppercase tracking-wider">
                {article.category.name}
              </span>
              <span>•</span>
              <span>{article.readingTime} min read</span>
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-950 group-hover:text-forest-800 transition-colors line-clamp-2 leading-tight mb-2">
              <Link href={articleUrl}>{article.title}</Link>
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs text-stone-500 pt-3 border-t border-cream-100">
            <span>By {article.author.name}</span>
            <span className="font-semibold text-forest-900 group-hover:text-gold-600 flex items-center gap-1">
              Read Story <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </article>
    );
  }

  // Standard 3-column Card
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-cream-200 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-52 overflow-hidden bg-stone-100">
        <Image
          src={article.featuredImage}
          alt={article.imageAlt || article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="bg-forest-950/80 backdrop-blur-md text-white font-semibold text-[11px] px-2.5 py-1 rounded-full uppercase tracking-wider">
            {article.category.name}
          </span>
          {article.isSponsored && (
            <span className="bg-gold-500 text-forest-950 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase">
              Partner
            </span>
          )}
        </div>
      </div>

      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between bg-white">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-medium mb-2.5">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-forest-700" />
              {article.readingTime} min read
            </span>
            <span>•</span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-stone-950 group-hover:text-forest-800 transition-colors line-clamp-2 leading-snug mb-2.5">
            <Link href={articleUrl}>{article.title}</Link>
          </h3>

          <p className="text-stone-600 text-sm line-clamp-3 leading-relaxed mb-4">
            {article.excerpt}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-cream-100">
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-cream-200">
              <Image
                src={article.author.avatar}
                alt={article.author.name}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-semibold text-stone-800">{article.author.name}</span>
          </div>

          <Link
            href={articleUrl}
            className="text-xs font-bold text-forest-900 group-hover:text-gold-600 flex items-center gap-1 transition-colors"
          >
            Read <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
