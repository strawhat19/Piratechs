import withPWA from 'next-pwa';
import type { NextConfig } from 'next';

const routes = {
  about: { redirects: [`info`, `aboutme`, `about-us`, `about-me`] },
  projects: { redirects: [`work`, `portfolio`] },
  services: { redirects: [`solutions`, `consulting`, `development`] },
  store: { redirects: [`shop`, `products`, `catalog`] },
  features: { redirects: [`stack`, `platform`, `capabilities`] },
  gallery: { redirects: [`media`, `screenshots`, `pictures`] },
  contact: { redirects: [`contactme`, `contact-us`, `get-in-touch`] },
  [`case-studies`]: { redirects: [] },
};

// Clean URLs for the (lab) sandbox pages, rewritten to their pages/ targets the
// same way the main routes above are (e.g. /playground -> /pages/playground).
const labRoutes = [`playground`, `sandbox`];

const nextConfig: NextConfig = {
  turbopack: {},
  devIndicators: false,
  reactStrictMode: true,
  rewrites: async () => [
    ...Object.keys(routes).map(route => ({
      source: `/${route}`,
      destination: `/pages/${route}`,
    })),
    ...labRoutes.map(route => ({
      source: `/${route}`,
      destination: `/pages/${route}`,
    })),
    {
      source: `/case-studies/:projectName`,
      destination: `/pages/case-studies/:projectName`,
    },
  ],
  redirects: async () => [
    {
      source: `/projects/:projectName`,
      destination: `/case-studies/:projectName`,
      permanent: true,
    },
    ...Object.entries(routes).flatMap(([route, config]) => (
      config.redirects.map(alias => ({
        source: `/${alias}`,
        destination: `/${route}`,
        permanent: true,
      }))
    )),
  ],
  images: {
    remotePatterns: [
      {
        pathname: `/**`,
        protocol: `https`,
        hostname: `raw.githubusercontent.com`,
      },
    ],
  },
  allowedDevOrigins: [
    `local-origin.dev`,
    `*.local-origin.dev`,
    `http://localhost:3000`,
    `http://127.0.0.1:3000`,
    `raw.githubusercontent.com`,
    `*.raw.githubusercontent.com`,
  ],
};

export default withPWA({
  dest: `public`,
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== `production`,
})(nextConfig as any);
