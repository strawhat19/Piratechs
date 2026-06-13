import Link from 'next/link';
import type { Metadata } from 'next';
import { config } from '@/shared/config/config';
import { Plus_Jakarta_Sans } from 'next/font/google';

import './globals.scss';
import '@fortawesome/fontawesome-free/css/all.min.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plusJakartaSans',
});

export const metadata: Metadata = {
  title: `Not Found // ${config.title}`,
};

// Global fallback for URLs that match no route group. Because the app now uses
// multiple root layouts (one per route group), there is no shared root layout to
// wrap this page, so it renders its own <html>/<body>. Branded but intentionally
// free of the reveal-on-scroll effects so the content is always visible.
export default function GlobalNotFound() {
  return (
    <html lang={`en`} className={plusJakartaSans.variable}>
      <body>
        <main
          style={{
            gap: `1rem`,
            padding: `2rem`,
            display: `flex`,
            textAlign: `center`,
            minHeight: `100dvh`,
            alignItems: `center`,
            flexDirection: `column`,
            justifyContent: `center`,
          }}
        >
          <span className={`eyebrow`}>404</span>
          <h1 className={`bannerText`}>Not Found</h1>
          <p>We could not find what you were looking for.</p>
          <Link href={`/`} className={`buttonLink primary`}>
            <i className={`fa-solid fa-house`} />
            <span>Back To Home</span>
          </Link>
        </main>
      </body>
    </html>
  );
}
