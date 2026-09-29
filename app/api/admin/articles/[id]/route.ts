import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import sanitizeHtml from 'sanitize-html';
import { calculateReadingTime } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        author: true,
      },
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ article });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch article' },
      { status: 500 }
    );
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
      title,
      titleTe,
      slug,
      excerpt,
      excerptTe,
      content,
      contentTe,
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
      recipeJson,
      recipeJsonTe,
    } = data;

    if (!title || !slug || !content || !categoryId) {
      return NextResponse.json(
        { error: 'Title, slug, content, and category are required' },
        { status: 400 }
      );
    }

    // Sanitize rich HTML content
    const sanitizeConfig = {
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
    };

    const sanitizedHtml = sanitizeHtml(content, sanitizeConfig);
    const sanitizedHtmlTe = contentTe ? sanitizeHtml(contentTe, sanitizeConfig) : null;
    const readingTime = calculateReadingTime(sanitizedHtml);

    // If authorId is not provided, keep existing or fallback
    let resolvedAuthorId = authorId;
    if (!resolvedAuthorId) {
      const existing = await prisma.article.findUnique({
        where: { id: params.id },
        select: { authorId: true },
      });
      resolvedAuthorId = existing?.authorId;
    }

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: {
        title,
        titleTe: titleTe || null,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-'),
        excerpt: excerpt || title,
        excerptTe: excerptTe || null,
        content: sanitizedHtml,
        contentTe: sanitizedHtmlTe,
        featuredImage:
          featuredImage ||
          'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&auto=format&fit=crop&q=80',
        ogImage: featuredImage || null,
        imageAlt: imageAlt || title,
        readingTime,
        categoryId,
        ...(resolvedAuthorId ? { authorId: resolvedAuthorId } : {}),
        seoTitle: seoTitle || title,
        metaDescription: metaDescription || excerpt,
        canonicalUrl: canonicalUrl || null,
        focusKeyword: focusKeyword || null,
        isSponsored: Boolean(isSponsored),
        sponsoredBrand: sponsoredBrand || 'A.S. Brand Oils',
        faqsJson: faqsJson || '[]',
        recipeJson: recipeJson || '{}',
        recipeJsonTe: recipeJsonTe || '{}',
      },
    });

    return NextResponse.json({ success: true, article: updatedArticle });
  } catch (error: any) {
    console.error('Error updating article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update article' },
      { status: 500 }
    );
  }
}
