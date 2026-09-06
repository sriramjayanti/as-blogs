import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ReadingProgressBar from '@/components/ReadingProgressBar';
import { generateOrganizationJsonLd } from '@/lib/seo';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'A.S. Heritage & Living | Indian Culinary, Wellness & Culture',
    template: '%s | A.S. Heritage & Living',
  },
  description:
    'Discover authentic Indian culinary science, cold-pressed oil smoke points, heirloom recipes, Ayurvedic wellness, and sacred Pooja deepam traditions.',
  keywords: [
    'gingelly oil',
    'sesame oil',
    'groundnut oil',
    'pancha thailam',
    'deepam oil',
    'indian cooking oils',
    'south indian recipes',
    'cold pressed oils',
  ],
  authors: [{ name: 'A.S. Heritage Editorial Staff' }],
  creator: 'A.S. Heritage & Living',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://asbrandoils.com/',
    siteName: 'A.S. Heritage & Living',
    title: 'A.S. Heritage & Living | Indian Culinary, Wellness & Culture',
    description:
      'Discover authentic Indian culinary science, cold-pressed oil smoke points, heirloom recipes, Ayurvedic wellness, and sacred Pooja deepam traditions.',
    images: [
      {
        url: 'https://asbrandoils.com/cdn/shop/files/Gingelly_oil_1_720x.png?v=1721982944',
        width: 720,
        height: 720,
        alt: 'A.S. Brand Heritage Oils',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A.S. Heritage & Living',
    description: 'Indian Culinary Science, Heirloom Recipes & Cultural Living',
    creator: '@asbrandoils',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgJsonLd = generateOrganizationJsonLd();

  return (
    <html lang="en" className={`${playfair.variable} ${plusJakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-gold-200 selection:text-forest-950">
        <ReadingProgressBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
