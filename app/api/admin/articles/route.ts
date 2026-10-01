import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeArticleContent } from '@/lib/sanitize';
import { calculateReadingTime } from '@/lib/utils';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const articles = await prisma.article.findMany({
      include: { category: true, author: true },
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json({ articles });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
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
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      imageAlt,
      categoryId,
      authorId,
      seoTitle,
      metaDescription,
      canonicalUrl,
      focusKeyword,
      isSponsored,
      sponsoredBrand,
      faqsJson,
    } = data;

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, slug, content, and category are required' },
        { status: 400 }
      );
    }

    let resolvedAuthorId = authorId;
    if (!resolvedAuthorId) {
      const defaultAuthor = await prisma.author.findFirst();
      resolvedAuthorId = defaultAuthor?.id;
    }
    if (!resolvedAuthorId) {
      return NextResponse.json({ error: 'Author profile required' }, { status: 400 });
    }

    // Sanitize rich HTML content with strict rules
    const sanitizedHtml = sanitizeArticleContent(content);
    const readingTime = calculateReadingTime(sanitizedHtml);

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newArticle = await prisma.article.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        excerpt: (excerpt || title).trim(),
        content: sanitizedHtml,
        featuredImage:
          featuredImage ||
          '/recipes/crispy-spicy-fish-fry-recipe.jpg',
        imageAlt: (imageAlt || title).trim(),
        readingTime,
        status: 'PUBLISHED',
        categoryId,
        authorId: resolvedAuthorId,
        seoTitle: (seoTitle || title).trim(),
        metaDescription: (metaDescription || excerpt || '').trim(),
        canonicalUrl: canonicalUrl ? canonicalUrl.trim() : null,
        focusKeyword: focusKeyword ? focusKeyword.trim() : null,
        isSponsored: Boolean(isSponsored),
        sponsoredBrand: sponsoredBrand || 'A.S. Brand Oils',
        faqsJson: typeof faqsJson === 'string' ? faqsJson : JSON.stringify(faqsJson || []),
      },
    });

    return NextResponse.json({ success: true, article: newArticle });
  } catch (error: any) {
    console.error('Error creating article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create article' },
      { status: 500 }
    );
  }
}
