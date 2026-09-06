import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q') || '';

  if (!q.trim()) {
    return NextResponse.json({ articles: [] });
  }

  const articles = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
        { focusKeyword: { contains: q } },
      ],
    },
    include: {
      category: true,
      author: true,
    },
    take: 8,
  });

  return NextResponse.json({ articles });
}
