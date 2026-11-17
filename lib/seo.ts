import { getSiteUrl } from './utils';

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
  const siteUrl = getSiteUrl();
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
      url: props.authorUrl && !props.authorUrl.includes('asbrandoils.com') ? props.authorUrl : `${siteUrl}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'A.S. Heritage & Living',
      url: siteUrl,
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
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'A.S. Heritage & Living',
    url: siteUrl,
    logo: 'https://asbrandoils.com/cdn/shop/files/Gingelly_oil_1_720x.png?v=1721982944',
    sameAs: [
      'https://asbrandoils.com/',
      'https://youtube.com/@asbrandoilsrecipes?si=Q3ScmdUlfgl_0gIa',
      'https://www.instagram.com/asbrand_oils_recipes?psln=MW82OWQ2djg0bWdweQ==',
    ],
  };
}

