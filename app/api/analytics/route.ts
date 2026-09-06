import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      eventType,
      articleId,
      productId,
      campaignId,
      placement,
      destinationUrl,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      referrer,
      device,
    } = body;

    if (!eventType) {
      return NextResponse.json({ error: 'Missing eventType' }, { status: 400 });
    }

    // Record in AnalyticsEvent
    await prisma.analyticsEvent.create({
      data: {
        eventType,
        articleId: articleId || null,
        productId: productId || null,
        campaignId: campaignId || null,
        placement: placement || null,
        destinationUrl: destinationUrl || null,
        utmSource: utmSource || 'as_heritage_mag',
        utmMedium: utmMedium || null,
        utmCampaign: utmCampaign || null,
        utmContent: utmContent || null,
        referrer: referrer || null,
        device: device || 'desktop',
      },
    });

    // If article view, increment view count on article
    if (eventType === 'article_view' && articleId) {
      await prisma.article.update({
        where: { id: articleId },
        data: { viewsCount: { increment: 1 } },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics event error:', error);
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}
