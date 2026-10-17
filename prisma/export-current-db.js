const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'dev.db').replace(/\\/g, '/');
process.env.DATABASE_URL = `file:${dbPath}`;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function exportAll() {
  console.log('Exporting all data from SQLite...');
  const users = await prisma.user.findMany();
  const authors = await prisma.author.findMany();
  const categories = await prisma.category.findMany();
  const tags = await prisma.tag.findMany();
  const products = await prisma.product.findMany();
  const articles = await prisma.article.findMany({
    include: { tags: true }
  });
  const promotionRules = await prisma.promotionRule.findMany();
  const campaigns = await prisma.campaign.findMany();
  const seos = await prisma.sEOSetting.findMany();
  const redirects = await prisma.redirect.findMany();

  const data = {
    exportedAt: new Date().toISOString(),
    users,
    authors,
    categories,
    tags,
    products,
    articles,
    promotionRules,
    campaigns,
    seos,
    redirects,
  };

  const outputPath = path.resolve(__dirname, 'sqlite-snapshot.json');
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`Exported successfully to ${outputPath}: ${articles.length} articles, ${products.length} products, ${categories.length} categories.`);
}

exportAll()
  .catch(err => {
    console.error('Export error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
