const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with initial data...');

  // 1. Create Admin User
  const passwordHash = await bcrypt.hash('admin_asbrandoils_2026', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@asbrandoils.com' },
    update: {},
    create: {
      email: 'admin@asbrandoils.com',
      passwordHash,
      name: 'Editorial Lead',
      role: 'ADMIN',
    },
  });
  console.log('Admin created:', admin.email);

  // 2. Create Authors
  const author1 = await prisma.author.upsert({
    where: { slug: 'meenakshi-sundaram' },
    update: {},
    create: {
      name: 'Dr. Meenakshi Sundaram',
      slug: 'meenakshi-sundaram',
      roleTitle: 'Culinary Anthropologist & Food Historian',
      bio: 'Author of three monographs on Sangam era gastronomy and traditional cold-pressing methods across Tamil Nadu.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      twitter: 'meenakshi_food',
      linkedin: 'meenakshi-sundaram-phd',
    },
  });

  const author2 = await prisma.author.upsert({
    where: { slug: 'ananya-krishnan' },
    update: {},
    create: {
      name: 'Chef Ananya Krishnan',
      slug: 'ananya-krishnan',
      roleTitle: 'Executive Chef & Nutritionist',
      bio: 'Specializing in contemporary South Indian cuisine, cold-pressed oils, and functional nutrition.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
      twitter: 'chefananya',
      linkedin: 'ananya-krishnan-chef',
    },
  });

  const author3 = await prisma.author.upsert({
    where: { slug: 'raghavan-iyer' },
    update: {},
    create: {
      name: 'Raghavan Iyer',
      slug: 'raghavan-iyer',
      roleTitle: 'Agricultural Journalist & Heritage Researcher',
      bio: 'Investigates sustainable oilseed farming, farmer cooperatives, and temple culinary traditions.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      twitter: 'raghavan_agri',
    },
  });

  // 3. Create Categories
  const categories = [
    {
      name: 'Food & Cooking',
      slug: 'food',
      description: 'Culinary guides, smoke points, cooking techniques, and traditional spice pairings.',
      image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&auto=format&fit=crop&q=80',
      orderIndex: 1,
    },
    {
      name: 'Recipes',
      slug: 'recipes',
      description: 'Authentic South Indian & regional Indian heirloom recipes made with traditional cold-pressed oils.',
      image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800&auto=format&fit=crop&q=80',
      orderIndex: 2,
    },
    {
      name: 'Health & Wellness',
      slug: 'health',
      description: 'Ayurvedic health benefits, heart health, antioxidant profiles, and oil pulling rituals.',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
      orderIndex: 3,
    },
    {
      name: 'Culture & Tradition',
      slug: 'culture',
      description: 'Festival rituals, Pooja practices, deepam traditions, and the sacred significance of Pancha Thailam.',
      image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800&auto=format&fit=crop&q=80',
      orderIndex: 4,
    },
    {
      name: 'Agriculture & Science',
      slug: 'agriculture',
      description: 'Sesame and groundnut farming, seed hulling technology, and sustainable agro-practices.',
      image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=80',
      orderIndex: 5,
    },
    {
      name: 'Guides & Education',
      slug: 'guides',
      description: 'Comprehensive buying guides, storage tips, smoke point charts, and oil selection masterclasses.',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80',
      orderIndex: 6,
    },
  ];

  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap[cat.slug] = created;
  }
  console.log('Categories created:', Object.keys(categoryMap).length);

  // 4. Create Tags
  const tagList = [
    'Gingelly Oil',
    'Groundnut Oil',
    'Sesame Seeds',
    'Smoke Points',
    'South Indian Cooking',
    'Ayurveda',
    'Deepam',
    'Pooja Rituals',
    'Cold Pressed',
    'Heart Health',
    'Heirloom Recipes',
  ];

  const tagMap = {};
  for (const tagName of tagList) {
    const slug = tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const createdTag = await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: { name: tagName, slug },
    });
    tagMap[tagName] = createdTag;
  }

  // 5. Create Official A.S. Brand Products
  const products = [
    {
      name: 'A.S. Brand Hulled Gingelly Oil',
      slug: 'as-brand-hulled-gingelly-oil',
      shortDescription: 'A.S. Brand Hulled Gingelly Oil adds a naturally fragrant aroma and infuses the essence of health in food.',
      fullDescription: 'Crafted from carefully de-hulled, premium white sesame seeds, A.S. Brand Hulled Gingelly Oil eliminates bitterness while delivering unmatched nutty aroma, rich natural sesamol antioxidants, and traditional golden clarity for daily cooking, seasoning, and tempering.',
      imageUrl: 'https://asbrandoils.com/cdn/shop/files/Gingelly_oil_1_720x.png?v=1721982944',
      productUrl: 'https://asbrandoils.com/',
      marketplaceLinks: JSON.stringify([
        { name: 'Amazon', url: 'https://www.amazon.in/s?k=as+brand+gingelly+oil', badge: 'Fast Delivery' },
        { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=as+brand+gingelly+oil', badge: 'Instant Slot' },
        { name: 'Blinkit', url: 'https://blinkit.com/s/?q=as+brand+oil', badge: '10 Mins' },
        { name: 'Zepto', url: 'https://www.zeptonow.com/search?query=as+brand+gingelly+oil', badge: 'Superfast' },
      ]),
      tags: 'gingelly oil, sesame oil, cooking oil, hulled sesame, south indian food',
      isFeatured: true,
      orderIndex: 1,
    },
    {
      name: 'Mansion Gingelly Oil',
      slug: 'mansion-gingelly-oil',
      shortDescription: 'Mansion Brand Gingelly Oil is manufactured using high-quality raw gingelly seeds to preserve its natural taste and nutrition.',
      fullDescription: 'Manufactured with state-of-the-art precision from whole gingelly seeds, Mansion Brand Gingelly Oil retains full nutrient integrity, robust aroma, and full-bodied traditional character favored by heritage culinary masters across South India.',
      imageUrl: 'https://asbrandoils.com/cdn/shop/files/Mansion_oil_720x.png?v=1721477339',
      productUrl: 'https://asbrandoils.com/',
      marketplaceLinks: JSON.stringify([
        { name: 'Amazon', url: 'https://www.amazon.in/s?k=mansion+gingelly+oil', badge: 'Prime' },
        { name: 'Swiggy Instamart', url: 'https://www.swiggy.com/instamart', badge: '15 Mins' },
        { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=mansion+gingelly+oil', badge: 'Verified' },
      ]),
      tags: 'mansion oil, gingelly oil, sesame oil, raw sesame, heritage cooking',
      isFeatured: true,
      orderIndex: 2,
    },
    {
      name: 'A.S. Brand Groundnut Oil',
      slug: 'as-brand-groundnut-oil',
      shortDescription: 'A.S. Brand Groundnut Oil is processed from carefully selected groundnuts and double filtered.',
      fullDescription: 'Processed strictly from hand-graded groundnuts and refined through natural double-filtration methods, this peanut oil possesses a high smoke point of 232°C (450°F), making it the ultimate healthy choice for deep frying, sautéing, and crisp everyday snacks.',
      imageUrl: 'https://asbrandoils.com/cdn/shop/files/Groundnut_oil_01_720x.png?v=1721480148',
      productUrl: 'https://asbrandoils.com/',
      marketplaceLinks: JSON.stringify([
        { name: 'Amazon', url: 'https://www.amazon.in/s?k=as+brand+groundnut+oil', badge: 'Prime' },
        { name: 'Blinkit', url: 'https://blinkit.com/s/?q=groundnut+oil+as+brand', badge: '10 Mins' },
        { name: 'Zepto', url: 'https://www.zeptonow.com/search?query=as+brand+groundnut+oil', badge: 'Express' },
        { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=as+brand+groundnut+oil', badge: 'Fresh' },
      ]),
      tags: 'groundnut oil, peanut oil, frying oil, double filtered, cold pressed',
      isFeatured: true,
      orderIndex: 3,
    },
    {
      name: 'A.S. Brand Hulled Gingelly Seeds',
      slug: 'as-brand-hulled-gingelly-seeds',
      shortDescription: 'A.S. Brand Hulled Sesame Seeds retain their intrinsic nutrients, taste and natural appearance.',
      fullDescription: 'Mechanically de-hulled without chemicals, these premium white sesame seeds retain their rich dietary fiber, calcium, iron, and healthy fats. Essential for authentic idli podi, traditional sweets, til ladoos, and culinary garnishing.',
      imageUrl: 'https://asbrandoils.com/cdn/shop/files/Gingelly_seeds_01_720x.png?v=1721480048',
      productUrl: 'https://asbrandoils.com/',
      marketplaceLinks: JSON.stringify([
        { name: 'Amazon', url: 'https://www.amazon.in/s?k=as+brand+sesame+seeds', badge: 'Prime' },
        { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=hulled+sesame+seeds', badge: 'Verified' },
      ]),
      tags: 'gingelly seeds, sesame seeds, hulled seeds, idli podi, til',
      isFeatured: true,
      orderIndex: 4,
    },
    {
      name: 'Sree Divya Sugandha Deeparadhana Oil',
      slug: 'sree-divya-sugandha-deeparadhana-oil',
      shortDescription: 'A blend of five oils, traditionally known as Pancha Thailam, with jasmine fragrance.',
      fullDescription: 'Formulated in strict adherence to Vedic agamic principles, Sree Divya Sugandha Deeparadhana Oil is a sacred blend of five essential oils (Pancha Deepam Thailam) infused with natural jasmine fragrance. Produces a bright, calm, soot-free flame that purifies home atmospheres.',
      imageUrl: 'https://asbrandoils.com/cdn/shop/files/Deeparadhana_oil_720x.png?v=1721480073',
      productUrl: 'https://asbrandoils.com/',
      marketplaceLinks: JSON.stringify([
        { name: 'Amazon', url: 'https://www.amazon.in/s?k=sree+divya+deeparadhana+oil', badge: 'Devotional Choice' },
        { name: 'Blinkit', url: 'https://blinkit.com/s/?q=deepam+oil', badge: 'Pooja Essentials' },
        { name: 'Zepto', url: 'https://www.zeptonow.com/search?query=pancha+deepam+oil', badge: 'Instant' },
      ]),
      tags: 'deeparadhana oil, pancha thailam, pooja oil, deepam, diya, temple oil',
      isFeatured: true,
      orderIndex: 5,
    },
    {
      name: 'Pooja Brand Pure Gingelly Oil',
      slug: 'pooja-brand-pure-gingelly-oil',
      shortDescription: 'Traditional pure sesame oil formulated specifically for temple lamps and devotional deeparadhana.',
      fullDescription: 'Pooja Brand Pure Gingelly Oil is dedicated to divine worship. Sesame oil has been celebrated since ancient times as the most auspicious fuel for brass and clay lamps, dispelling negative energies and sustaining an uninterrupted, golden divine flame.',
      imageUrl: 'https://asbrandoils.com/cdn/shop/files/Pooja_gingelly_oil_720x.jpg?v=1721580483',
      productUrl: 'https://asbrandoils.com/',
      marketplaceLinks: JSON.stringify([
        { name: 'Amazon', url: 'https://www.amazon.in/s?k=pooja+gingelly+oil', badge: 'Auspicious' },
        { name: 'BigBasket', url: 'https://www.bigbasket.com/ps/?q=pooja+oil', badge: 'Devotion' },
      ]),
      tags: 'pooja oil, pure gingelly, deepam oil, diya, lamp oil, temple',
      isFeatured: true,
      orderIndex: 6,
    },
  ];

  const productMap = {};
  for (const prod of products) {
    const created = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
    productMap[prod.slug] = created;
  }
  console.log('Products created:', Object.keys(productMap).length);

  // 6. Create Contextual Promotion Rules (Section 4 from Master Prompt)
  const rules = [
    {
      name: 'Gingelly / Sesame Oil Context Rule',
      keywords: 'gingelly oil, sesame oil, til oil, sesame, traditional cooking, South Indian cooking',
      matchType: 'CONTAINS',
      productId: productMap['as-brand-hulled-gingelly-oil'].id,
      placementTypes: JSON.stringify(['CONTEXT_LINK', 'INLINE_CARD', 'SIDEBAR', 'END_CTA']),
      maxLinksPerArticle: 2,
      categoryFilter: 'ALL',
      priority: 10,
    },
    {
      name: 'Groundnut / Peanut Oil Context Rule',
      keywords: 'groundnut oil, peanut oil, groundnuts, frying oil, deep frying, peanut, crisp snacks',
      matchType: 'CONTAINS',
      productId: productMap['as-brand-groundnut-oil'].id,
      placementTypes: JSON.stringify(['CONTEXT_LINK', 'INLINE_CARD', 'SIDEBAR', 'END_CTA']),
      maxLinksPerArticle: 2,
      categoryFilter: 'ALL',
      priority: 9,
    },
    {
      name: 'Gingelly Seeds / Til Podi Context Rule',
      keywords: 'sesame seeds, gingelly seeds, til seeds, sesame recipes, idli podi, til ladoo',
      matchType: 'CONTAINS',
      productId: productMap['as-brand-hulled-gingelly-seeds'].id,
      placementTypes: JSON.stringify(['CONTEXT_LINK', 'INLINE_CARD', 'SIDEBAR', 'END_CTA']),
      maxLinksPerArticle: 2,
      categoryFilter: 'ALL',
      priority: 8,
    },
    {
      name: 'Pooja / Devotional / Deepam Context Rule',
      keywords: 'pooja, puja, deepam, diya, lamp, temple, festival, devotional, deeparadhana, traditional rituals, pancha thailam',
      matchType: 'CONTAINS',
      productId: productMap['sree-divya-sugandha-deeparadhana-oil'].id,
      placementTypes: JSON.stringify(['CONTEXT_LINK', 'INLINE_CARD', 'SIDEBAR', 'END_CTA']),
      maxLinksPerArticle: 2,
      categoryFilter: 'ALL',
      priority: 10,
    },
  ];

  for (const r of rules) {
    await prisma.promotionRule.create({
      data: r,
    });
  }
  console.log('Promotion Rules created:', rules.length);

  // 7. Create Rich Editorial Articles
  const articles = [
    {
      title: 'Best Cooking Oils for Traditional Indian Kitchens: Smoke Points, Health & Culinary Heritage',
      slug: 'best-cooking-oils-for-indian-kitchens',
      excerpt: 'From mustard in the North to fragrant gingelly and coconut in the South, discover how traditional cold-pressed oils balance high heat tolerance, flavor preservation, and cardiovascular wellness.',
      content: `
        <p>In Indian gastronomy, cooking oil is never merely a heat-transfer medium—it is the foundational soul of regional flavor. Unlike Western culinary traditions that frequently rely on neutral oils, Indian cooking has celebrated cold-pressed oils like fragrant gingelly oil, hearty groundnut oil, and mustard oil for millennia.</p>
        
        <h2>Understanding Smoke Points in High-Heat Indian Cooking</h2>
        <p>Tadka, tempering, and deep-frying require cooking oils capable of handling temperatures between 180°C and 230°C without oxidizing or creating free radicals. Traditional double-filtered groundnut oil boasts a high smoke point of 232°C (450°F), making it the premier choice for crispy vadas, pakoras, and crunchy murukkus.</p>
        
        <p>For daily gravies, rasams, and sambar, hulled sesame oil or cold-pressed gingelly oil delivers a rich aromatic profile, retaining natural antioxidants like sesamol and sesamolin that safeguard against lipid oxidation at medium sautéing temperatures.</p>
        
        <h2>The Nutritional Power of Cold-Pressed Oils</h2>
        <p>When oilseeds are pressed without chemical solvents or excessive artificial heating, they retain their intrinsic polyphenol matrix, Vitamin E, and monounsaturated fatty acids (MUFA). Using high-grade cold-pressed gingelly oil provides a balanced ratio of omega-6 to omega-3 essential fatty acids that actively support arterial flexibility and digestive wellness.</p>
        
        <h2>Choosing the Right Oil for Every Indian Culinary Technique</h2>
        <ul>
          <li><strong>Deep Frying & Sautéing:</strong> Filtered groundnut oil for crispness and neutral nutty lightness.</li>
          <li><strong>South Indian Sambar, Gravies & Podis:</strong> Pure gingelly oil for uncompromised aroma and authentic heritage taste.</li>
          <li><strong>Salad Dressings & Finishing Drizzle:</strong> Cold-pressed sesame oil over warm curd rice or roasted vegetables.</li>
        </ul>
        
        <h2>Conclusion: Bringing Heritage Purity Back to Everyday Meals</h2>
        <p>Selecting authentic oils directly translates into superior digestion, cleaner mouthfeel, and genuine regional flavors. Incorporating unadulterated sesame and groundnut oils ensures your family benefits from timeless wisdom rooted in nature.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Traditional brass tadka pan and Indian culinary spices',
      readingTime: 6,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-08-15T10:00:00Z'),
      authorId: author1.id,
      categoryId: categoryMap['food'].id,
      seoTitle: 'Best Cooking Oils for Indian Kitchens | Smoke Points & Health Guide',
      metaDescription: 'A comprehensive culinary guide to choosing the best cooking oils for Indian kitchens. Learn smoke points, health benefits of gingelly and groundnut oils.',
      canonicalUrl: 'https://asbrandoils.com/blog/food/best-cooking-oils-for-indian-kitchens',
      focusKeyword: 'cooking oils for indian kitchens',
      faqsJson: JSON.stringify([
        {
          question: 'What is the best oil for deep frying in Indian cooking?',
          answer: 'Double-filtered groundnut oil is widely regarded as the best oil for Indian deep frying due to its high smoke point of 232°C (450°F) and pleasant nutty aroma that does not impart greasy aftertaste.',
        },
        {
          question: 'Can gingelly oil be used for daily cooking?',
          answer: 'Yes! Hulled gingelly oil is celebrated in South Indian cuisine for daily sambars, vegetable curries, tempering, and rasams due to its delicate aroma and potent antioxidant content.',
        },
      ]),
    },
    {
      title: 'The Science of Sesame: Why Hulled Gingelly Oil Elevates South Indian Sambar and Dosas',
      slug: 'science-of-hulled-gingelly-oil-south-indian-cooking',
      excerpt: 'Discover the chemical difference between unhulled and de-hulled sesame seeds, and why premium hulled gingelly oil is the secret behind five-star South Indian restaurant flavors.',
      content: `
        <p>Ask any seasoned chef from Chennai to Madurai about the single secret ingredient behind irresistible crispy ghee roasts and fragrant sambar, and the answer is unanimous: high quality gingelly oil. But few home cooks realize the critical difference that de-hulling makes.</p>
        
        <h2>Unhulled vs. Hulled Sesame: The Chemistry of Bitterness</h2>
        <p>The outer hull of the sesame seed contains oxalates and bitter tannins. When seeds are crushed with their hulls intact, the resulting oil can possess a heavy, acrid bite that overpowers subtle spices. Mechanically removing the hull before cold extraction produces hulled gingelly oil—a golden, silky oil with zero acridity and a pure, nutty perfume.</p>
        
        <h2>Why Sambar Demands Authentic Gingelly Oil</h2>
        <p>When you finish a simmering pot of Madras sambar with a ladle of hot gingelly oil infused with mustard seeds, curry leaves, and asafoetida (hing), the oil acts as a hydrophobic aroma-binder. It captures the volatile sulfur compounds of the hing and releases them steadily upon first bite.</p>
        
        <h2>Culinary Tips for Perfect Crispy Dosas</h2>
        <p>When ladling batter onto a seasoned cast-iron skillet, a light border of fragrant sesame oil creates micro-vaporization channels that guarantee golden, non-soggy edges while imparting an authentic South Indian aroma.</p>
        
        <h2>Summary</h2>
        <p>Elevating your daily South Indian repertoire from ordinary to extraordinary is as simple as switching to unadulterated hulled gingelly oil. Its balanced sweetness and clean finish make every recipe sing.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Golden crisp dosa with traditional coconut chutney and sambar',
      readingTime: 5,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-08-20T08:30:00Z'),
      authorId: author2.id,
      categoryId: categoryMap['recipes'].id,
      seoTitle: 'The Science of Hulled Gingelly Oil in South Indian Cooking',
      metaDescription: 'Learn why hulled gingelly oil creates the best South Indian sambar and crispy dosas without bitterness. Discover the science of sesame oil extraction.',
      canonicalUrl: 'https://asbrandoils.com/blog/recipes/science-of-hulled-gingelly-oil-south-indian-cooking',
      focusKeyword: 'hulled gingelly oil',
      faqsJson: JSON.stringify([
        {
          question: 'Why does some gingelly oil taste bitter?',
          answer: 'Bitterness in gingelly oil usually stems from using unhulled sesame seeds containing high concentrations of outer hull tannins and oxalates. De-hulled sesame oil completely eliminates this bitterness.',
        },
      ]),
    },
    {
      title: 'Deeparadhana Oil & The Sacred Pancha Thailam: Spiritual Traditions and Science Behind Diya Lamps',
      slug: 'deeparadhana-oil-pancha-thailam-spiritual-science',
      excerpt: 'Explore the Vedic significance of lighting traditional brass lamps with Pancha Deepam Thailam, its calming jasmine aromatherapeutic properties, and clean-burning temple rituals.',
      content: `
        <p>The lighting of a deepam (oil lamp) is one of the most sacred daily rituals across Indian households. In Vedic traditions, lighting a brass or earthen diya is not just symbolic of dispelling darkness—it is a spiritual technology for harmonizing the domestic atmosphere.</p>
        
        <h2>What is Pancha Thailam?</h2>
        <p>According to ancient Agamic texts, the most auspicious lamp fuel is Pancha Deepam Thailam, a precise blend of five sacred oils formulated to invite positivity, tranquility, and divine grace:</p>
        <ul>
          <li><strong>Pure Sesame (Gingelly) Oil:</strong> Dispels negative planetary influences and creates enduring peace.</li>
          <li><strong>Pure Castor Oil:</strong> Promotes family harmony, mental clarity, and spiritual progress.</li>
          <li><strong>Neem Oil:</strong> Natural disinfectant that cleanses airborne pathogens.</li>
          <li><strong>Illuppai (Mahua) Oil:</strong> Attracts prosperity and divine abundance.</li>
          <li><strong>Pure Cow Ghee:</strong> The supreme sattvic offering producing high spiritual vibrations.</li>
        </ul>
        
        <h2>The Soothing Power of Natural Jasmine Fragrance</h2>
        <p>Modern research into aromatherapy reveals that lighting a diya with deeparadhana oil infused with natural jasmine fragrance releases mild volatile organic esters that lower cortisol (stress hormones) and promote deep focus during evening meditation or pooja rituals.</p>
        
        <h2>Best Practices for Clean Burning Diya Lamps</h2>
        <p>To ensure a bright, steady, and soot-free flame, trim cotton wicks to approximately 1 cm and use specially blended deeparadhana oil designed for complete combustion without leaving black residue on brass lamps.</p>
        
        <h2>Conclusion</h2>
        <p>When you light a diya fueled by sacred pancha thailam, you connect with thousands of years of living spiritual heritage that brings serenity and warmth to your home.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Row of illuminated brass deepam lamps with jasmine flowers',
      readingTime: 6,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-08-25T14:00:00Z'),
      authorId: author3.id,
      categoryId: categoryMap['culture'].id,
      seoTitle: 'Deeparadhana Oil & Pancha Thailam | Sacred Diya Lamp Traditions',
      metaDescription: 'Discover the spiritual meaning and aromatherapeutic science of Pancha Thailam deeparadhana oil for pooja rituals and home diya lamps.',
      canonicalUrl: 'https://asbrandoils.com/blog/culture/deeparadhana-oil-pancha-thailam-spiritual-science',
      focusKeyword: 'deeparadhana oil pancha thailam',
      faqsJson: JSON.stringify([
        {
          question: 'What oils are included in Pancha Deepam Thailam?',
          answer: 'Traditional Pancha Deepam Thailam consists of five sacred oils: Sesame (Gingelly) Oil, Castor Oil, Neem Oil, Mahua (Illuppai) Oil, and Cow Ghee, often infused with natural jasmine fragrance.',
        },
        {
          question: 'Why should we not use regular cooking oil for pooja lamps?',
          answer: 'Standard refined cooking oils contain chemical additives and produce heavy smoke/soot. Pure sesame oil or consecrated Pancha Thailam provides clean combustion and adheres to Agamic spiritual principles.',
        },
      ]),
    },
    {
      title: 'Groundnut Oil vs Refined Oils: Why Cold-Pressed Peanut Oil is Returning to Indian Woks',
      slug: 'groundnut-oil-vs-refined-oils-indian-cooking',
      excerpt: 'An evidence-based comparison between traditional cold-pressed peanut oil and ultra-processed refined oils. Learn why health-conscious families are making the switch.',
      content: `
        <p>For decades, commercial advertisements convinced consumers that pale, odorless refined oils were modern and healthy. Today, nutritional biochemists and cardiologists are actively debunking this myth, pointing consumers back to cold-pressed groundnut oil.</p>
        
        <h2>How Refined Oils Are Made: The Industrial Reality</h2>
        <p>Refining seed oils involves harsh chemical solvents (like petroleum-derived hexane), high-heat bleaching (over 200°C), and deodorization with chemical neutralizers. This aggressive industrial process strips away 90% of natural Vitamin E, phytosterols, and natural aromas, leaving behind an oxidized, nutrient-depleted liquid.</p>
        
        <h2>The Cold-Pressed Groundnut Advantage</h2>
        <p>In contrast, double-filtered groundnut oil is extracted by mechanical pressing of premium whole groundnuts without toxic chemicals. It retains:</p>
        <ul>
          <li><strong>Resveratrol:</strong> The same potent cardio-protective antioxidant found in red grapes.</li>
          <li><strong>High Monounsaturated Fatty Acids (MUFA):</strong> Which help maintain healthy HDL cholesterol levels.</li>
          <li><strong>High Smoke Point:</strong> Naturally withstands 232°C without thermal breakdown during deep frying.</li>
        </ul>
        
        <h2>Taste Comparison: Why Food Tastes Crisper and Lighter</h2>
        <p>When you fry bhajiyas or prepare South Indian lemon rice with cold-pressed groundnut oil, the food absorbs less oil due to its ideal viscosity, delivering a non-greasy, pleasantly nutty crunch that refined oils simply cannot replicate.</p>
        
        <h2>The Verdict</h2>
        <p>Switching from chemically refined oils to genuine cold-pressed and double-filtered peanut oil is one of the easiest, highest-impact dietary upgrades you can make for cardiovascular longevity and superior culinary delight.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Fresh harvested whole groundnuts and pure golden peanut oil',
      readingTime: 5,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-08-28T11:00:00Z'),
      authorId: author2.id,
      categoryId: categoryMap['health'].id,
      seoTitle: 'Groundnut Oil vs Refined Oils | Health, Nutrition & Smoke Points',
      metaDescription: 'Compare cold-pressed groundnut oil with refined vegetable oils. Learn about resveratrol, smoke points, and heart-healthy fats in traditional peanut oil.',
      canonicalUrl: 'https://asbrandoils.com/blog/health/groundnut-oil-vs-refined-oils-indian-cooking',
      focusKeyword: 'groundnut oil vs refined oil',
      faqsJson: JSON.stringify([
        {
          question: 'Is groundnut oil good for heart health?',
          answer: 'Yes. Groundnut oil is rich in monounsaturated fatty acids (MUFA), phytosterols, and resveratrol which have been shown to support healthy blood lipid profiles and arterial elasticity.',
        },
      ]),
    },
    {
      title: 'Traditional Sesame Seed Podi (Idli Milagai Podi) Heirloom Recipe & Nutritional Secrets',
      slug: 'traditional-sesame-seed-idli-podi-recipe',
      excerpt: 'Step-by-step masterclass on roasting premium white sesame seeds with lentils and dry chillies to create the quintessential South Indian gunpowder (Idli Podi).',
      content: `
        <p>No South Indian breakfast table is complete without a generous mound of spicy Idli Milagai Podi, generously pooled with glistening golden gingelly oil. Learn the grandmother-approved technique for perfect podi.</p>
        
        <h2>The Importance of High-Grade Sesame Seeds</h2>
        <p>The foundation of great podi lies in using clean, well-hulled sesame seeds. Fresh hulled sesame seeds provide a sweet, nutty crunch without sandy grit or bitter aftertastes.</p>
        
        <h2>Ingredients List</h2>
        <ul>
          <li>1/2 cup A.S. Brand Hulled Gingelly Seeds</li>
          <li>1/2 cup Urad Dal (split black gram)</li>
          <li>1/4 cup Chana Dal (Bengal gram)</li>
          <li>10-12 Guntur Dry Red Chillies</li>
          <li>1/4 tsp Asafoetida (Hing)</li>
          <li>1 sprig fresh Curry Leaves</li>
          <li>1 tsp Sea Salt</li>
          <li>1 tsp pure gingelly oil for roasting</li>
        </ul>
        
        <h2>Step-by-Step Roasting Method</h2>
        <p>1. In a heavy-bottomed skillet, dry roast the hulled sesame seeds over low heat until they become aromatic and pop gently. Set aside.</p>
        <p>2. In the same pan, heat a few drops of sesame oil and roast urad dal and chana dal until golden amber.</p>
        <p>3. Roast the dry chillies, curry leaves, and hing until crisp.</p>
        <p>4. Allow all ingredients to cool completely to room temperature, then pulse coarsely in a spice grinder with rock salt.</p>
        
        <h2>How to Serve</h2>
        <p>Mix 2 tablespoons of freshly ground podi with a generous pool of cold-pressed gingelly oil, and dip hot, fluffy idlis for breakfast bliss.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Fluffy steamed idlis served with spicy red gunpowder milagai podi and oil',
      readingTime: 4,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-08-30T09:15:00Z'),
      authorId: author1.id,
      categoryId: categoryMap['recipes'].id,
      seoTitle: 'Authentic Sesame Seed Idli Podi Recipe | South Indian Gunpowder',
      metaDescription: 'Step-by-step heirloom South Indian Idli Milagai Podi recipe with roasted hulled sesame seeds and aromatic cold-pressed gingelly oil.',
      canonicalUrl: 'https://asbrandoils.com/blog/recipes/traditional-sesame-seed-idli-podi-recipe',
      focusKeyword: 'sesame seed idli podi recipe',
    },
    {
      title: 'Sustainable Sesame Cultivation: How South Indian Farmers Preserve Native Til Crops',
      slug: 'sustainable-sesame-cultivation-south-indian-agriculture',
      excerpt: 'An in-depth look at dryland sesame farming in Tamil Nadu and Andhra Pradesh, organic pest management, and the economic renaissance of native seed varieties.',
      content: `
        <p>Sesame (Sesamum indicum), known regionally as ellu or til, is one of humanity’s oldest cultivated oilseeds. In the arid plains of South India, sesame stands as a climate-resilient miracle crop capable of flourishing in minimal water where other crops fail.</p>
        
        <h2>The Agronomy of Sesame in Drought-Prone Regions</h2>
        <p>Sesame requires only 300-400mm of seasonal rainfall, thriving in well-drained loamy soils. Its deep taproot system draws moisture from subsoil layers while naturally aerating and enriching farm soil for subsequent crop rotations.</p>
        
        <h2>Hulling and Cleaning Technology</h2>
        <p>Once harvested, mechanical de-hulling processes separate the dark outer husk from the nutrient-dense inner kernel. Modern food processing allows farmers and millers to supply high-purity hulled sesame seeds to premium domestic and global culinary markets without chemical bleaching.</p>
        
        <h2>Supporting Smallholder Farmers</h2>
        <p>By choosing unadulterated sesame products and oils sourced from transparent supply chains, consumers directly support thousands of dryland farmers preserving heirloom seed biodiversity across rural India.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Lush green agricultural farm fields during harvest season',
      readingTime: 5,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-01T12:00:00Z'),
      authorId: author3.id,
      categoryId: categoryMap['agriculture'].id,
      seoTitle: 'Sustainable Sesame Farming in South India | Agriculture & Seed Diversity',
      metaDescription: 'Explore drought-resilient sesame cultivation, farmer cooperatives, and seed hulling innovations in South Indian dryland agriculture.',
      canonicalUrl: 'https://asbrandoils.com/blog/agriculture/sustainable-sesame-cultivation-south-indian-agriculture',
      focusKeyword: 'sesame cultivation south india',
    },
  ];

  for (const art of articles) {
    const createdArt = await prisma.article.upsert({
      where: { slug: art.slug },
      update: {},
      create: {
        ...art,
        tags: {
          connect: [
            { id: tagMap['Gingelly Oil'].id },
            { id: tagMap['South Indian Cooking'].id },
            { id: tagMap['Cold Pressed'].id },
          ],
        },
      },
    });
    console.log('Article created:', createdArt.title);
  }

  // 8. Create Default SEO Setting
  await prisma.sEOSetting.upsert({
    where: { id: 'default-seo' },
    update: {},
    create: {
      id: 'default-seo',
      siteTitle: 'A.S. Heritage & Living | Indian Culinary, Wellness & Culture',
      defaultMetaDescription: 'Discover authentic Indian recipes, cooking science, smoke points, wellness traditions, and heritage food culture.',
      defaultOgImage: 'https://asbrandoils.com/cdn/shop/files/Gingelly_oil_1_720x.png?v=1721982944',
      twitterHandle: '@asbrandoils',
      robotsDirectives: 'User-agent: *\nAllow: /\nSitemap: https://asbrandoils.com/sitemap.xml',
    },
  });

  // 9. Create Promotional Campaign
  await prisma.campaign.create({
    data: {
      name: 'South Indian Culinary Heritage Campaign',
      title: 'Purity Rooted in South Indian Tradition',
      description: 'Experience the golden aroma of cold-pressed, de-hulled sesame oil and double-filtered groundnut oil.',
      bannerImageUrl: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=1200&auto=format&fit=crop&q=80',
      ctaText: 'Explore A.S. Brand Collection',
      destinationUrl: 'https://asbrandoils.com/',
      placement: 'ARTICLE_MIDDLE',
      categoriesFilter: 'ALL',
      isActive: true,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
