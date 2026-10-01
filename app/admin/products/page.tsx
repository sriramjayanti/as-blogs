import { prisma } from '@/lib/db';
import ProductListWithEdit from '@/components/admin/ProductListWithEdit';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            A.S. Brand Product Catalog & Marketplaces
          </h1>
          <p className="text-stone-400 text-xs mt-1">
            Manage product metadata, high-resolution CDN images, and verified marketplace channels (Amazon, Blinkit, Zepto, BigBasket, Instamart). Click &quot;Edit & Photo&quot; to change product image.
          </p>
        </div>
      </div>

      {/* Product List with Edit & Photo Changer */}
      <ProductListWithEdit initialProducts={products as any} />
    </div>
  );
}
