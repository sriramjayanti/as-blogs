import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import ArticleCard from '@/components/ArticleCard';
import { generateBreadcrumbJsonLd } from '@/lib/seo';
import { ChevronRight, Sparkles } from 'lucide-react';

interface CategoryPageProps {
  params: { category: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
  });

  if (!category) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `${category.name} | Editorial Archive`,
    description: category.description,
    openGraph: {
      title: `${category.name} | A.S. Heritage & Living`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.category },
    include: {
      articles: {
        where: { status: 'PUBLISHED' },
        include: {
          category: true,
          author: true,
        },
        orderBy: { publishedAt: 'desc' },
      },
    },
  });

  if (!category) {
    notFound();
  }

  const breadcrumbs = [
    { name: 'Home', item: 'https://asbrandoils.com/' },
    { name: category.name, item: `https://asbrandoils.com/${category.slug}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd(breadcrumbs);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Breadcrumb Header */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link href="/" className="hover:text-forest-900 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-forest-800 font-bold">{category.name}</span>
      </nav>

      {/* Category Header Hero */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-cream-200 shadow-sm relative overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-forest-800 uppercase tracking-widest bg-forest-100/80 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" /> Topic Cluster Archive
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950">
            {category.name}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {category.description}
          </p>
        </div>
      </div>

      {/* Articles Grid */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-cream-200">
          <h2 className="font-serif text-lg font-bold text-stone-900">
            Published Articles ({category.articles.length})
          </h2>
        </div>

        {category.articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {category.articles.map((art) => (
              <ArticleCard key={art.id} article={art} variant="standard" />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-cream-200">
            <p className="text-stone-500 text-sm">
              Articles in this category are being prepared by the editorial team.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
