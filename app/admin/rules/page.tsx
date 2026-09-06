import { prisma } from '@/lib/db';
import { Sparkles, Plus, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

export const revalidate = 0;

export default async function AdminRulesPage() {
  const [rules, products] = await Promise.all([
    prisma.promotionRule.findMany({
      include: { product: true },
      orderBy: { priority: 'desc' },
    }),
    prisma.product.findMany(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            Smart Contextual Promotion Rules
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Configure keyword triggers, topic matching, and associate relevant articles with A.S. Brand products without spamming.
          </p>
        </div>
      </div>

      {/* Rules Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {rules.map((rule) => {
          let placements: string[] = [];
          try {
            placements = JSON.parse(rule.placementTypes || '[]');
          } catch {
            placements = [];
          }

          return (
            <div
              key={rule.id}
              className="bg-stone-950/70 border border-stone-800 rounded-3xl p-6 space-y-4 hover:border-gold-500/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-gold-500/20 text-gold-400 text-[10px] font-bold uppercase px-2 py-0.5 rounded border border-gold-500/30">
                      Priority {rule.priority}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Max {rule.maxLinksPerArticle} Links / Article
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-100 mt-1">
                    {rule.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Active</span>
                </div>
              </div>

              {/* Target Product */}
              <div className="bg-stone-900/80 rounded-2xl p-3 border border-stone-800 flex items-center gap-3">
                <div className="relative w-12 h-12 bg-white rounded-lg p-1 shrink-0">
                  <img
                    src={rule.product.imageUrl}
                    alt={rule.product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-semibold">
                    Target Promotion Product
                  </div>
                  <div className="text-xs font-bold text-stone-200">
                    {rule.product.name}
                  </div>
                </div>
              </div>

              {/* Trigger Keywords */}
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-2 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-gold-400" /> Topic & Keyword Triggers:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {rule.keywords.split(',').map((kw, i) => (
                    <span
                      key={i}
                      className="text-xs bg-stone-900 text-stone-300 px-2.5 py-1 rounded-lg border border-stone-800"
                    >
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Enabled Placements */}
              <div className="pt-3 border-t border-stone-800/80 flex flex-wrap gap-1.5">
                {placements.map((p) => (
                  <span
                    key={p}
                    className="text-[10px] font-semibold text-stone-400 bg-stone-900 px-2 py-0.5 rounded"
                  >
                    {p.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
