import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { promotionRules: true },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const cleanSlug = slug
      ? slug.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/(^-|-$)+/g, '')
      : undefined;

    const updated = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(cleanSlug ? { slug: cleanSlug } : {}),
        ...(shortDescription !== undefined ? { shortDescription: shortDescription.trim() } : {}),
        ...(fullDescription !== undefined ? { fullDescription: fullDescription.trim() } : {}),
        ...(imageUrl ? { imageUrl: imageUrl.trim() } : {}),
        ...(productUrl ? { productUrl: productUrl.trim() } : {}),
        ...(marketplaceLinks !== undefined
          ? {
              marketplaceLinks:
                typeof marketplaceLinks === 'string'
                  ? marketplaceLinks
                  : JSON.stringify(marketplaceLinks || []),
            }
          : {}),
        ...(tags !== undefined ? { tags: tags.trim() } : {}),
        ...(isFeatured !== undefined ? { isFeatured: Boolean(isFeatured) } : {}),
        ...(orderIndex !== undefined ? { orderIndex: Number(orderIndex) } : {}),
      },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.product.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
