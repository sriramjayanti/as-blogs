import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rule = await prisma.promotionRule.findUnique({
      where: { id: params.id },
      include: { product: true },
    });

    if (!rule) {
      return NextResponse.json({ error: 'Promotion rule not found' }, { status: 404 });
    }

    return NextResponse.json({ rule });
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
      keywords,
      matchType,
      productId,
      placementTypes,
      maxLinksPerArticle,
      categoryFilter,
      priority,
      isActive,
    } = data;

    const updated = await prisma.promotionRule.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined ? { name } : {}),
        ...(keywords !== undefined ? { keywords } : {}),
        ...(matchType !== undefined ? { matchType } : {}),
        ...(productId !== undefined ? { productId } : {}),
        ...(placementTypes !== undefined
          ? {
              placementTypes:
                typeof placementTypes === 'string'
                  ? placementTypes
                  : JSON.stringify(placementTypes || []),
            }
          : {}),
        ...(maxLinksPerArticle !== undefined
          ? { maxLinksPerArticle: Number(maxLinksPerArticle) }
          : {}),
        ...(categoryFilter !== undefined ? { categoryFilter } : {}),
        ...(priority !== undefined ? { priority: Number(priority) } : {}),
        ...(isActive !== undefined ? { isActive: Boolean(isActive) } : {}),
      },
      include: { product: true },
    });

    return NextResponse.json({ success: true, rule: updated });
  } catch (error: any) {
    console.error('Error updating promotion rule:', error);
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
    await prisma.promotionRule.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting promotion rule:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
