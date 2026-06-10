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

const nextConfig: NextConfig = {
  turbopack: {},
  devIndicators: false,
  reactStrictMode: true,
  rewrites: async () => [
    ...Object.keys(routes).map(route => ({
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
  allowedDevOrigins: [
    `local-origin.dev`,
    `*.local-origin.dev`,
    `http://localhost:3000`,
    `http://127.0.0.1:3000`
  ],
};

export default withPWA({
  dest: `public`,
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV !== `production`,
})(nextConfig as any);
