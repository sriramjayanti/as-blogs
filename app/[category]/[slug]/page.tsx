import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';
import { processArticleContent, PromotionRuleWithProduct } from '@/lib/promotion-engine';
import {
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
} from '@/lib/seo';
import ArticleCard from '@/components/ArticleCard';
import InlineProductCard from '@/components/InlineProductCard';
import EndArticleCta from '@/components/EndArticleCta';
import ArticleSidebarPromo from '@/components/ArticleSidebarPromo';
import FaqAccordion from '@/components/FaqAccordion';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import BilingualRecipeReader from '@/components/BilingualRecipeReader';
import { ChevronRight } from 'lucide-react';

interface ArticlePageProps {
  params: {
    category: string;
    slug: string;
  };
  searchParams?: {
    lang?: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: { category: true, author: true },
  });

  if (!article) {
    return { title: 'Article Not Found' };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asbrandoils.com';
  const canonical =
    article.canonicalUrl || `${siteUrl}/${article.category.slug}/${article.slug}`;

  return {
    title: article.seoTitle || `${article.title} | A.S. Heritage & Living`,
    description: article.metaDescription || article.excerpt,
    alternates: {
      canonical: canonical,
    },
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.metaDescription || article.excerpt,
      url: canonical,
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      modifiedTime: article.updatedAt.toISOString(),
      authors: ['A.S. Heritage Living'],
      images: [
        {
          url: article.ogImage || article.featuredImage,
          width: 1200,
          height: 630,
          alt: article.imageAlt || article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle || article.title,
      description: article.metaDescription || article.excerpt,
      images: [article.ogImage || article.featuredImage],
    },
  };
}

export default async function ArticlePage({ params, searchParams }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug },
    include: {
      category: true,
      author: true,
      tags: true,
    },
  });

  if (!article || article.category.slug !== params.category) {
    notFound();
  }

  // Fetch active promotion rules with their associated products
  const rawRules = await prisma.promotionRule.findMany({
    where: { isActive: true },
    include: { product: true },
    orderBy: { priority: 'desc' },
  });

  const parsedRules: PromotionRuleWithProduct[] = rawRules.map((r) => ({
    id: r.id,
    name: r.name,
    keywords: r.keywords,
    matchType: r.matchType,
    placementTypes: JSON.parse(r.placementTypes || '[]'),
    maxLinksPerArticle: r.maxLinksPerArticle,
    categoryFilter: r.categoryFilter,
    isActive: r.isActive,
    priority: r.priority,
    product: {
      id: r.product.id,
      name: r.product.name,
      slug: r.product.slug,
      shortDescription: r.product.shortDescription,
      imageUrl: r.product.imageUrl,
      productUrl: r.product.productUrl,
      marketplaceLinks: JSON.parse(r.product.marketplaceLinks || '[]'),
    },
  }));

  // Process the English content with contextual promotion engine
  const processedEn = processArticleContent(
    article.content,
    parsedRules,
    article.category.slug,
    article.slug
  );

  // Process the Telugu content if present
  const processedTe = article.contentTe
    ? processArticleContent(
        article.contentTe,
        parsedRules,
        article.category.slug,
        article.slug
      )
    : processedEn;

  // Fetch related articles within the same category
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: { not: article.id },
      status: 'PUBLISHED',
    },
    include: {
      category: true,
      author: true,
    },
    take: 3,
  });

  // Parse FAQs if present
  let faqs = [];
  try {
    if (article.faqsJson) {
      faqs = JSON.parse(article.faqsJson);
    }
  } catch {
    faqs = [];
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://asbrandoils.com';
  const articleUrl = `${siteUrl}/${article.category.slug}/${article.slug}`;

  // Generate structured schemas
  const articleJsonLd = generateArticleJsonLd({
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.excerpt,
    url: articleUrl,
    imageUrl: article.featuredImage,
    publishedTime: article.publishedAt.toISOString(),
    modifiedTime: article.updatedAt.toISOString(),
    authorName: 'A.S. Heritage Living',
    categoryName: article.category.name,
  });

  const breadcrumbs = [
    { name: 'Home', item: siteUrl },
    { name: article.category.name, item: `${siteUrl}/${article.category.slug}` },
    { name: article.title, item: articleUrl },
  ];
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);
  const faqJsonLd = generateFaqJsonLd(faqs);

  return (
    <article className="pb-20">
      {/* Analytics Event Dispatcher */}
      <AnalyticsTracker articleId={article.id} />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Breadcrumb Navigation */}
      <div className="bg-cream-100/50 border-b border-cream-200 py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium flex-wrap">
            <Link href="/" className="hover:text-forest-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <Link
              href={`/${article.category.slug}`}
              className="hover:text-forest-900 transition-colors"
            >
              {article.category.name}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-forest-900 font-semibold truncate max-w-[140px] xs:max-w-xs">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Article Body */}
          <div className="lg:col-span-8 max-w-3xl">
            {/* Bilingual Interactive Recipe Reader (English & Telugu) */}
            <BilingualRecipeReader
              article={article}
              processedHtmlEn={processedEn.html}
              processedHtmlTe={processedTe.html}
              initialLang={searchParams?.lang === 'te' ? 'te' : 'en'}
            />

            {/* Inline Product Placement (if triggered by context rules) */}
            {processedEn.hasInlineCard && processedEn.inlineCardProduct && (
              <InlineProductCard
                product={processedEn.inlineCardProduct}
                articleSlug={article.slug}
              />
            )}

            {/* Interactive FAQs Accordion */}
            {faqs.length > 0 && <FaqAccordion faqs={faqs} />}

            {/* End-of-Article Conversion CTA */}
            {processedEn.endCtaProduct && (
              <EndArticleCta
                product={processedEn.endCtaProduct}
                articleSlug={article.slug}
              />
            )}

            {/* Tags Strip */}
            {article.tags.length > 0 && (
              <div className="my-8 pt-6 border-t border-cream-200">
                <div className="text-xs uppercase font-bold text-stone-400 tracking-wider mb-2.5">
                  Related Topics & Clusters:
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((t) => (
                    <span
                      key={t.id}
                      className="text-xs bg-cream-200/80 hover:bg-forest-900 hover:text-white text-stone-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      #{t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}


          </div>

          {/* Desktop Sticky Sidebar */}
          <aside className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              {/* Non-intrusive Contextual Product Sidebar */}
              <ArticleSidebarPromo
                products={processedEn.matchedProducts}
                articleSlug={article.slug}
              />

              {/* Related Topic Cluster Box */}
              {relatedArticles.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-cream-200 shadow-sm">
                  <h4 className="font-serif font-bold text-stone-900 text-base mb-3 pb-2 border-b border-cream-200">
                    More in {article.category.name}
                  </h4>
                  <div className="space-y-1">
                    {relatedArticles.map((rel) => (
                      <ArticleCard key={rel.id} article={rel} variant="compact" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Mobile / Tablet Related Articles Grid */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-10 border-t-2 border-forest-900/10">
            <h3 className="font-serif text-2xl font-bold text-stone-950 mb-6">
              Recommended Reading in {article.category.name}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <ArticleCard key={rel.id} article={rel} variant="standard" />
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
