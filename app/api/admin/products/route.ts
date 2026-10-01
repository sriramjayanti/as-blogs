import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { orderIndex: 'asc' },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
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
      orderIndex,
    } = data;

    if (!name || !imageUrl) {
      return NextResponse.json(
        { error: 'Product name and image URL are required.' },
        { status: 400 }
      );
    }

    const cleanSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
        shortDescription: (shortDescription || name).trim(),
        fullDescription: (fullDescription || shortDescription || name).trim(),
        imageUrl: imageUrl.trim(),
        productUrl: (productUrl || 'https://asbrandoils.com/').trim(),
        marketplaceLinks:
          typeof marketplaceLinks === 'string'
            ? marketplaceLinks
            : JSON.stringify(marketplaceLinks || []),
        tags: (tags || '').trim(),
        isFeatured: Boolean(isFeatured),
        orderIndex: orderIndex !== undefined ? Number(orderIndex) : 0,
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
