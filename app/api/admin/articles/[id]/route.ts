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
    const sanitizedHtml = sanitizeArticleContent(content);
    const sanitizedHtmlTe = contentTe ? sanitizeArticleContent(contentTe) : null;
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

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/(^-|-$)+/g, '');

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
        featuredImage:
          featuredImage ||
          '/recipes/crispy-spicy-fish-fry-recipe.jpg',
        ogImage: featuredImage || null,
        imageAlt: (imageAlt || title).trim(),
        readingTime,
        categoryId,
        ...(resolvedAuthorId ? { authorId: resolvedAuthorId } : {}),
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
