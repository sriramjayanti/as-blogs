import { prisma } from '@/lib/db';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { FileText, Plus, Eye, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export const revalidate = 0;

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    include: {
      category: true,
      author: true,
    },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            Articles & SEO Publishing
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Manage your digital publication index, canonical URLs, and structured data schemas.
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-stone-950 font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Article
        </Link>
      </div>

      {/* Articles Table */}
      <div className="bg-stone-950/70 border border-stone-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-900/80 text-stone-400 font-semibold uppercase tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-4 px-6">Article Title & Slug</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Author</th>
                <th className="py-4 px-6">Focus Keyword</th>
                <th className="py-4 px-6">Reads</th>
                <th className="py-4 px-6">Published</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-300">
              {articles.map((art) => (
                <tr key={art.id} className="hover:bg-stone-900/40 transition-colors">
                  <td className="py-4 px-6 font-medium">
                    <div className="font-serif text-sm font-bold text-stone-100">
                      {art.title}
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                      /{art.category.slug}/{art.slug}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="bg-forest-950 text-forest-400 border border-forest-800/80 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                      {art.category.name}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-stone-300">{art.author.name}</td>
                  <td className="py-4 px-6 font-mono text-[11px] text-gold-400">
                    {art.focusKeyword || '—'}
                  </td>
                  <td className="py-4 px-6 font-semibold text-white">{art.viewsCount}</td>
                  <td className="py-4 px-6 text-stone-400">{formatDate(art.publishedAt)}</td>
                  <td className="py-4 px-6 text-right">
                    <a
                      href={`/${art.category.slug}/${art.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-gold-400 hover:text-gold-300 font-semibold"
                    >
                      View <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
