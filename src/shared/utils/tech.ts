export type TechnologyMeta = {
  icon: string;
  className: string;
};

export const toTechClassName = (label: string = ``) => (
  `techIcon-${label.toLowerCase().replace(/[^a-z0-9]+/g, `-`).replace(/^-|-$/g, ``)}`
);

export const technologyMap: Record<string, TechnologyMeta> = {
  [`C#`]: { icon: `fa-solid fa-code`, className: `techIcon-csharp` },
  API: { icon: `fa-solid fa-cloud`, className: `techIcon-api` },
  Auth: { icon: `fa-solid fa-key`, className: `techIcon-auth` },
  CSS: { icon: `fa-brands fa-css3-alt`, className: `techIcon-css` },
  HTML: { icon: `fa-brands fa-html5`, className: `techIcon-html` },
  JSON: { icon: `fa-solid fa-file-code`, className: `techIcon-json` },
  Maps: { icon: `fa-solid fa-map-location-dot`, className: `techIcon-maps` },
  MySQL: { icon: `fa-solid fa-database`, className: `techIcon-mysql` },
  PHP: { icon: `fa-brands fa-php`, className: `techIcon-php` },
  PWA: { icon: `fa-solid fa-mobile-screen-button`, className: `techIcon-pwa` },
  SQL: { icon: `fa-solid fa-database`, className: `techIcon-sql` },
  Sass: { icon: `fa-brands fa-sass`, className: `techIcon-sass` },
  Unity: { icon: `fa-brands fa-unity`, className: `techIcon-unity` },
  Admin: { icon: `fa-solid fa-user-gear`, className: `techIcon-admin` },
  Angular: { icon: `fa-brands fa-angular`, className: `techIcon-angular` },
  Data: { icon: `fa-solid fa-database`, className: `techIcon-data` },
  DataUI: { icon: `fa-solid fa-table-cells-large`, className: `techIcon-data-ui` },
  Firebase: { icon: `fa-solid fa-fire-flame-curved`, className: `techIcon-firebase` },
  GitHub: { icon: `fa-brands fa-github`, className: `techIcon-github` },
  JavaScript: { icon: `fa-brands fa-js`, className: `techIcon-javascript` },
  Motion: { icon: `fa-solid fa-wand-magic-sparkles`, className: `techIcon-motion` },
  NextJS: { icon: `fa-solid fa-n`, className: `techIcon-next-js` },
  Python: { icon: `fa-brands fa-python`, className: `techIcon-python` },
  React: { icon: `fa-brands fa-react`, className: `techIcon-react` },
  Shopify: { icon: `fa-brands fa-shopify`, className: `techIcon-shopify` },
  TypeScript: { icon: `fa-solid fa-code`, className: `techIcon-typescript` },
  WeatherAPI: { icon: `fa-solid fa-cloud-sun`, className: `techIcon-weather-api` },
  WebSockets: { icon: `fa-solid fa-network-wired`, className: `techIcon-websockets` },
  WordPress: { icon: `fa-brands fa-wordpress`, className: `techIcon-wordpress` },
};

export const getTechnologyMeta = (label: string): TechnologyMeta => {
  const key = label.replace(/\.js/gi, `JS`).replace(/[^a-zA-Z0-9#]/g, ``);
  return technologyMap[key] ?? { icon: `fa-solid fa-code`, className: toTechClassName(label) };
};
