import '../globals.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

import type { Metadata } from 'next';

import './lab.scss';
import LabLoader from './lab-loader';
import Nav from '../components/nav/nav';
import { config } from '@/shared/config/config';
import Footer from '../components/footer/footer';
import GlobalProvider from '@/shared/global-context';
import ScrollToTop from '../components/effects/scroll-to-top';
import SmoothScroll from '../components/effects/smooth-scroll';
import MenuBlurBackdrop from '../components/effects/menu-blur-backdrop';
import ProjectQuerySheet from '../components/projects/project-query-sheet';

export const metadata: Metadata = {
  title: `Playground`,
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

// Separate root layout for the (lab) sandbox. It owns its own <html>/<body> and
// shares nothing with the main site — no Nav, no Footer, no global theme. Add a
// brand-new header/footer here when you are ready; for now it is a blank canvas.
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={`en`}>
      <body>
        <LabLoader />
        {/* Minimal lab nav: soft-navigate between lab pages to see that the
            loader does NOT replay on in-lab navigation (it persists in this
            layout). Hard-refresh a page to watch it run again. */}
        <GlobalProvider>
          <Nav navLinks={config?.nav_playground} />
          <MenuBlurBackdrop />
          <SmoothScroll>
            <main className={`main`}>
              {children}
            </main>
            <Footer />
          </SmoothScroll>
          <ProjectQuerySheet />
          <ScrollToTop />
          {/* <PageTransition>
            {intersectionObserver && <ScrollReveal />}
          </PageTransition> */}
        </GlobalProvider>
        {/* Drop a custom <Footer /> here */}
      </body>
    </html>
  );
}
