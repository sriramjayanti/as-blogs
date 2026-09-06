import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const rules = await prisma.promotionRule.findMany({
    include: { product: true },
    orderBy: { priority: 'desc' },
  });
  return NextResponse.json({ rules });
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
      keywords,
      productId,
      placementTypes,
      maxLinksPerArticle,
      categoryFilter,
      priority,
      isActive,
    } = data;

    if (!name || !keywords || !productId) {
      return NextResponse.json({ error: 'Missing required rule parameters' }, { status: 400 });
    }

    const newRule = await prisma.promotionRule.create({
      data: {
        name,
        keywords,
        productId,
        placementTypes: typeof placementTypes === 'string' ? placementTypes : JSON.stringify(placementTypes || ['CONTEXT_LINK', 'INLINE_CARD']),
        maxLinksPerArticle: maxLinksPerArticle || 2,
        categoryFilter: categoryFilter || 'ALL',
        priority: priority || 1,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
    });

    return NextResponse.json({ success: true, rule: newRule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
