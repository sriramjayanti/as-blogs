import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';
import { getSiteUrl } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Static Pages
  const staticRoutes = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
  ];

  // Dynamic Categories
  const categories = await prisma.category.findMany();
  const categoryRoutes = categories.map((cat) => ({
    url: `${siteUrl}/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Dynamic Articles
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { category: true },
  });

  const articleRoutes = articles.map((art) => ({
    url: `${siteUrl}/${art.category.slug}/${art.slug}`,
    lastModified: art.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes];
}
