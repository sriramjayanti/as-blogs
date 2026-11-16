import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function calculateReadingTime(content: string): number {
  if (!content) return 1;
  const words = content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function isUnoptimizedImage(src?: string | null): boolean {
  if (!src) return false;
  if (src.startsWith('data:') || src.startsWith('blob:')) return true;
  if (src.startsWith('http://') || src.startsWith('https://')) {
    const allowed = ['asbrandoils.com', 'images.unsplash.com', 'www.lekhafoods.com', 'lekhafoods.com'];
    try {
      const url = new URL(src);
      return !allowed.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));
    } catch {
      return true;
    }
  }
  return false;
}

export function getSiteUrl(): string {
  // 1. Explicitly configured NEXT_PUBLIC_SITE_URL (must not be localhost or external ecommerce store)
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl && !envUrl.includes('asbrandoils.com') && !envUrl.includes('localhost')) {
    return envUrl.startsWith('http') ? envUrl.replace(/\/+$/, '') : `https://${envUrl.replace(/\/+$/, '')}`;
  }

  // 2. Vercel deployment URLs (set automatically by Vercel hosting)
  const vercelProjectUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercelProjectUrl) {
    return `https://${vercelProjectUrl.replace(/\/+$/, '')}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim() || process.env.NEXT_PUBLIC_VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/+$/, '')}`;
  }

  // 3. Fallback when running locally or if envUrl contains a valid protocol
  if (envUrl && !envUrl.includes('asbrandoils.com')) {
    return envUrl.startsWith('http') ? envUrl.replace(/\/+$/, '') : `https://${envUrl.replace(/\/+$/, '')}`;
  }

  // 4. Default production blog deployment domain
  return 'https://as-blogs-three.vercel.app';
}
