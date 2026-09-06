import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { orderIndex: 'asc' },
  });
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const {
      name,
      slug,
      shortDescription,
      fullDescription,
      imageUrl,
      productUrl,
      marketplaceLinks,
      tags,
      isFeatured,
    } = data;

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
        shortDescription,
        fullDescription,
        imageUrl,
        productUrl: productUrl || 'https://asbrandoils.com/',
        marketplaceLinks: typeof marketplaceLinks === 'string' ? marketplaceLinks : JSON.stringify(marketplaceLinks || []),
        tags: tags || '',
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
