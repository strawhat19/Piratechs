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
import ProjectQuerySheet from '@/app/components/projects/project-query-sheet';
import MenuBlurBackdrop from '@/app/components/effects/menu-blur-backdrop';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plusJakartaSans',
});

// Runs before first paint: enables the lighter "perf-lite" CSS path on HiDPI
// displays (e.g. Retina MacBooks) or when the user prefers reduced motion, while
// standard-DPI displays keep the full-quality effects. A manually set
// `data-perf` on <html> is respected and never overridden.
const PERF_MODE_SCRIPT = `(function(){try{var e=document.documentElement;if(e.dataset.perf)return;var d=window.devicePixelRatio||1;var m=window.matchMedia;var r=m&&m('(prefers-reduced-motion: reduce)').matches;if(d>1.5||r){e.dataset.perf='lite';}}catch(_){}})();`;

// Runs before hydration: drives the initial loader progress bar so it ramps
// immediately instead of freezing at its server-rendered value until the heavy
// JS bundle finishes hydrating. PageTransition reads `__plProgress` on mount and
// continues the ramp seamlessly.
const LOADER_RAMP_SCRIPT = `(function(){try{var w=window;if(w.matchMedia&&w.matchMedia('(prefers-reduced-motion: reduce)').matches){w.__plProgress=100;return;}var c=94,p=3;w.__plProgress=p;function paint(){var b=document.querySelector('[data-pl-fill]');var t=document.querySelector('[data-pl-pct]');if(b)b.style.width=p+'%';if(t)t.textContent=Math.round(p)+'%';}function tick(){if(w.__plDone)return;p=Math.min(c,p+Math.max(0.5,(c-p)*0.055));w.__plProgress=p;paint();}paint();w.__plTimer=w.setInterval(tick,90);}catch(_){}})();`;

export const viewport: Viewport = {
  themeColor: `#04397b`,
};

export const metadata: Metadata = {
  title: config.title,
  manifest: `/manifest.json`,
  description: config.description,
  icons: {
    icon: [
      { url: `/icon-16x16_Circle.png`, sizes: `16x16`, type: `image/png` },
      { url: `/icon-32x32_Circle.png`, sizes: `32x32`, type: `image/png` },
      { url: `/icon-192x192_Circle.png`, sizes: `192x192`, type: `image/png` },
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
    <html lang={`en`} data-scroll-behavior={`smooth`} className={plusJakartaSans.variable} suppressHydrationWarning>
      <head>
        <link rel={`preload`} as={`image`} type={`image/gif`} href={`/assets/piratechs/gifs/Piratech-Glitch.gif`} />
      </head>
      <body className={intersectionObserver ? `revealReady pageTransitionPending` : `pageTransitionPending`}>
        <Script id={`perf-mode-init`} strategy={`beforeInteractive`}>
          {PERF_MODE_SCRIPT}
        </Script>
        <Script id={`loader-ramp-init`} strategy={`beforeInteractive`}>
          {LOADER_RAMP_SCRIPT}
        </Script>
        <noscript>
          <style>{`.pageTransitionShutter{display:none!important}.textRevealPending,.elementRevealPending{visibility:visible!important}body.pageTransitionPending .reveal{opacity:1!important;transform:none!important;animation:none!important}body.pageTransitionPending .heroBg::before,body.pageTransitionPending .gridPlane,body.pageTransitionPending .signalLine{opacity:1!important;transform:none!important;animation:none!important;clip-path:none!important}body{overflow:auto!important}`}</style>
        </noscript>
        <GlobalProvider>
          <PageTransition>
            {intersectionObserver && <ScrollReveal />}
            <Nav />
            <MenuBlurBackdrop />
            <main className={`main`}>
              {children}
            </main>
            <ProjectQuerySheet />
            <ScrollToTop />
            <Footer />
          </PageTransition>
        </GlobalProvider>
      </body>
    </html>
  );
}
