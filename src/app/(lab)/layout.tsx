import type { Metadata } from 'next';

import './lab.scss';
import LabLoader from './lab-loader';

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
        {/* Drop a custom <Header /> here */}
        {children}
        {/* Drop a custom <Footer /> here */}
      </body>
    </html>
  );
}
