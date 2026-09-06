export interface ProductPromoInfo {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  imageUrl: string;
  productUrl: string;
  marketplaceLinks: { name: string; url: string; badge?: string }[];
}

export interface PromotionRuleWithProduct {
  id: string;
  name: string;
  keywords: string;
  matchType: string;
  placementTypes: string[];
  maxLinksPerArticle: number;
  categoryFilter: string;
  isActive: boolean;
  priority: number;
  product: ProductPromoInfo;
}

export interface ProcessedArticleResult {
  html: string;
  matchedProducts: ProductPromoInfo[];
  injectedLinksCount: number;
  hasInlineCard: boolean;
  inlineCardProduct?: ProductPromoInfo;
  endCtaProduct?: ProductPromoInfo;
}

export function buildUtmUrl(
  baseUrl: string,
  placement: string,
  campaign: string = 'organic_editorial',
  articleSlug: string = 'general'
): string {
  try {
    const url = new URL(baseUrl || 'https://asbrandoils.com/');
    url.searchParams.set('utm_source', 'as_heritage_mag');
    url.searchParams.set('utm_medium', placement);
    url.searchParams.set('utm_campaign', campaign);
    url.searchParams.set('utm_content', articleSlug);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * Deterministic Contextual Promotion Processor
 * 
 * Rules:
 * 1. Strictly 2-3 links maximum per article.
 * 2. Never hyperlink inside headings (<h1>-<h6>), existing links (<a>), blockquotes, code, or captions.
 * 3. Enforce spacing between injected promotions.
 * 4. Deterministic: Given the same article content & rules, produce identical output for crawlers and readers.
 */
export function processArticleContent(
  rawContent: string,
  rules: PromotionRuleWithProduct[],
  categorySlug: string = '',
  articleSlug: string = ''
): ProcessedArticleResult {
  if (!rawContent || !rules || rules.length === 0) {
    return {
      html: rawContent || '',
      matchedProducts: [],
      injectedLinksCount: 0,
      hasInlineCard: false,
    };
  }

  // Filter rules active for this category
  const activeRules = rules
    .filter((r) => r.isActive)
    .filter((r) => r.categoryFilter === 'ALL' || r.categoryFilter === categorySlug)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  if (activeRules.length === 0) {
    return {
      html: rawContent,
      matchedProducts: [],
      injectedLinksCount: 0,
      hasInlineCard: false,
    };
  }

  // Collect all matched products for sidebar/end-CTA
  const matchedProductMap = new Map<string, ProductPromoInfo>();
  let primaryRule: PromotionRuleWithProduct | null = null;

  // Split content into top-level blocks (e.g. paragraphs, headings, etc.)
  // We work on <p> blocks specifically to keep headings, blockquotes, and lists clean.
  const pRegex = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  const paragraphMatches: { fullMatch: string; innerText: string; index: number }[] = [];
  
  let match: RegExpExecArray | null;
  while ((match = pRegex.exec(rawContent)) !== null) {
    paragraphMatches.push({
      fullMatch: match[0],
      innerText: match[1],
      index: match.index,
    });
  }

  let injectedLinksCount = 0;
  const maxLinksAllowed = 3;
  let lastInjectedParagraphIndex = -99;
  const modifiedParagraphs = new Map<number, string>();

  // Determine top matching rule for this article
  for (const rule of activeRules) {
    const keywords = rule.keywords
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const matchesArticle = keywords.some((kw) =>
      rawContent.toLowerCase().includes(kw)
    );

    if (matchesArticle) {
      if (!primaryRule) primaryRule = rule;
      matchedProductMap.set(rule.product.id, rule.product);
    }
  }

  // If no primary rule matched, return clean content
  if (!primaryRule) {
    return {
      html: rawContent,
      matchedProducts: [],
      injectedLinksCount: 0,
      hasInlineCard: false,
    };
  }

  // Inject in-text links in eligible paragraphs (with minimum spacing of at least 2 paragraphs)
  for (let i = 0; i < paragraphMatches.length; i++) {
    if (injectedLinksCount >= maxLinksAllowed) break;
    // Keep at least 2 paragraphs gap between links
    if (i - lastInjectedParagraphIndex < 2) continue;

    const p = paragraphMatches[i];
    let currentParagraphHtml = p.innerText;

    // Check against primary and active rules
    for (const rule of activeRules) {
      if (injectedLinksCount >= maxLinksAllowed) break;

      const keywords = rule.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      // Find first occurrence in paragraph that is not already inside an <a> tag
      for (const keyword of keywords) {
        if (injectedLinksCount >= maxLinksAllowed) break;

        // Regex ensuring not already in tag attribute or inside <a ...> ... </a>
        const kwEscaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Match keyword as whole word / bounded phrase
        const kwRegex = new RegExp(`(?<!<[^>]*)\\b(${kwEscaped})\\b(?![^<]*<\\/a>)`, 'i');

        if (kwRegex.test(currentParagraphHtml)) {
          const promoUrl = buildUtmUrl(
            rule.product.productUrl,
            'contextual_link',
            rule.product.slug,
            articleSlug
          );

          // Replace only the first occurrence in this paragraph
          currentParagraphHtml = currentParagraphHtml.replace(
            kwRegex,
            `<a href="${promoUrl}" target="_blank" rel="noopener noreferrer" class="as-context-link group inline-flex items-baseline font-medium text-forest-700 dark:text-forest-400 hover:text-gold-600 underline decoration-forest-400/50 hover:decoration-gold-500 transition-colors" data-product-id="${rule.product.id}" data-product-name="${rule.product.name}" title="Discover authentic ${rule.product.name}">$1<span class="inline-block text-[10px] ml-0.5 opacity-60 group-hover:opacity-100">↗</span></a>`
          );

          injectedLinksCount++;
          lastInjectedParagraphIndex = i;
          matchedProductMap.set(rule.product.id, rule.product);
          break; // move to next paragraph
        }
      }
    }

    if (currentParagraphHtml !== p.innerText) {
      modifiedParagraphs.set(i, `<p>${currentParagraphHtml}</p>`);
    }
  }

  // Reconstruct the full HTML content
  let finalHtml = rawContent;
  if (modifiedParagraphs.size > 0) {
    let pIdx = 0;
    finalHtml = rawContent.replace(/<p\b[^>]*>([\s\S]*?)<\/p>/gi, (orig) => {
      const replacement = modifiedParagraphs.get(pIdx);
      pIdx++;
      return replacement || orig;
    });
  }

  const allMatched = Array.from(matchedProductMap.values());
  const selectedProduct = primaryRule.product;

  return {
    html: finalHtml,
    matchedProducts: allMatched,
    injectedLinksCount,
    hasInlineCard: true,
    inlineCardProduct: selectedProduct,
    endCtaProduct: selectedProduct,
  };
}
