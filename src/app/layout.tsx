import './globals.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Nav from '@/app/components/nav/nav';
import type { Metadata, Viewport } from 'next';
import { siteConfig } from '@/shared/config/site';
import Footer from '@/app/components/footer/footer';
import { Plus_Jakarta_Sans } from 'next/font/google';
import GlobalProvider from '@/shared/global-context';
import ScrollToTop from '@/app/components/effects/scroll-to-top';
import ScrollReveal from '@/app/components/effects/scroll-reveal';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plusJakartaSans',
});

export const viewport: Viewport = {
  themeColor: `#04397b`,
};

export const metadata: Metadata = {
  title: siteConfig.title,
  manifest: `/manifest.json`,
  description: siteConfig.description,
  icons: {
    icon: `/icon-192x192.png`,
    apple: `/icon-192x192.png`,
    shortcut: `/icon-512x512.png`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={`en`} className={plusJakartaSans.variable}>
      <body className={`revealReady`}>
        <GlobalProvider>
          <ScrollReveal />
          <Nav />
          <main className={`siteMain`}>
            {children}
          </main>
          <ScrollToTop />
          <Footer />
        </GlobalProvider>
      </body>
    </html>
  );
}
