import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const rules = await prisma.promotionRule.findMany({
      include: { product: true },
      orderBy: { priority: 'desc' },
    });
    return NextResponse.json({ rules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
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
      keywords,
      matchType,
      productId,
      placementTypes,
      maxLinksPerArticle,
      categoryFilter,
      priority,
      isActive,
    } = data;

    if (!name || !keywords || !productId) {
      return NextResponse.json(
        { error: 'Missing required parameters: name, keywords, and target productId are required.' },
        { status: 400 }
      );
    }

    const newRule = await prisma.promotionRule.create({
      data: {
        name: name.trim(),
        keywords: keywords.trim(),
        matchType: ['CONTAINS', 'EXACT', 'PHRASE'].includes(matchType) ? matchType : 'CONTAINS',
        productId,
        placementTypes:
          typeof placementTypes === 'string'
            ? placementTypes
            : JSON.stringify(placementTypes || ['CONTEXT_LINK', 'INLINE_CARD']),
        maxLinksPerArticle: maxLinksPerArticle ? Math.min(Math.max(Number(maxLinksPerArticle), 1), 10) : 2,
        categoryFilter: categoryFilter || 'ALL',
        priority: priority ? Math.min(Math.max(Number(priority), 1), 10) : 1,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
      },
      include: { product: true },
    });

    return NextResponse.json({ success: true, rule: newRule });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
