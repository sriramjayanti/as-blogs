const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with updated 8 recipe categories and rich content...');

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
      bio: 'Author of three monographs on traditional home cooking, heirloom spice blends, and cold-pressing methods across India.',
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
      roleTitle: 'Executive Master Chef & Nutritionist',
      bio: 'Specializing in delicious home recipe ideas, healthy everyday kitchen secrets, and traditional oil-based sweets.',
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
      roleTitle: 'Street Food & Regional Gastronomy Researcher',
      bio: 'Documents traditional festival recipes, street food cultures, and sustainable oilseed farming across India.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
      twitter: 'raghavan_agri',
    },
  });

  // 3. Create the 8 Core Recipe Categories
  const categories = [
    {
      name: 'Vegetarian Recipes',
      slug: 'vegetarian-recipes',
      description: 'All Indian and Non-Indian wholesome vegetarian recipes, hearty vegetable gravies, nutritious stir-fries, and healthy greens.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
      orderIndex: 1,
    },
    {
      name: 'Sweet Recipes',
      slug: 'sweet-recipes',
      description: 'Delicious traditional and modern sweets made with pure cold-pressed oils, sesame seeds, jaggery, and dry fruits.',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
      orderIndex: 2,
    },
    {
      name: 'Non-Vegetarian Recipes',
      slug: 'non-vegetarian-recipes',
      description: 'Flavorsome chicken, mutton, and coastal seafood curries, roasts, and biryanis tempered with authentic cooking oils.',
      image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&auto=format&fit=crop&q=80',
      orderIndex: 3,
    },
    {
      name: 'Festival Recipes',
      slug: 'festival-recipes',
      description: 'Sacred festival recipes, Diwali & Pongal delicacies, crispy festive snacks, and traditional pooja feast preparations.',
      image: 'https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?w=800&auto=format&fit=crop&q=80',
      orderIndex: 4,
    },
    {
      name: 'South Indian Recipes',
      slug: 'south-indian-recipes',
      description: 'Heirloom South Indian sambars, rasams, crispy dosas, fluffy idlis, and authentic gingelly oil tempered curries.',
      image: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800&auto=format&fit=crop&q=80',
      orderIndex: 5,
    },
    {
      name: 'North Indian Recipes',
      slug: 'north-indian-recipes',
      description: 'Rich dal tadkas, kadai paneer, aromatic tawa sabzis, fragrant jeera rice, and beloved North Indian culinary classics.',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
      orderIndex: 6,
    },
    {
      name: 'Breakfast Recipes',
      slug: 'breakfast-recipes',
      description: 'Quick, energized morning tiffins, healthy poha, fluffy idlis, upma, stuffed parathas, and breakfast delights.',
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80',
      orderIndex: 7,
    },
    {
      name: 'Street Food Recipes',
      slug: 'street-food-recipes',
      description: 'Crispy mirchi bajjis, onion pakoras, samosas, spiced chaats, and iconic Indian street delicacies fried to perfection.',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
      orderIndex: 8,
    },
  ];

  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
        orderIndex: cat.orderIndex,
      },
      create: cat,
    });
    categoryMap[cat.slug] = created;
  }
  console.log('8 Recipe Categories created/updated.');

  // 4. Create Tags
  const tagList = [
    'Vegetarian',
    'Non-Vegetarian',
    'Sweets',
    'Festival Special',
    'South Indian',
    'North Indian',
    'Breakfast',
    'Street Food',
    'Gingelly Oil',
    'Groundnut Oil',
    'Sesame Seeds',
    'Deep Frying',
    'Cold Pressed',
    'Pooja Rituals',
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

  // 6. Promotion Rules
  await prisma.promotionRule.deleteMany({});
  const rules = [
    {
      name: 'Gingelly / Sesame Oil Context Rule',
      keywords: 'gingelly oil, sesame oil, til oil, sesame, traditional cooking, South Indian cooking, sambar, rasam',
      matchType: 'CONTAINS',
      productId: productMap['as-brand-hulled-gingelly-oil'].id,
      placementTypes: JSON.stringify(['CONTEXT_LINK', 'INLINE_CARD', 'SIDEBAR', 'END_CTA']),
      maxLinksPerArticle: 2,
      categoryFilter: 'ALL',
      priority: 10,
    },
    {
      name: 'Groundnut / Peanut Oil Context Rule',
      keywords: 'groundnut oil, peanut oil, groundnuts, frying oil, deep frying, pakora, bajji, sweet recipes, street food',
      matchType: 'CONTAINS',
      productId: productMap['as-brand-groundnut-oil'].id,
      placementTypes: JSON.stringify(['CONTEXT_LINK', 'INLINE_CARD', 'SIDEBAR', 'END_CTA']),
      maxLinksPerArticle: 2,
      categoryFilter: 'ALL',
      priority: 9,
    },
    {
      name: 'Gingelly Seeds / Sweets Context Rule',
      keywords: 'sesame seeds, gingelly seeds, til seeds, sesame recipes, idli podi, til ladoo, sweets, sweet recipes',
      matchType: 'CONTAINS',
      productId: productMap['as-brand-hulled-gingelly-seeds'].id,
      placementTypes: JSON.stringify(['CONTEXT_LINK', 'INLINE_CARD', 'SIDEBAR', 'END_CTA']),
      maxLinksPerArticle: 2,
      categoryFilter: 'ALL',
      priority: 8,
    },
    {
      name: 'Festival / Pooja / Devotional Context Rule',
      keywords: 'festival, pooja, puja, deepam, diya, lamp, temple, devotional, deeparadhana, pancha thailam',
      matchType: 'CONTAINS',
      productId: productMap['sree-divya-sugandha-deeparadhana-oil'].id,
      placementTypes: JSON.stringify(['CONTEXT_LINK', 'INLINE_CARD', 'SIDEBAR', 'END_CTA']),
      maxLinksPerArticle: 2,
      categoryFilter: 'ALL',
      priority: 10,
    },
  ];

  for (const r of rules) {
    await prisma.promotionRule.create({ data: r });
  }

  // 7. Seed Authentic Recipes Covering the 8 New Categories
  const recipes = [
    // 1. Vegetarian Recipes (All Indian & Non-Indian)
    {
      title: 'Restaurant-Style Creamy Vegetable Kurma (Mixed Veg Delight)',
      slug: 'restaurant-style-vegetable-kurma-recipe',
      excerpt: 'A fragrant, mild coconut and cashew-based mixed vegetable curry simmered to perfection with aromatic spices and wholesome garden vegetables.',
      content: `
        <p>Whether you are serving flaky Malabar parottas, soft chapatis, or fragrant jeera rice, a well-balanced Vegetable Kurma is the undisputed crown jewel of Indian vegetarian cuisine. Combining tender carrots, green beans, potatoes, and green peas in a rich coconut-cashew gravy, this recipe brings restaurant indulgence right into your everyday kitchen.</p>
        
        <h2>The Secret to Rich Aroma: Authentic Tempering</h2>
        <p>In traditional home recipes, heating cold-pressed gingelly oil with whole cloves, green cardamom, cinnamon, and fennel seeds before sautéing onions extracts the deep, essential spice oils without harsh smoking.</p>
        
        <h2>Ingredients List</h2>
        <ul>
          <li>2 cups mixed chopped vegetables (potatoes, carrots, beans, green peas, cauliflower)</li>
          <li>1 medium onion, finely chopped</li>
          <li>2 medium tomatoes, pureed</li>
          <li>2 tbsp pure gingelly oil for tempering</li>
          <li>1 tsp ginger-garlic paste</li>
          <li>Whole spices: 2 cardamom pods, 1 star anise, 1 inch cinnamon stick, 3 cloves</li>
          <li><strong>Kurma Paste:</strong> 1/2 cup grated fresh coconut, 8 soaked cashews, 1 tbsp roasted gram, 1 tsp fennel seeds, 2 green chillies</li>
          <li>1/2 tsp turmeric powder, 1 tsp garam masala, 1 tsp coriander powder, salt to taste</li>
          <li>Fresh coriander leaves and mint for garnish</li>
        </ul>
        
        <h2>Step-by-Step Cooking Method</h2>
        <p>1. Steam the chopped mixed vegetables in salted water until just tender. Do not overcook.</p>
        <p>2. Grind the coconut, soaked cashews, roasted gram, fennel seeds, and green chillies with 1/4 cup water into a smooth paste.</p>
        <p>3. In a heavy-bottomed pan, heat the cooking oil and crackle the whole spices. Add onions and sauté until translucent.</p>
        <p>4. Stir in ginger-garlic paste and sauté until the raw aroma dissipates. Add tomato puree and spice powders, cooking until oil separates along the edges.</p>
        <p>5. Pour in the ground coconut-cashew paste and steamed vegetables along with 1 cup of warm water. Simmer on medium-low flame for 7-8 minutes.</p>
        <p>6. Garnish with fresh chopped coriander and serve warm with dosas or parottas.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Rich vegetable kurma served in traditional bowl with fresh herbs',
      readingTime: 6,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-02T10:00:00Z'),
      authorId: author1.id,
      categoryId: categoryMap['vegetarian-recipes'].id,
      seoTitle: 'Vegetable Kurma Recipe | Creamy Restaurant-Style Mixed Veg Curry',
      metaDescription: 'Easy step-by-step recipe for restaurant-style creamy mixed vegetable kurma with fresh coconut, cashews, and aromatic spices.',
      canonicalUrl: 'https://asbrandoils.com/vegetarian-recipes/restaurant-style-vegetable-kurma-recipe',
      focusKeyword: 'vegetable kurma recipe',
      faqsJson: JSON.stringify([
        {
          question: 'Can I make this kurma recipe vegan?',
          answer: 'Yes, this recipe is naturally 100% vegan as it uses coconut paste and cashews rather than dairy cream or butter.',
        },
      ]),
    },

    // 2. Sweet Recipes (Everything Making With Oils)
    {
      title: 'Traditional Sesame Seed Jaggery Ladoo (Til Ladoo Made with Pure Oils)',
      slug: 'traditional-sesame-seed-jaggery-ladoo-sweet-recipe',
      excerpt: 'Nutrient-rich, golden roasted sesame ladoos sweetened with organic jaggery and bound with pure sesame oil. An authentic winter and festival sweet.',
      content: `
        <p>Making delicious sweets does not always require heavy refined butter or ghee. Traditional Indian sweet recipes have celebrated cold-pressed oils and nutrient-dense oilseeds for generations. These traditional Til Ladoos combine calcium-rich sesame seeds, organic jaggery, and a touch of cold-pressed gingelly oil for irresistible chewiness and nutty aroma.</p>
        
        <h2>Why Sesame Seeds & Pure Oil Are Nutritional Superfoods</h2>
        <p>Using premium hulled sesame seeds ensures a clean, sweet crunch without any sandy bitterness. Sesame seeds are packed with bioavailable calcium, zinc, iron, and healthy monounsaturated fats that provide sustained vitality.</p>
        
        <h2>Ingredients List</h2>
        <ul>
          <li>1 cup A.S. Brand Hulled Gingelly Seeds</li>
          <li>3/4 cup organic powdered jaggery (gud)</li>
          <li>1 tbsp pure gingelly oil or groundnut oil for greasing and aroma</li>
          <li>1/2 tsp freshly ground green cardamom powder</li>
          <li>2 tbsp roasted crushed peanuts for extra crunch</li>
        </ul>
        
        <h2>Step-by-Step Sweet Preparation</h2>
        <p>1. In a dry heavy pan, roast the sesame seeds on medium-low heat for 3-4 minutes until they become aromatic and pop gently. Set aside to cool.</p>
        <p>2. In the same pan, melt the jaggery with 1 tablespoon of water over low heat until it reaches a soft ball consistency.</p>
        <p>3. Stir in cardamom powder, roasted peanuts, and roasted sesame seeds. Turn off heat immediately and mix thoroughly.</p>
        <p>4. Grease your palms with a few drops of pure gingelly oil and roll the warm mixture into round, bite-sized ladoos before it hardens.</p>
        <p>5. Allow to cool completely and store in an airtight container for up to 3 weeks.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Golden roasted sesame seed ladoos with jaggery and cardamom',
      readingTime: 5,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-03T11:30:00Z'),
      authorId: author2.id,
      categoryId: categoryMap['sweet-recipes'].id,
      seoTitle: 'Sesame Seed Jaggery Ladoo Sweet Recipe | Til Ladoo with Pure Oil',
      metaDescription: 'Authentic Indian sweet recipe: Sesame seed jaggery ladoos made with pure oil. Healthy, calcium-rich, and easy home recipe.',
      canonicalUrl: 'https://asbrandoils.com/sweet-recipes/traditional-sesame-seed-jaggery-ladoo-sweet-recipe',
      focusKeyword: 'sesame sweet recipes til ladoo',
    },

    // 3. Non-Vegetarian Recipes
    {
      title: 'Chettinad Pepper Chicken Roast (Authentic South Indian Chicken Fry)',
      slug: 'authentic-chettinad-pepper-chicken-roast-recipe',
      excerpt: 'Fiery, succulent chicken morsels coated in freshly roasted black peppercorns, curry leaves, shallots, and fragrant cold-pressed gingelly oil.',
      content: `
        <p>From the heritage kitchens of Karaikudi and Chettinad comes one of India’s most celebrated non-vegetarian recipes: Chettinad Pepper Chicken. Known for its intense aroma, spicy black pepper punch, and glistening golden finish, this dry roast is best paired with hot rasam rice or layered parottas.</p>
        
        <h2>The Essential Role of Gingelly Oil in Chettinad Cuisine</h2>
        <p>Chettinad culinary masters strictly prescribe pure gingelly oil for meat roasts. The high antioxidant content of sesame oil binds with volatile piperine compounds in freshly cracked black pepper, balancing the heat while ensuring tender, juicy chicken pieces.</p>
        
        <h2>Ingredients List</h2>
        <ul>
          <li>500g bone-in tender chicken, cut into small curry pieces</li>
          <li>3 tbsp pure gingelly oil</li>
          <li>15-20 small shallots (sambar onions), finely sliced</li>
          <li>2 sprigs fresh curry leaves</li>
          <li>1 tbsp ginger-garlic paste</li>
          <li><strong>Freshly Roasted Chettinad Spice Blend:</strong> 1.5 tbsp black peppercorns, 1 tbsp fennel seeds, 1 tsp cumin seeds, 1 tsp coriander seeds, 3 dry red chillies</li>
          <li>1/2 tsp turmeric powder and rock salt to taste</li>
        </ul>
        
        <h2>Step-by-Step Cooking Method</h2>
        <p>1. Dry roast the whole spices until aromatic and coarsely grind into a fresh spice powder.</p>
        <p>2. Heat gingelly oil in an iron skillet. Add curry leaves and sliced shallots, sautéing until golden brown.</p>
        <p>3. Add ginger-garlic paste and turmeric, then toss in the chicken pieces on high heat to sear the exterior.</p>
        <p>4. Add salt, cover with lid, and let the chicken cook in its natural juices on medium heat for 12-15 minutes.</p>
        <p>5. Remove the lid, sprinkle the ground Chettinad pepper spice powder, and roast on medium-high flame until moisture evaporates and spices coat the chicken deeply.</p>
        <p>6. Drizzle a final teaspoon of fragrant sesame oil and fresh curry leaves before serving.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Chettinad pepper chicken roast with curry leaves and black pepper in cast iron skillet',
      readingTime: 6,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-04T14:00:00Z'),
      authorId: author2.id,
      categoryId: categoryMap['non-vegetarian-recipes'].id,
      seoTitle: 'Chettinad Pepper Chicken Roast Recipe | Authentic South Indian Chicken Fry',
      metaDescription: 'Step-by-step authentic Chettinad Pepper Chicken Roast recipe with fresh ground pepper, curry leaves, and traditional gingelly oil.',
      canonicalUrl: 'https://asbrandoils.com/non-vegetarian-recipes/authentic-chettinad-pepper-chicken-roast-recipe',
      focusKeyword: 'chettinad pepper chicken recipe',
    },

    // 4. Festival Recipes
    {
      title: 'Crispy Butter Murukku & Festival Snacks: Traditional Deep Frying Secrets',
      slug: 'crispy-butter-murukku-festival-recipe-deep-frying',
      excerpt: 'Master the art of crunchy, melt-in-mouth festival Murukku for Diwali and Gokulashtami using double-filtered groundnut oil for zero greasiness.',
      content: `
        <p>Festival seasons in India are incomplete without the comforting crackle of fresh Murukku, ribbon pakoda, and festive sweets. Achieving light, golden, and non-greasy fried snacks requires two key elements: the right flour ratio and a high-smoke-point frying oil.</p>
        
        <h2>Why Groundnut Oil is the Ultimate Festival Frying Choice</h2>
        <p>Traditional festival recipes demand high frying temperatures between 180°C and 195°C. Double-filtered groundnut oil boasts a natural smoke point of 232°C (450°F), preventing oil breakdown, unpleasant greasy odor, or smoke accumulation during prolonged festive batch frying.</p>
        
        <h2>Ingredients List</h2>
        <ul>
          <li>2 cups fine rice flour (sieved)</li>
          <li>1/2 cup roasted gram flour (pottukadalai flour)</li>
          <li>2 tbsp melted butter</li>
          <li>1 tsp A.S. Brand Hulled Gingelly Seeds</li>
          <li>1/2 tsp cumin seeds or ajwain (carom seeds)</li>
          <li>1/4 tsp asafoetida (hing)</li>
          <li>Salt to taste and warm water for kneading</li>
          <li>A.S. Brand Groundnut Oil for deep frying</li>
        </ul>
        
        <h2>Step-by-Step Frying Method</h2>
        <p>1. In a large mixing bowl, combine rice flour, roasted gram flour, sesame seeds, cumin seeds, hing, salt, and butter. Rub butter evenly into the flour.</p>
        <p>2. Gradually add warm water and knead into a soft, non-sticky pliable dough.</p>
        <p>3. Heat groundnut oil in a deep kadai over medium flame until a small piece of dough rises immediately without browning.</p>
        <p>4. Fill the murukku press with the star attachment and press directly into hot oil in spiral rounds or onto greased ladles.</p>
        <p>5. Deep fry on medium heat, flipping occasionally until the sizzling sound subsides and the murukku turns light golden.</p>
        <p>6. Drain on paper towels and store in airtight tins for crispness that lasts weeks.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Crispy golden festival murukku in traditional brass platter',
      readingTime: 5,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-05T09:00:00Z'),
      authorId: author1.id,
      categoryId: categoryMap['festival-recipes'].id,
      seoTitle: 'Crispy Butter Murukku Recipe | Festival Snacks & Deep Frying Secrets',
      metaDescription: 'Make authentic crispy festival murukku for Diwali and celebrations. Learn the secrets of high heat frying with pure groundnut oil.',
      canonicalUrl: 'https://asbrandoils.com/festival-recipes/crispy-butter-murukku-festival-recipe-deep-frying',
      focusKeyword: 'festival murukku recipe deep frying',
    },

    // 5. South Indian Recipes
    {
      title: 'Authentic Madras Sambar & Crispy Medu Vada: The Gingelly Oil Secret',
      slug: 'authentic-madras-sambar-crispy-medu-vada-recipe',
      excerpt: 'Learn the grandmother-approved technique for making restaurant-grade Madras Sambar with drumsticks and shallots, finished with a golden sesame oil tadka.',
      content: `
        <p>A steaming bowl of authentic South Indian Sambar paired with golden Medu Vadas is celebrated worldwide. But what differentiates ordinary home sambar from the unforgettable aroma of legendary South Indian tiffin centers? The answer is the final tadka of pure cold-pressed gingelly oil.</p>
        
        <h2>The Science of the Sambar Tadka</h2>
        <p>Gingelly oil acts as a flavor carrier. When hot sesame oil meets mustard seeds, dried Guntur chillies, curry leaves, and a generous pinch of asafoetida (hing), it creates an instant emulsion that infuses deep umami throughout the tamarind-lentil broth.</p>
        
        <h2>Ingredients List</h2>
        <ul>
          <li>1 cup Toor Dal (split pigeon peas), boiled until mushy</li>
          <li>1 cup mixed vegetables (drumsticks, shallots, yellow pumpkin, carrots)</li>
          <li>1 medium lime-sized ball of aged tamarind, extracted in 1.5 cups warm water</li>
          <li>2 tbsp freshly ground Sambar Powder (coriander, chana dal, fenugreek, dry chillies)</li>
          <li>1/2 tsp turmeric powder, rock salt to taste</li>
          <li><strong>Fragrant Tadka:</strong> 2 tbsp A.S. Brand Hulled Gingelly Oil, 1 tsp mustard seeds, 2 dry red chillies, 1/4 tsp hing, 1 sprig curry leaves</li>
        </ul>
        
        <h2>Step-by-Step Cooking Method</h2>
        <p>1. In a pot, cook the shallots and drumsticks in tamarind water with turmeric and salt until raw tamarind smell vanishes.</p>
        <p>2. Add sambar powder and simmer for 4 minutes until vegetables are tender.</p>
        <p>3. Add mashed toor dal and adjust consistency with warm water. Bring to a rolling boil on medium heat.</p>
        <p>4. In a small tadka ladle, heat pure gingelly oil. Crackle mustard seeds, red chillies, hing, and curry leaves. Pour immediately into the simmering sambar and close with lid to trap the aroma.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Authentic South Indian Sambar with crispy medu vada and coconut chutney',
      readingTime: 5,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-06T08:00:00Z'),
      authorId: author2.id,
      categoryId: categoryMap['south-indian-recipes'].id,
      seoTitle: 'Authentic Madras Sambar Recipe | South Indian Sambar with Gingelly Oil',
      metaDescription: 'Grandmother-approved Madras Sambar recipe with drumsticks, shallots, and fragrant cold-pressed gingelly oil tadka.',
      canonicalUrl: 'https://asbrandoils.com/south-indian-recipes/authentic-madras-sambar-crispy-medu-vada-recipe',
      focusKeyword: 'authentic south indian sambar recipe',
    },

    // 6. North Indian Recipes
    {
      title: 'Dhaba-Style Dal Tadka & Kadai Paneer: Restaurant Secrets for Home Cooks',
      slug: 'dhaba-style-dal-tadka-kadai-paneer-recipe',
      excerpt: 'Smoky, aromatic yellow dal tempered with garlic, cumin, and double-filtered cooking oil, paired with spicy bell pepper Kadai Paneer.',
      content: `
        <p>Dhaba-style North Indian recipes are legendary for their smoky richness, robust whole spices, and comforting appeal. Recreating that signature highway dhaba flavor at home requires understanding how high-temperature oil extraction releases the essential aromas of crushed garlic, dried fenugreek leaves (kasoori methi), and cumin seeds.</p>
        
        <h2>The Secret Double Tadka Technique</h2>
        <p>For authentic Dal Tadka, the first tempering of onions and ginger-garlic is cooked into the dal, while the second flash tempering with double-filtered groundnut oil, whole red chillies, and Kashmiri deghi mirch is poured on top right before serving.</p>
        
        <h2>Ingredients List</h2>
        <ul>
          <li>3/4 cup Toor Dal and 1/4 cup Yellow Moong Dal (soaked 30 mins)</li>
          <li>2 large tomatoes, chopped</li>
          <li>1 large onion, finely chopped</li>
          <li>6 cloves garlic, finely minced</li>
          <li>2 tbsp double filtered cooking oil</li>
          <li>1 tsp cumin seeds, 2 dry red chillies, 1/2 tsp Kashmiri red chilli powder</li>
          <li>1 tbsp crushed Kasoori Methi and fresh cilantro</li>
        </ul>
        
        <h2>Step-by-Step Cooking Method</h2>
        <p>1. Pressure cook soaked dals with turmeric and salt for 4 whistles until soft.</p>
        <p>2. Heat 1 tbsp oil in a pan, sauté onions, green chillies, and half the minced garlic until golden. Add tomatoes and cook until soft. Mix into the boiled dal.</p>
        <p>3. In a small tadka pan, heat the remaining oil until hot. Add cumin seeds, remaining garlic, dry chillies, and kasoori methi. Turn off flame and stir in Kashmiri chilli powder.</p>
        <p>4. Pour the sizzling red tadka over the dal and garnish with coriander leaves.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Dhaba style yellow dal tadka in copper bowl with garlic and red chilli',
      readingTime: 5,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-07T12:00:00Z'),
      authorId: author1.id,
      categoryId: categoryMap['north-indian-recipes'].id,
      seoTitle: 'Dhaba Style Dal Tadka Recipe | North Indian Yellow Lentil Curry',
      metaDescription: 'Make authentic smoky Dhaba-style Dal Tadka at home with double garlic tempering and aromatic cooking oils.',
      canonicalUrl: 'https://asbrandoils.com/north-indian-recipes/dhaba-style-dal-tadka-kadai-paneer-recipe',
      focusKeyword: 'dhaba style dal tadka recipe',
    },

    // 7. Breakfast Recipes
    {
      title: 'Golden Crispy Masala Dosa & Fluffy Idli Batter: Complete Morning Breakfast Guide',
      slug: 'golden-crispy-masala-dosa-fluffy-idli-breakfast-recipe',
      excerpt: 'Master the fermentation ratios for foolproof homemade dosa batter, spiced potato filling, and golden crispy dosas with cold-pressed oil.',
      content: `
        <p>A great breakfast sets the tone for the entire day. In Indian households, nothing rivals the comforting warmth of hot, crispy masala dosas or pillow-soft steamed idlis served with freshly made coconut chutney and spicy gun powder.</p>
        
        <h2>How Pure Oil Yields the Crispiest Dosa Crust</h2>
        <p>When batter meets a hot cast-iron tawa, a thin ring of pure gingelly oil around the perimeter creates micro-aeration channels that prevent sticking while caramelizing the fermented starches into a stunning golden, crunchy crust.</p>
        
        <h2>Ingredients List</h2>
        <ul>
          <li>3 cups Idli Rice and 1 cup Whole Urad Dal (soaked and ground smooth)</li>
          <li>1/4 tsp Fenugreek Seeds (methi)</li>
          <li><strong>Potato Masala:</strong> 3 boiled potatoes, 1 sliced onion, 2 green chillies, 1/2 tsp mustard seeds, 1 tsp urad dal, curry leaves, turmeric</li>
          <li>A.S. Brand Hulled Gingelly Oil for roasting dosas</li>
        </ul>
        
        <h2>Step-by-Step Breakfast Method</h2>
        <p>1. Allow the ground batter to ferment in a warm place for 8-10 hours until aerated and doubled in volume.</p>
        <p>2. Prepare the potato masala by tempering mustard seeds, urad dal, green chillies, onions, and curry leaves in hot oil, then tossing with mashed potatoes and turmeric.</p>
        <p>3. Heat cast-iron skillet, pour a ladle of batter, and spread in quick concentric circles.</p>
        <p>4. Drizzle 1 teaspoon of pure gingelly oil along the outer edge and center. Cook on medium flame until golden brown.</p>
        <p>5. Place potato masala in the center, fold, and serve immediately with fresh chutneys.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Golden crispy masala dosa served with potato filling and coconut chutney',
      readingTime: 5,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-08T07:30:00Z'),
      authorId: author2.id,
      categoryId: categoryMap['breakfast-recipes'].id,
      seoTitle: 'Crispy Masala Dosa Recipe | South Indian Breakfast Guide & Batter Secret',
      metaDescription: 'Step-by-step masterclass for crispy golden masala dosas and fluffy idlis with traditional fermentation secrets and gingelly oil roasting.',
      canonicalUrl: 'https://asbrandoils.com/breakfast-recipes/golden-crispy-masala-dosa-fluffy-idli-breakfast-recipe',
      focusKeyword: 'crispy masala dosa breakfast recipe',
    },

    // 8. Street Food Recipes
    {
      title: 'Crispy Andhra Mirchi Bajji & Onion Pakoras: Famous Indian Street Food at Home',
      slug: 'crispy-andhra-mirchi-bajji-onion-pakora-street-food-recipe',
      excerpt: 'Learn the street vendor secrets for extra-crisp Mirchi Bajjis stuffed with ajwain-tamarind and golden onion pakoras fried in double-filtered groundnut oil.',
      content: `
        <p>Indian street food is celebrated for its irresistible aromas, vibrant spices, and crispy fried textures. From the bustling roadside stalls of Hyderabad to evening tea shops across Chennai, hot Mirchi Bajjis and crunchy Onion Pakoras are the ultimate monsoon snack.</p>
        
        <h2>The Street Vendor Secret: High-Temperature Groundnut Oil</h2>
        <p>Street food masters rely on double-filtered groundnut oil because it maintains steady frying heat without smoking or imparting heavy grease, resulting in an airy, shatteringly crisp gram flour crust.</p>
        
        <h2>Ingredients List</h2>
        <ul>
          <li>8-10 large Bhavnagri / Bajji Green Chillies</li>
          <li>1.5 cups Besan (Gram Flour) and 3 tbsp Rice Flour (for extra crispness)</li>
          <li>1/4 tsp baking soda, 1/2 tsp red chilli powder, salt to taste</li>
          <li><strong>Stuffing:</strong> 2 tbsp roasted peanut powder, 1 tsp carom seeds (ajwain), 1 tbsp tamarind paste, pinch of salt</li>
          <li>A.S. Brand Groundnut Oil for deep frying</li>
        </ul>
        
        <h2>Step-by-Step Street Food Method</h2>
        <p>1. Slit the green chillies lengthwise and remove seeds. Fill each chilli with the peanut-ajwain tamarind stuffing.</p>
        <p>2. Whisk besan, rice flour, baking soda, chilli powder, salt, and 1 tbsp hot oil with water into a thick, smooth batter.</p>
        <p>3. Heat groundnut oil in a deep kadai over medium heat.</p>
        <p>4. Dip stuffed chillies into the batter and slide gently into hot oil. Fry until crisp and golden amber on all sides.</p>
        <p>5. Drain and serve hot with chopped raw onions, lemon wedges, and hot ginger chai.</p>
      `,
      featuredImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&auto=format&fit=crop&q=80',
      imageAlt: 'Crispy golden fried mirchi bajji and onion pakoras on street food platter',
      readingTime: 5,
      status: 'PUBLISHED',
      publishedAt: new Date('2026-09-09T16:00:00Z'),
      authorId: author3.id,
      categoryId: categoryMap['street-food-recipes'].id,
      seoTitle: 'Crispy Mirchi Bajji & Onion Pakora Recipe | Indian Street Food Secrets',
      metaDescription: 'Authentic Indian street food recipe: Crispy Andhra stuffed Mirchi Bajji and onion pakoras with street vendor deep frying tips.',
      canonicalUrl: 'https://asbrandoils.com/street-food-recipes/crispy-andhra-mirchi-bajji-onion-pakora-street-food-recipe',
      focusKeyword: 'mirchi bajji street food recipe',
    },
  ];

  for (const rec of recipes) {
    const createdRec = await prisma.article.upsert({
      where: { slug: rec.slug },
      update: {
        title: rec.title,
        excerpt: rec.excerpt,
        content: rec.content,
        featuredImage: rec.featuredImage,
        imageAlt: rec.imageAlt,
        readingTime: rec.readingTime,
        status: rec.status,
        authorId: rec.authorId,
        categoryId: rec.categoryId,
        seoTitle: rec.seoTitle,
        metaDescription: rec.metaDescription,
        canonicalUrl: rec.canonicalUrl,
        focusKeyword: rec.focusKeyword,
        faqsJson: rec.faqsJson || '[]',
      },
      create: {
        ...rec,
        tags: {
          connect: [
            { id: tagMap['Vegetarian'].id },
            { id: tagMap['South Indian'].id },
            { id: tagMap['Cold Pressed'].id },
          ],
        },
      },
    });
    console.log('Recipe Article created:', createdRec.title);
  }

  // 8. Update Default SEO Setting
  await prisma.sEOSetting.upsert({
    where: { id: 'default-seo' },
    update: {},
    create: {
      id: 'default-seo',
      siteTitle: 'Delicious Food Recipe Ideas & Everyday Kitchen | Healthy Recipes',
      defaultMetaDescription: 'Discover delicious food recipe ideas, healthy vegetarian & non-vegetarian dishes, traditional sweets made with oils, and authentic street food secrets.',
      defaultOgImage: 'https://asbrandoils.com/cdn/shop/files/Gingelly_oil_1_720x.png?v=1721982944',
      twitterHandle: '@asbrandoils',
      robotsDirectives: 'User-agent: *\nAllow: /\nSitemap: https://asbrandoils.com/sitemap.xml',
    },
  });

  console.log('Database re-seeded successfully with 8 recipe categories!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
