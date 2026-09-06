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
