import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Yasithma Products | Pure Ceylon Botanicals, Naturally Yours',
    template: '%s | Yasithma Products',
  },
  description:
    'Discover authentic Sri Lankan herbal teas, finely milled botanical powders, and natural wellness products from Yasithma Products.',
  keywords: [
    'Ceylon herbal tea',
    'Sri Lankan herbal powders',
    'Blue Butterfly Flower tea',
    'Heen Bovitiya powder',
    'Welpenala powder',
    'Yasithma Products',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    siteName: 'Yasithma Products',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} scroll-smooth`}>
      <body className="bg-ivory text-botanicalText font-sans antialiased selection:bg-forest selection:text-ivory">
        {children}
      </body>
    </html>
  );
}
