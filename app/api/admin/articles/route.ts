import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import sanitizeHtml from 'sanitize-html';
import { calculateReadingTime } from '@/lib/utils';

export async function GET() {
  const articles = await prisma.article.findMany({
    include: { category: true, author: true },
    orderBy: { publishedAt: 'desc' },
  });
  return NextResponse.json({ articles });
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

    if (!title || !slug || !content || !categoryId || !authorId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Sanitize rich HTML content
    const sanitizedHtml = sanitizeHtml(content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'img',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'span',
        'iframe',
        'video',
        'aside',
      ]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        '*': ['class', 'id', 'style', 'data-*'],
        a: ['href', 'name', 'target', 'rel', 'title', 'data-*', 'class'],
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height', 'loading'],
        iframe: ['src', 'width', 'height', 'allowfullscreen', 'frameborder'],
      },
    });

    const readingTime = calculateReadingTime(sanitizedHtml);

    const newArticle = await prisma.article.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
        excerpt: excerpt || title,
        content: sanitizedHtml,
        featuredImage:
          featuredImage ||
          'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&auto=format&fit=crop&q=80',
        imageAlt: imageAlt || title,
        readingTime,
        status: 'PUBLISHED',
        categoryId,
        authorId,
        seoTitle: seoTitle || title,
        metaDescription: metaDescription || excerpt,
        canonicalUrl: canonicalUrl || null,
        focusKeyword: focusKeyword || null,
        isSponsored: Boolean(isSponsored),
        sponsoredBrand: sponsoredBrand || 'A.S. Brand Oils',
        faqsJson: faqsJson || '[]',
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
