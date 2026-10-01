import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawQ = searchParams.get('q') || '';

    // Sanitize and constrain search query to prevent CPU exhaustion / ReDoS
    const q = rawQ.trim().slice(0, 80).replace(/[^\w\s-]/gi, '');

    if (!q || q.length < 2) {
      return NextResponse.json({ articles: [] });
    }

    const articles = await prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: q } },
          { excerpt: { contains: q } },
          { focusKeyword: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        imageAlt: true,
        readingTime: true,
        category: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      take: 8,
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ articles: [] }, { status: 500 });
  }
}
