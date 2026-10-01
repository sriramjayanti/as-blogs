import { prisma } from '@/lib/db';
import RulesManager from '@/components/admin/RulesManager';

export const revalidate = 0;

export default async function AdminRulesPage() {
  const [rules, products, categories] = await Promise.all([
    prisma.promotionRule.findMany({
      include: { product: true },
      orderBy: { priority: 'desc' },
    }),
    prisma.product.findMany({
      select: { id: true, name: true, imageUrl: true, slug: true },
      orderBy: { name: 'asc' },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
      orderBy: { name: 'asc' },
    }),
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

      {/* Interactive Rules Manager with Create, Edit, Toggle, and Delete */}
      <RulesManager
        initialRules={rules as any}
        products={products as any}
        categories={categories as any}
      />
    </div>
  );
}
