import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

const ALLOWED_EVENT_TYPES = [
  'article_view',
  'product_click',
  'contextual_link_click',
  'banner_click',
  'outbound_asbrand_click',
  'marketplace_click',
];

// In-memory rate limiting: max 60 events per IP per minute
const eventRateLimit = new Map<string, { count: number; resetTime: number }>();
const MAX_EVENTS_PER_MINUTE = 60;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = eventRateLimit.get(ip);
  if (!record || now > record.resetTime) {
    eventRateLimit.set(ip, { count: 1, resetTime: now + 60000 });
    return false;
  }
  if (record.count >= MAX_EVENTS_PER_MINUTE) {
    return true;
  }
  record.count += 1;
  return false;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function sanitizeString(val: any, maxLength = 150): string | null {
  if (typeof val !== 'string') return null;
  const trimmed = val.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}

export async function POST(request: Request) {
  const clientIp = getClientIp(request);
  if (isRateLimited(clientIp)) {
    return NextResponse.json({ error: 'Too many analytics events' }, { status: 429 });
  }

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

    // Validate eventType
    if (!eventType || typeof eventType !== 'string' || !ALLOWED_EVENT_TYPES.includes(eventType)) {
      return NextResponse.json({ error: 'Invalid or unsupported eventType' }, { status: 400 });
    }

    // Record in AnalyticsEvent with clamped lengths
    await prisma.analyticsEvent.create({
      data: {
        eventType,
        articleId: sanitizeString(articleId, 64),
        productId: sanitizeString(productId, 64),
        campaignId: sanitizeString(campaignId, 64),
        placement: sanitizeString(placement, 64),
        destinationUrl: sanitizeString(destinationUrl, 500),
        utmSource: sanitizeString(utmSource, 64) || 'as_heritage_mag',
        utmMedium: sanitizeString(utmMedium, 64),
        utmCampaign: sanitizeString(utmCampaign, 64),
        utmContent: sanitizeString(utmContent, 100),
        referrer: sanitizeString(referrer, 500),
        device: sanitizeString(device, 32) || 'desktop',
      },
    });

    // If article view, increment view count safely
    if (eventType === 'article_view' && typeof articleId === 'string' && articleId.length < 64) {
      await prisma.article.update({
        where: { id: articleId },
        data: { viewsCount: { increment: 1 } },
      }).catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record event' }, { status: 500 });
  }
}
