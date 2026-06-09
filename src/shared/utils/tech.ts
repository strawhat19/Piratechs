export type TechnologyMeta = {
  icon: string;
  className: string;
};

export const toTechClassName = (label: string = ``) => (
  `techIcon-${label.toLowerCase().replace(/[^a-z0-9]+/g, `-`).replace(/^-|-$/g, ``)}`
);

const csharp = { icon: `fa-solid fa-code`, className: `techIcon-csharp` };

export const technologyMap: Record<string, TechnologyMeta> = {
  csharp,
  [`c#`]: csharp,
  api: { icon: `fa-solid fa-cloud`, className: `techIcon-api` },
  auth: { icon: `fa-solid fa-key`, className: `techIcon-auth` },
  css: { icon: `fa-brands fa-css3-alt`, className: `techIcon-css` },
  html: { icon: `fa-brands fa-html5`, className: `techIcon-html` },
  json: { icon: `fa-solid fa-file-code`, className: `techIcon-json` },
  maps: { icon: `fa-solid fa-map-location-dot`, className: `techIcon-maps` },
  mysql: { icon: `fa-solid fa-database`, className: `techIcon-mysql` },
  php: { icon: `fa-brands fa-php`, className: `techIcon-php` },
  pwa: { icon: `fa-solid fa-mobile-screen-button`, className: `techIcon-pwa` },
  sql: { icon: `fa-solid fa-database`, className: `techIcon-sql` },
  sass: { icon: `fa-brands fa-sass`, className: `techIcon-sass` },
  unity: { icon: `fa-brands fa-unity`, className: `techIcon-unity` },
  admin: { icon: `fa-solid fa-user-gear`, className: `techIcon-admin` },
  angular: { icon: `fa-brands fa-angular`, className: `techIcon-angular` },
  data: { icon: `fa-solid fa-database`, className: `techIcon-data` },
  dataui: { icon: `fa-solid fa-table-cells-large`, className: `techIcon-data-ui` },
  firebase: { icon: `fa-solid fa-fire-flame-curved`, className: `techIcon-firebase` },
  github: { icon: `fa-brands fa-github`, className: `techIcon-github` },
  javascript: { icon: `fa-brands fa-js`, className: `techIcon-javascript` },
  motion: { icon: `fa-solid fa-wand-magic-sparkles`, className: `techIcon-motion` },
  nextjs: { icon: `fa-solid fa-n`, className: `techIcon-next-js` },
  python: { icon: `fa-brands fa-python`, className: `techIcon-python` },
  react: { icon: `fa-brands fa-react`, className: `techIcon-react` },
  shopify: { icon: `fa-brands fa-shopify`, className: `techIcon-shopify` },
  typescript: { icon: `fa-solid fa-code`, className: `techIcon-typescript` },
  weatherapi: { icon: `fa-solid fa-cloud-sun`, className: `techIcon-weather-api` },
  websockets: { icon: `fa-solid fa-network-wired`, className: `techIcon-websockets` },
  wordpress: { icon: `fa-brands fa-wordpress`, className: `techIcon-wordpress` },
};

export const getTechnologyMeta = (label: string): TechnologyMeta => {
  const key = label.replace(/\.js/gi, `JS`).replace(/[^a-zA-Z0-9#]/g, ``);
  return technologyMap[key] ?? { icon: `fa-solid fa-code`, className: toTechClassName(label) };
};
