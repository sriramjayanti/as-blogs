const path = require('path');
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

async function restore() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.startsWith('file:')) {
    console.error('Error: DATABASE_URL environment variable must be set to a PostgreSQL connection string (Neon or Supabase).');
    process.exit(1);
  }

  const snapshotFile = path.resolve(__dirname, 'sqlite-snapshot.json');
  if (!fs.existsSync(snapshotFile)) {
    console.error('Snapshot file sqlite-snapshot.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(snapshotFile, 'utf-8');
  const data = JSON.parse(raw);
  const prisma = new PrismaClient();

  console.log(`Connecting to PostgreSQL and restoring ${data.articles.length} articles...`);

  try {
    // 1. Users
    for (const u of data.users) {
      await prisma.user.upsert({
        where: { id: u.id },
        update: {},
        create: {
          id: u.id,
          email: u.email,
          passwordHash: u.passwordHash,
          name: u.name,
          role: u.role || 'ADMIN',
        },
      });
    }
    console.log(`Restored ${data.users.length} users.`);

    // 2. Authors
    for (const a of data.authors) {
      await prisma.author.upsert({
        where: { id: a.id },
        update: {},
        create: {
          id: a.id,
          name: a.name,
          slug: a.slug,
          bio: a.bio,
          avatar: a.avatar,
          roleTitle: a.roleTitle,
          twitter: a.twitter,
          linkedin: a.linkedin,
        },
      });
    }
    console.log(`Restored ${data.authors.length} authors.`);

    // 3. Categories
    for (const c of data.categories) {
      await prisma.category.upsert({
        where: { id: c.id },
        update: {},
        create: {
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          image: c.image,
          orderIndex: c.orderIndex || 0,
        },
      });
    }
    console.log(`Restored ${data.categories.length} categories.`);

    // 4. Products
    for (const p of data.products) {
      await prisma.product.upsert({
        where: { id: p.id },
        update: {},
        create: {
          id: p.id,
          name: p.name,
          slug: p.slug,
          shortDescription: p.shortDescription || '',
          fullDescription: p.fullDescription || '',
          imageUrl: p.imageUrl,
          productUrl: p.productUrl,
          marketplaceLinks: p.marketplaceLinks || '[]',
          tags: p.tags || '',
          isFeatured: p.isFeatured !== false,
          orderIndex: p.orderIndex || 0,
        },
      });
    }
    console.log(`Restored ${data.products.length} products.`);

    // 5. Articles
    for (const art of data.articles) {
      await prisma.article.upsert({
        where: { id: art.id },
        update: {},
        create: {
          id: art.id,
          title: art.title,
          slug: art.slug,
          excerpt: art.excerpt || '',
          content: art.content || '',
          featuredImage: art.featuredImage,
          imageAlt: art.imageAlt,
          readingTime: art.readingTime || 5,
          status: art.status || 'PUBLISHED',
          publishedAt: new Date(art.publishedAt),
          authorId: art.authorId,
          categoryId: art.categoryId,
          seoTitle: art.seoTitle,
          metaDescription: art.metaDescription,
          canonicalUrl: art.canonicalUrl,
          focusKeyword: art.focusKeyword,
          ogImage: art.ogImage,
          isSponsored: Boolean(art.isSponsored),
          sponsoredBrand: art.sponsoredBrand,
          titleTe: art.titleTe,
          excerptTe: art.excerptTe,
          contentTe: art.contentTe,
          recipeJsonTe: art.recipeJsonTe || '{}',
          faqsJson: art.faqsJson || '[]',
          recipeJson: art.recipeJson || '{}',
          viewsCount: art.viewsCount || 0,
          sharesCount: art.sharesCount || 0,
        },
      });
    }
    console.log(`Restored ${data.articles.length} articles.`);

    // 6. Promotion Rules
    for (const r of data.promotionRules) {
      await prisma.promotionRule.upsert({
        where: { id: r.id },
        update: {},
        create: {
          id: r.id,
          name: r.name,
          keywords: r.keywords,
          matchType: r.matchType || 'CONTAINS',
          productId: r.productId,
          placementTypes: r.placementTypes || '["CONTEXT_LINK","INLINE_CARD"]',
          maxLinksPerArticle: r.maxLinksPerArticle || 2,
          categoryFilter: r.categoryFilter || 'ALL',
          isActive: r.isActive !== false,
          priority: r.priority || 1,
        },
      });
    }
    console.log(`Restored ${data.promotionRules.length} promotion rules.`);

    // 7. SEO Settings
    for (const s of data.seos) {
      await prisma.sEOSetting.upsert({
        where: { id: s.id },
        update: {},
        create: {
          id: s.id,
          siteTitle: s.siteTitle,
          defaultMetaDescription: s.defaultMetaDescription,
          defaultOgImage: s.defaultOgImage,
          twitterHandle: s.twitterHandle,
          robotsDirectives: s.robotsDirectives,
        },
      });
    }

    console.log('✅ Complete database restoration to PostgreSQL finished successfully!');
  } catch (err) {
    console.error('Error during restoration:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

restore();
