'use client';

import { useEffect } from 'react';

export async function trackPromoEvent(data: {
  eventType: string;
  articleId?: string;
  productId?: string;
  campaignId?: string;
  placement?: string;
  destinationUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
}) {
  try {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        referrer: typeof document !== 'undefined' ? document.referrer : '',
        device: typeof window !== 'undefined' && window.innerWidth < 768 ? 'mobile' : 'desktop',
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Fail silently to avoid breaking UX
  }
}

export default function AnalyticsTracker({ articleId }: { articleId?: string }) {
  useEffect(() => {
    // 1. Track article view
    if (articleId) {
      trackPromoEvent({
        eventType: 'article_view',
        articleId,
        placement: 'page_load',
      });
    }

    // 2. Attach global delegate listener for contextual links and outbound buttons
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const isContextLink = target.classList.contains('as-context-link');
      const productId = target.getAttribute('data-product-id');

      if (isContextLink) {
        trackPromoEvent({
          eventType: 'contextual_link_click',
          articleId,
          productId: productId || undefined,
          placement: 'contextual_intext',
          destinationUrl: href,
        });
      } else if (href.includes('asbrandoils.com')) {
        trackPromoEvent({
          eventType: 'outbound_asbrand_click',
          articleId,
          productId: productId || undefined,
          placement: target.getAttribute('data-placement') || 'general_link',
          destinationUrl: href,
        });
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [articleId]);

  return null;
}
