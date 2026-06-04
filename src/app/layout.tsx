import '@fortawesome/fontawesome-free/css/all.min.css';
import './globals.scss';

import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import Nav from '@/app/components/nav/nav';
import Footer from '@/app/components/footer/footer';
import GlobalProvider from '@/shared/global-context';
import { siteConfig } from '@/shared/config/site';
import ScrollReveal from '@/app/components/effects/scroll-reveal';
import ScrollToTop from '@/app/components/effects/scroll-to-top';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plusJakartaSans',
});

export const viewport: Viewport = {
  themeColor: `#04397b`,
};

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  manifest: `/manifest.json`,
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
