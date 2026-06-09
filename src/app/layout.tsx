import './globals.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

import Script from 'next/script';
import Nav from '@/app/components/nav/nav';
import type { Metadata, Viewport } from 'next';
import { config } from '@/shared/config/config';
import Footer from '@/app/components/footer/footer';
import { Plus_Jakarta_Sans } from 'next/font/google';
import GlobalProvider from '@/shared/global-context';
import ScrollToTop from '@/app/components/effects/scroll-to-top';
import ScrollReveal from '@/app/components/effects/scroll-reveal';
import PageTransition from '@/app/components/effects/page-transition';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plusJakartaSans',
});

// Runs before first paint: enables the lighter "perf-lite" CSS path on HiDPI
// displays (e.g. Retina MacBooks) or when the user prefers reduced motion, while
// standard-DPI displays keep the full-quality effects. A manually set
// `data-perf` on <html> is respected and never overridden.
const PERF_MODE_SCRIPT = `(function(){try{var e=document.documentElement;if(e.dataset.perf)return;var d=window.devicePixelRatio||1;var m=window.matchMedia;var r=m&&m('(prefers-reduced-motion: reduce)').matches;if(d>1.5||r){e.dataset.perf='lite';}}catch(_){}})();`;

export const viewport: Viewport = {
  themeColor: `#04397b`,
};

export const metadata: Metadata = {
  title: config.title,
  manifest: `/manifest.json`,
  description: config.description,
  icons: {
    icon: [
      { url: `/icon-16x16.png`, sizes: `16x16`, type: `image/png` },
      { url: `/icon-32x32.png`, sizes: `32x32`, type: `image/png` },
      { url: `/icon-192x192.png`, sizes: `192x192`, type: `image/png` },
      { url: `/icon-512x512_Circle.png`, sizes: `512x512`, type: `image/png` },
    ],
    apple: `/icon-192x192.png`,
    shortcut: `/icon-512x512_Circle.png`,
  },
};

export default function RootLayout({
  children,
  intersectionObserver = true,
}: {
  children: React.ReactNode;
  intersectionObserver?: boolean;
}) {
  return (
    <html lang={`en`} className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <link rel={`preload`} as={`image`} type={`image/gif`} href={`/assets/piratechs/gifs/Piratech-Glitch.gif`} />
      </head>
      <body className={intersectionObserver ? `revealReady` : undefined}>
        <Script id={`perf-mode-init`} strategy={`beforeInteractive`}>
          {PERF_MODE_SCRIPT}
        </Script>
        <noscript>
          <style>{`.textRevealPending,.elementRevealPending{visibility:visible !important}`}</style>
        </noscript>
        <GlobalProvider>
          <PageTransition>
            {intersectionObserver && <ScrollReveal />}
            <Nav />
            <main className={`main`}>
              {children}
            </main>
            <ScrollToTop />
            <Footer />
          </PageTransition>
        </GlobalProvider>
      </body>
    </html>
  );
}
