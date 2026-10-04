import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';
import { sanitizeArticleContent } from '@/lib/sanitize';
import { calculateReadingTime } from '@/lib/utils';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    return NextResponse.json(
      { error: 'Unauthorized. Your session may have expired. Please re-login at /admin/login.' },
      { status: 401 }
    );
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

    // Retrieve existing article for resilient fallbacks
    const existing = await prisma.article.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Article not found.' }, { status: 404 });
    }

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: 'Article title and body content are required.' },
        { status: 400 }
      );
    }

    const resolvedCategoryId = categoryId || existing.categoryId;
    const resolvedAuthorId = authorId || existing.authorId;

    if (!resolvedCategoryId) {
      return NextResponse.json(
        { error: 'A valid recipe category is required.' },
        { status: 400 }
      );
    }

    // Sanitize rich HTML content
    const sanitizedHtml = sanitizeArticleContent(content);
    const sanitizedHtmlTe = contentTe ? sanitizeArticleContent(contentTe) : null;
    const readingTime = calculateReadingTime(sanitizedHtml);

    // Clean & validate slug
    const cleanSlug = (slug || existing.slug)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Prevent duplicate slug collision crash
    if (cleanSlug !== existing.slug) {
      const duplicate = await prisma.article.findUnique({
        where: { slug: cleanSlug },
        select: { id: true },
      });
      if (duplicate && duplicate.id !== params.id) {
        return NextResponse.json(
          { error: `The URL slug "${cleanSlug}" is already in use by another article. Please choose a unique slug.` },
          { status: 400 }
        );
      }
    }

    const targetFeaturedImage =
      featuredImage !== undefined && featuredImage !== null
        ? featuredImage
        : existing.featuredImage;

    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: {
        title: title.trim(),
        titleTe: titleTe ? titleTe.trim() : null,
        slug: cleanSlug,
        excerpt: (excerpt || title).trim(),
        excerptTe: excerptTe ? excerptTe.trim() : null,
        content: sanitizedHtml,
        contentTe: sanitizedHtmlTe,
        featuredImage: targetFeaturedImage,
        ogImage: targetFeaturedImage || null,
        imageAlt: imageAlt !== undefined ? imageAlt.trim() : existing.imageAlt,
        readingTime,
        categoryId: resolvedCategoryId,
        authorId: resolvedAuthorId,
        seoTitle: (seoTitle || title).trim(),
        metaDescription: (metaDescription || excerpt || '').trim(),
        canonicalUrl: canonicalUrl ? canonicalUrl.trim() : null,
        focusKeyword: focusKeyword ? focusKeyword.trim() : null,
        isSponsored: Boolean(isSponsored),
        sponsoredBrand: sponsoredBrand || 'A.S. Brand Oils',
        faqsJson: typeof faqsJson === 'string' ? faqsJson : JSON.stringify(faqsJson || []),
        recipeJson: typeof recipeJson === 'string' ? recipeJson : JSON.stringify(recipeJson || {}),
        recipeJsonTe: typeof recipeJsonTe === 'string' ? recipeJsonTe : JSON.stringify(recipeJsonTe || {}),
      },
      include: {
        category: true,
        author: true,
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await prisma.article.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete article' },
      { status: 500 }
    );
  }
}
