import { prisma } from '@/lib/db';
import Link from 'next/link';
import {
  FileText,
  MousePointerClick,
  Sparkles,
  ShoppingBag,
  ArrowUpRight,
  TrendingUp,
  Eye,
} from 'lucide-react';

export const revalidate = 0; // Fresh metrics

export default async function AdminDashboardPage() {
  const [
    articlesCount,
    productsCount,
    rulesCount,
    totalViewsResult,
    totalClicksResult,
    recentEvents,
    recentArticles,
  ] = await Promise.all([
    prisma.article.count(),
    prisma.product.count(),
    prisma.promotionRule.count({ where: { isActive: true } }),
    prisma.article.aggregate({ _sum: { viewsCount: true } }),
    prisma.analyticsEvent.count({
      where: {
        eventType: { in: ['product_click', 'contextual_link_click', 'outbound_asbrand_click'] },
      },
    }),
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.article.findMany({
      include: { category: true },
      orderBy: { publishedAt: 'desc' },
      take: 5,
    }),
  ]);

  const totalViews = totalViewsResult._sum.viewsCount || 0;
  const totalClicks = totalClicksResult || 0;
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-100">
            Editorial Performance & Promotion Console
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Real-time organic traffic, SEO topic clusters, and A.S. Brand outbound conversion analytics.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-stone-950 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shadow-md"
        >
          <FileText className="w-4 h-4" />
          Publish New Article
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold uppercase tracking-wider">
            <span>Published Articles</span>
            <FileText className="w-4 h-4 text-forest-400" />
          </div>
          <div className="text-3xl font-bold text-white font-serif">{articlesCount}</div>
          <div className="text-[11px] text-stone-500">Across 6 active topic clusters</div>
        </div>

        <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold uppercase tracking-wider">
            <span>Total Organic Reads</span>
            <Eye className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-bold text-white font-serif">{totalViews}</div>
          <div className="text-[11px] text-cyan-400/80 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Indexed in XML sitemap
          </div>
        </div>

        <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold uppercase tracking-wider">
            <span>Outbound Brand Clicks</span>
            <MousePointerClick className="w-4 h-4 text-gold-400" />
          </div>
          <div className="text-3xl font-bold text-white font-serif">{totalClicks}</div>
          <div className="text-[11px] text-stone-500">To asbrandoils.com & Marketplaces</div>
        </div>

        <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold uppercase tracking-wider">
            <span>Contextual CTR</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-bold text-white font-serif">{ctr}%</div>
          <div className="text-[11px] text-stone-500">Non-spammy balanced engagement</div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Recent Articles */}
        <div className="lg:col-span-7 bg-stone-950/70 border border-stone-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-800">
            <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gold-400" /> Recent Articles
            </h3>
            <Link
              href="/admin/articles"
              className="text-xs text-gold-400 hover:text-gold-300 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="divide-y divide-stone-800/60">
            {recentArticles.map((art) => (
              <div key={art.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-forest-400 mb-0.5">
                    {art.category.name}
                  </div>
                  <h4 className="text-sm font-serif font-bold text-stone-200 truncate">
                    {art.title}
                  </h4>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {art.viewsCount} reads • Focus: {art.focusKeyword || 'General'}
                  </div>
                </div>

                <a
                  href={`/${art.category.slug}/${art.slug}`}
                  target="_blank"
                  className="p-2 bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white rounded-lg transition-colors shrink-0"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Event Stream */}
        <div className="lg:col-span-5 bg-stone-950/70 border border-stone-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-stone-800">
            <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" /> Outbound Event Stream
            </h3>
            <Link
              href="/admin/analytics"
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Explorer →
            </Link>
          </div>

          {recentEvents.length > 0 ? (
            <div className="space-y-3">
              {recentEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-stone-900/60 border border-stone-800/80 rounded-xl text-xs space-y-1"
                >
                  <div className="flex items-center justify-between text-stone-400">
                    <span className="font-mono text-[10px] text-gold-400 uppercase">
                      {evt.eventType.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px]">
                      {new Date(evt.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-stone-300 font-medium truncate">
                    Placement: {evt.placement || 'general'}
                  </div>
                  {evt.utmCampaign && (
                    <div className="text-[10px] text-stone-500">
                      Campaign: {evt.utmCampaign}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-stone-500 text-xs">
              <MousePointerClick className="w-8 h-8 mx-auto text-stone-600 mb-2" />
              Event log will capture live visitor interactions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
