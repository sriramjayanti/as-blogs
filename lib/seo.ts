export interface StructuredDataArticleProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedTime: string;
  modifiedTime: string;
  authorName: string;
  authorUrl?: string;
  categoryName: string;
}

export function generateArticleJsonLd(props: StructuredDataArticleProps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': props.url,
    },
    headline: props.title,
    description: props.description,
    image: [props.imageUrl],
    datePublished: props.publishedTime,
    dateModified: props.modifiedTime,
    author: {
      '@type': 'Person',
      name: props.authorName,
      url: props.authorUrl || 'https://asbrandoils.com/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'A.S. Heritage & Living',
      logo: {
        '@type': 'ImageObject',
        url: 'https://asbrandoils.com/cdn/shop/files/Gingelly_oil_1_720x.png?v=1721982944',
      },
    },
    articleSection: props.categoryName,
  };
}

export function generateBreadcrumbJsonLd(items: { name: string; item: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.item,
    })),
  };
}

export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };
}

export function generateOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'A.S. Heritage & Living',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    logo: 'https://asbrandoils.com/cdn/shop/files/Gingelly_oil_1_720x.png?v=1721982944',
    sameAs: [
      'https://asbrandoils.com/',
      'https://www.facebook.com/asbrandoils',
      'https://www.instagram.com/asbrandoils',
    ],
  };
}
